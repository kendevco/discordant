-- Enhanced Image Search with Member Activity Integration
-- This query finds images with member presence and activity context
-- Updated to leverage the MemberActivity table and OnlineStatus system

-- Parameters:
-- @searchQuery: Text to search in message content (optional)
-- @dayRange: Number of days to look back (default: 365 for all images, 30 for recent)
-- @channelId: Specific channel ID (optional)
-- @onlineStatus: Filter by member online status (ONLINE, AWAY, DO_NOT_DISTURB, OFFLINE)
-- @activeOnly: Boolean - only show results from currently active members
-- @sortByActivity: Boolean - sort results by member activity instead of message time
-- @resultLimit: Maximum number of results (default: 20)

WITH image_messages AS (
  SELECT 
    m.id,
    m.content,
    m.fileUrl,
    m.createdAt,
    m.channelId,
    m.memberId,
    c.name as channelName,
    c.type as channelType,
    mem.profileId,
    mem.onlineStatus,
    mem.lastSeen,
    mem.isOnline,
    p.name as memberName,
    p.imageUrl as memberAvatar,
    p.email as memberEmail
  FROM message m
  INNER JOIN channel c ON m.channelId = c.id
  INNER JOIN member mem ON m.memberId = mem.id
  INNER JOIN profile p ON mem.profileId = p.id
  WHERE 
    -- Core image detection (handles both old and new UploadThing formats)
    m.fileUrl IS NOT NULL
    AND (
      -- Traditional image files with extensions
      (
        m.fileUrl LIKE '%.jpg' OR m.fileUrl LIKE '%.jpeg' OR 
        m.fileUrl LIKE '%.png' OR m.fileUrl LIKE '%.gif' OR 
        m.fileUrl LIKE '%.webp' OR m.fileUrl LIKE '%.svg' OR
        m.fileUrl LIKE '%.bmp' OR m.fileUrl LIKE '%.tiff'
      )
      OR
      -- Modern UploadThing URLs (both domains)
      (m.fileUrl LIKE '%utfs.io%' OR m.fileUrl LIKE '%uploadthing.com%')
    )
    AND m.deleted = FALSE
    
    -- Date range filter
    AND m.createdAt >= DATE_SUB(NOW(), INTERVAL COALESCE(@dayRange, 365) DAY)
    
    -- Optional text search in content
    AND (
      @searchQuery IS NULL 
      OR @searchQuery = '' 
      OR m.content LIKE CONCAT('%', @searchQuery, '%')
    )
    
    -- Optional channel filter
    AND (
      @channelId IS NULL 
      OR @channelId = '' 
      OR m.channelId = @channelId
    )
    
    -- Optional online status filter
    AND (
      @onlineStatus IS NULL 
      OR @onlineStatus = '' 
      OR mem.onlineStatus = @onlineStatus
    )
    
    -- Optional active members only filter
    AND (
      @activeOnly IS NULL 
      OR @activeOnly = FALSE 
      OR (
        mem.isOnline = TRUE 
        AND mem.lastSeen >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      )
    )
),

member_activity_summary AS (
  SELECT 
    ma.memberId,
    COUNT(*) as totalActivities,
    MAX(ma.timestamp) as lastActivityTime,
    GROUP_CONCAT(DISTINCT ma.activityType ORDER BY ma.timestamp DESC LIMIT 5) as recentActivities,
    COUNT(CASE WHEN ma.activityType = 'MESSAGE_SENT' THEN 1 END) as messagesSent,
    COUNT(CASE WHEN ma.activityType = 'FILE_UPLOADED' THEN 1 END) as filesUploaded,
    COUNT(CASE WHEN ma.activityType = 'VOICE_JOINED' THEN 1 END) as voiceJoined
  FROM member_activity ma
  WHERE ma.timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  GROUP BY ma.memberId
),

channel_activity_stats AS (
  SELECT 
    c.id as channelId,
    COUNT(DISTINCT m.memberId) as uniqueMembers,
    COUNT(m.id) as totalMessages,
    COUNT(CASE WHEN m.fileUrl IS NOT NULL THEN 1 END) as fileMessages,
    MAX(m.createdAt) as lastMessageTime,
    COUNT(CASE WHEN m.createdAt >= DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 END) as recentMessages
  FROM channel c
  LEFT JOIN message m ON c.id = m.channelId AND m.deleted = FALSE
  WHERE m.createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  GROUP BY c.id
)

