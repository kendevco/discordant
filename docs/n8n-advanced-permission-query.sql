-- Advanced permission-aware search with private channel support
-- This handles both server membership AND channel-specific permissions

SELECT DISTINCT
  m.id,
  m.content,
  m.fileUrl,
  m.createdAt,
  m.role as messageRole,
  p.name as userName,
  p.imageUrl as userAvatar,
  c.name as channelName,
  c.type as channelType,
  s.name as serverName,
  s.id as serverId,
  CASE 
    WHEN m.fileUrl LIKE '%.jpg' OR m.fileUrl LIKE '%.png' OR m.fileUrl LIKE '%.gif' OR m.fileUrl LIKE '%.jpeg' OR m.fileUrl LIKE '%.webp' THEN 'image'
    WHEN m.fileUrl LIKE '%.pdf' THEN 'document'
    WHEN m.fileUrl LIKE '%.mp4' OR m.fileUrl LIKE '%.mov' OR m.fileUrl LIKE '%.avi' THEN 'video'
    WHEN m.fileUrl LIKE '%.mp3' OR m.fileUrl LIKE '%.wav' THEN 'audio'
    WHEN m.fileUrl IS NOT NULL THEN 'file'
    ELSE 'text'
  END as contentType,
  -- Include permission context
  user_member.role as userRole
FROM message m
-- Join to get message author info
INNER JOIN member msg_member ON m.memberId = msg_member.id
INNER JOIN profile p ON msg_member.profileId = p.id
-- Join to get channel and server info
INNER JOIN channel c ON m.channelId = c.id
INNER JOIN server s ON c.serverId = s.id
-- Get user's membership in this server
INNER JOIN member user_member ON user_member.serverId = s.id 
                              AND user_member.profileId = '{{ $json.userId }}'
WHERE 
  -- Search criteria
  (m.content LIKE '%{{ $json.searchQuery }}%' 
   OR m.fileUrl LIKE '%{{ $json.searchQuery }}%')
  -- Date range
  AND m.createdAt >= DATE_SUB(NOW(), INTERVAL {{ $json.dayRange || 30 }} DAY)
  -- Channel access rules
  AND (
    -- User is server ADMIN or MODERATOR (can see all channels)
    user_member.role IN ('ADMIN', 'MODERATOR')
    OR
    -- Channel is public (assuming you have a way to mark channels as public/private)
    -- You might need to add a 'isPrivate' field to your channel table
    c.id NOT IN (
      SELECT channelId FROM channel_permissions WHERE type = 'PRIVATE'
    )
    OR
    -- User has explicit access to this private channel
    -- This assumes you have a channel_permissions or channel_members table
    EXISTS (
      SELECT 1 FROM channel_members cm 
      WHERE cm.channelId = c.id 
      AND cm.memberId = user_member.id
    )
  )
ORDER BY 
  m.createdAt DESC
LIMIT 10; 