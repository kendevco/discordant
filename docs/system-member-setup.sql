-- System Member Setup for AI Responses
-- Run this once to create system members for all servers

-- First, create/ensure system profile exists
INSERT IGNORE INTO profile (id, userId, name, imageUrl, email, createdAt, updatedAt)
VALUES (
  'system-profile-id',
  'system-user',
  'System User', 
  'https://cdn.discordapp.com/embed/avatars/0.png',
  'system@discordant.local',
  NOW(),
  NOW()
);

-- Create system member for each server
INSERT IGNORE INTO member (id, role, profileId, serverId, onlineStatus, lastSeen, isOnline, createdAt, updatedAt)
SELECT 
  CONCAT('system-member-', s.id) as id,
  'ADMIN' as role,
  'system-profile-id' as profileId,
  s.id as serverId,
  'ONLINE' as onlineStatus,
  NOW() as lastSeen,
  true as isOnline,
  NOW() as createdAt,
  NOW() as updatedAt
FROM server s
WHERE NOT EXISTS (
  SELECT 1 FROM member m 
  WHERE m.serverId = s.id 
  AND m.profileId = 'system-profile-id'
);

-- Verify system members were created
SELECT 
  s.name as serverName,
  s.id as serverId,
  m.id as systemMemberId,
  p.name as profileName
FROM server s
JOIN member m ON s.id = m.serverId
JOIN profile p ON m.profileId = p.id
WHERE p.name = 'System User'
ORDER BY s.name; 