SELECT 
  im.id,
  im.content,
  im.fileUrl,
  im.createdAt,
  im.channelId,
  im.channelName,
  im.channelType,
  im.memberId,
  im.memberName,
  im.memberAvatar,
  im.memberEmail,
  im.onlineStatus,
  im.lastSeen,
  im.isOnline,
  
  -- Member activity metrics
  COALESCE(mas.totalActivities, 0) as memberTotalActivities,
  COALESCE(mas.lastActivityTime, im.lastSeen) as memberLastActivity,
  COALESCE(mas.recentActivities, '') as memberRecentActivities,
  COALESCE(mas.messagesSent, 0) as memberMessagesSent,
  COALESCE(mas.filesUploaded, 0) as memberFilesUploaded,
  COALESCE(mas.voiceJoined, 0) as memberVoiceJoined,
  
  -- Channel activity metrics
  COALESCE(cas.uniqueMembers, 0) as channelUniqueMembers,
  COALESCE(cas.totalMessages, 0) as channelTotalMessages,
  COALESCE(cas.fileMessages, 0) as channelFileMessages,
  COALESCE(cas.lastMessageTime, im.createdAt) as channelLastActivity,
  COALESCE(cas.recentMessages, 0) as channelRecentMessages,
  
  -- Calculated scores for sorting
  CASE 
    WHEN im.isOnline THEN 100 
    WHEN im.onlineStatus = 'AWAY' THEN 75
    WHEN im.onlineStatus = 'DO_NOT_DISTURB' THEN 50
    ELSE 25 
  END as presenceScore,
  
  TIMESTAMPDIFF(HOUR, COALESCE(mas.lastActivityTime, im.lastSeen), NOW()) as hoursSinceActivity,
  
  -- File type detection for better categorization
  CASE 
    WHEN im.fileUrl LIKE '%.jpg' OR im.fileUrl LIKE '%.jpeg' THEN 'JPEG'
    WHEN im.fileUrl LIKE '%.png' THEN 'PNG'
    WHEN im.fileUrl LIKE '%.gif' THEN 'GIF'
    WHEN im.fileUrl LIKE '%.webp' THEN 'WEBP'
    WHEN im.fileUrl LIKE '%.svg' THEN 'SVG'
    WHEN im.fileUrl LIKE '%utfs.io%' OR im.fileUrl LIKE '%uploadthing.com%' THEN 'UPLOAD_THING'
    ELSE 'OTHER'
  END as detectedFileType

FROM image_messages im
LEFT JOIN member_activity_summary mas ON im.memberId = mas.memberId
LEFT JOIN channel_activity_stats cas ON im.channelId = cas.channelId

ORDER BY 
  CASE 
    WHEN @sortByActivity = TRUE THEN
      -- Sort by member activity and presence
      (presenceScore * 0.3 + 
       (100 - LEAST(hoursSinceActivity, 100)) * 0.4 + 
       LEAST(COALESCE(mas.totalActivities, 0), 100) * 0.3)
    ELSE
      -- Sort by message recency
      UNIX_TIMESTAMP(im.createdAt)
  END DESC,
  im.createdAt DESC

LIMIT COALESCE(@resultLimit, 20);

-- Example usage queries:

-- 1. All images with member activity context (comprehensive search)
-- SET @searchQuery = NULL, @dayRange = 365, @channelId = NULL, @onlineStatus = NULL, @activeOnly = FALSE, @sortByActivity = FALSE, @resultLimit = 50;

-- 2. Recent images from online members only
-- SET @searchQuery = NULL, @dayRange = 30, @channelId = NULL, @onlineStatus = 'ONLINE', @activeOnly = TRUE, @sortByActivity = TRUE, @resultLimit = 20;

-- 3. Images in specific channel with content search
-- SET @searchQuery = 'screenshot', @dayRange = 90, @channelId = 'your-channel-id', @onlineStatus = NULL, @activeOnly = FALSE, @sortByActivity = FALSE, @resultLimit = 10;

-- 4. Most active members' images (sorted by activity)
-- SET @searchQuery = NULL, @dayRange = 60, @channelId = NULL, @onlineStatus = NULL, @activeOnly = FALSE, @sortByActivity = TRUE, @resultLimit = 25;

-- 5. Images from away/DND members (catching up on missed content)
-- SET @searchQuery = NULL, @dayRange = 7, @channelId = NULL, @onlineStatus = 'AWAY', @activeOnly = FALSE, @sortByActivity = FALSE, @resultLimit = 15;

-- Performance Notes:
-- - This query uses proper indexes on memberId, channelId, timestamp, and activityType
-- - The CTE approach optimizes the complex joins
-- - Results include rich member and channel context for intelligent filtering
-- - Activity scoring allows for presence-aware search results
-- - File type detection works with both legacy and modern UploadThing URLs

-- Integration Notes for n8n:
-- - Use this query in a MySQL node
-- - Set parameters using n8n's $fromAI() or manual variables
-- - Results provide comprehensive context for follow-up actions
-- - Member activity data enables intelligent notifications and recommendations
-- - Channel activity stats help identify trending/active channels 