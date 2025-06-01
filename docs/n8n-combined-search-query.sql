-- Combined Channel + DM search with full permission checks
-- Returns up to 10 results total from both sources

(
  -- Channel Messages
  SELECT 
    m.id,
    m.content,
    m.fileUrl,
    m.createdAt,
    p.name as userName,
    p.imageUrl as userAvatar,
    c.name as locationName,
    'CHANNEL' as locationType,
    s.name as serverName,
    s.id as serverId,
    c.id as channelId,
    NULL as conversationId
  FROM message m
  INNER JOIN member msg_member ON m.memberId = msg_member.id
  INNER JOIN profile p ON msg_member.profileId = p.id
  INNER JOIN channel c ON m.channelId = c.id
  INNER JOIN server s ON c.serverId = s.id
  -- Permission check: user must be member of server
  INNER JOIN member user_member ON user_member.serverId = s.id 
                                AND user_member.profileId = '{{ $json.userId }}'
  WHERE 
    (m.content LIKE '%{{ $json.searchQuery }}%' 
     OR m.fileUrl LIKE '%{{ $json.searchQuery }}%')
    AND m.createdAt >= DATE_SUB(NOW(), INTERVAL {{ $json.dayRange || 30 }} DAY)
)
UNION ALL
(
  -- Direct Messages
  SELECT 
    dm.id,
    dm.content,
    dm.fileUrl,
    dm.createdAt,
    p.name as userName,
    p.imageUrl as userAvatar,
    other_p.name as locationName,
    'DM' as locationType,
    NULL as serverName,
    NULL as serverId,
    NULL as channelId,
    conv.id as conversationId
  FROM directmessage dm
  INNER JOIN conversation conv ON dm.conversationId = conv.id
  INNER JOIN member sender_member ON dm.memberId = sender_member.id
  INNER JOIN profile p ON sender_member.profileId = p.id
  INNER JOIN member other_member ON 
    (conv.memberOneId = other_member.id AND conv.memberTwoId = sender_member.id)
    OR 
    (conv.memberTwoId = other_member.id AND conv.memberOneId = sender_member.id)
  INNER JOIN profile other_p ON other_member.profileId = other_p.id
  WHERE 
    EXISTS (
      SELECT 1 FROM member user_member 
      WHERE user_member.profileId = '{{ $json.userId }}'
      AND (conv.memberOneId = user_member.id OR conv.memberTwoId = user_member.id)
    )
    AND (dm.content LIKE '%{{ $json.searchQuery }}%' 
         OR dm.fileUrl LIKE '%{{ $json.searchQuery }}%')
    AND dm.createdAt >= DATE_SUB(NOW(), INTERVAL {{ $json.dayRange || 30 }} DAY)
)
ORDER BY createdAt DESC
LIMIT 10; 