-- Permission-aware message search query for n8n
-- This ensures users only see messages from servers they're members of
-- and channels they have access to

SELECT 
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
  END as contentType
FROM message m
-- Join to get message author info
INNER JOIN member msg_member ON m.memberId = msg_member.id
INNER JOIN profile p ON msg_member.profileId = p.id
-- Join to get channel and server info
INNER JOIN channel c ON m.channelId = c.id
INNER JOIN server s ON c.serverId = s.id
-- CRITICAL: Check user has access to this server
INNER JOIN member user_member ON user_member.serverId = s.id 
                              AND user_member.profileId = '{{ $json.userId }}'
WHERE 
  -- Search in content or file names
  (m.content LIKE '%{{ $json.searchQuery }}%' 
   OR m.fileUrl LIKE '%{{ $json.searchQuery }}%')
  -- Optional: Date range filter
  AND m.createdAt >= DATE_SUB(NOW(), INTERVAL {{ $json.dayRange || 30 }} DAY)
  -- Optional: Channel type filter (TEXT, AUDIO, VIDEO)
  AND (c.type = 'TEXT' OR '{{ $json.includeAllChannelTypes }}' = 'true')
  -- Optional: Specific server filter
  AND ('{{ $json.serverId }}' = '' OR s.id = '{{ $json.serverId }}')
  -- Optional: Specific channel filter
  AND ('{{ $json.channelId }}' = '' OR c.id = '{{ $json.channelId }}')
ORDER BY 
  m.createdAt DESC
LIMIT 10; 