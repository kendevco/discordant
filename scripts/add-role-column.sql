-- Add role column to profile table for internal role management
-- This allows the system to be independent from Clerk's metadata system

-- First, add the UserRole enum values if not exists
-- (MySQL/PlanetScale doesn't have enums, so we'll use a varchar with constraints)

-- Add the role column with default value of 'USER'
ALTER TABLE `profile` 
ADD COLUMN `role` VARCHAR(10) NOT NULL DEFAULT 'USER';

-- Add an index for role-based queries
CREATE INDEX `Profile_role_idx` ON `profile`(`role`);

-- Add a check constraint to ensure valid role values (if supported)
-- ALTER TABLE `profile` 
-- ADD CONSTRAINT `chk_role` CHECK (`role` IN ('HOST', 'ADMIN', 'MODERATOR', 'USER'));

-- Update the first user to be HOST (assuming they are the system owner)
UPDATE `profile` 
SET `role` = 'HOST' 
WHERE `id` = (
    SELECT `id` FROM (
        SELECT `id` FROM `profile` 
        ORDER BY `createdAt` ASC 
        LIMIT 1
    ) AS first_user
);

-- Show the updated profiles
SELECT `id`, `name`, `email`, `role`, `createdAt` 
FROM `profile` 
ORDER BY `createdAt` ASC; 