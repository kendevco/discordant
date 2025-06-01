-- Direct Message search with permission checks
-- Only returns messages from conversations the user is part of

SELECT 
  dm.id,
  dm.content,
  dm.fileUrl,
  dm.createdAt,
  p.name as userName,
  p.imageUrl as userAvatar,
  other_p.name as otherUserName,
  conv.id as conversationId,
  'DIRECT_MESSAGE' as messageType,
  CASE 
    WHEN dm.fileUrl LIKE '%.jpg' OR dm.fileUrl LIKE '%.png' OR dm.fileUrl LIKE '%.gif' OR dm.fileUrl LIKE '%.jpeg' OR dm.fileUrl LIKE '%.webp' THEN 'image'
    WHEN dm.fileUrl LIKE '%.pdf' THEN 'document'
    WHEN dm.fileUrl LIKE '%.mp4' OR dm.fileUrl LIKE '%.mov' OR dm.fileUrl LIKE '%.avi' THEN 'video'
    WHEN dm.fileUrl LIKE '%.mp3' OR dm.fileUrl LIKE '%.wav' THEN 'audio'
    WHEN dm.fileUrl IS NOT NULL THEN 'file'
    ELSE 'text'
  END as contentType
FROM directmessage dm
-- Join conversation and check user is participant
INNER JOIN conversation conv ON dm.conversationId = conv.id
-- Get sender info
INNER JOIN member sender_member ON dm.memberId = sender_member.id
INNER JOIN profile p ON sender_member.profileId = p.id
-- Get other participant info
INNER JOIN member other_member ON 
  (conv.memberOneId = other_member.id AND conv.memberTwoId = sender_member.id)
  OR 
  (conv.memberTwoId = other_member.id AND conv.memberOneId = sender_member.id)
INNER JOIN profile other_p ON other_member.profileId = other_p.id
-- CRITICAL: Check user is part of this conversation
WHERE 
  -- User must be one of the conversation participants
  EXISTS (
    SELECT 1 FROM member user_member 
    WHERE user_member.profileId = '{{ $json.userId }}'
    AND (conv.memberOneId = user_member.id OR conv.memberTwoId = user_member.id)
  )
  -- Search criteria
  AND (dm.content LIKE '%{{ $json.searchQuery }}%' 
       OR dm.fileUrl LIKE '%{{ $json.searchQuery }}%')
  -- Date range
  AND dm.createdAt >= DATE_SUB(NOW(), INTERVAL {{ $json.dayRange || 30 }} DAY)
ORDER BY 
  dm.createdAt DESC
LIMIT 10; 