-- Duplicate Message Analysis and Cleanup Queries
-- Created: 6/12/2025 for workflow loop issue resolution

-- Step 1: Identify recent duplicate messages (last 2 hours)
-- Shows messages with identical content created within the same channel in a short timeframe
SELECT 
    m.id,
    m.content,
    m.channelId,
    m.memberId,
    m.createdAt,
    m.role,
    p.name as member_name,
    c.name as channel_name,
    s.name as server_name,
    ROW_NUMBER() OVER (
        PARTITION BY m.content, m.channelId, m.memberId 
        ORDER BY m.createdAt ASC
    ) as duplicate_rank
FROM message m
JOIN member mem ON m.memberId = mem.id
JOIN profile p ON mem.profileId = p.id
JOIN channel c ON m.channelId = c.id
JOIN server s ON c.serverId = s.id
WHERE 
    m.createdAt >= DATE_SUB(NOW(), INTERVAL 2 HOUR)
    AND m.deleted = FALSE
    AND EXISTS (
        -- Only show messages that have duplicates
        SELECT 1 
        FROM message m2 
        WHERE m2.content = m.content 
        AND m2.channelId = m.channelId 
        AND m2.memberId = m.memberId 
        AND m2.id != m.id
        AND m2.createdAt >= DATE_SUB(NOW(), INTERVAL 2 HOUR)
        AND m2.deleted = FALSE
    )
ORDER BY m.content, m.createdAt DESC;

-- Step 2: Count duplicates by content and channel
-- Shows how many duplicates exist for each message content
SELECT 
    m.content,
    c.name as channel_name,
    s.name as server_name,
    COUNT(*) as duplicate_count,
    MIN(m.createdAt) as first_created,
    MAX(m.createdAt) as last_created,
    TIMESTAMPDIFF(MINUTE, MIN(m.createdAt), MAX(m.createdAt)) as span_minutes
FROM message m
JOIN channel c ON m.channelId = c.id
JOIN server s ON c.serverId = s.id
WHERE 
    m.createdAt >= DATE_SUB(NOW(), INTERVAL 2 HOUR)
    AND m.deleted = FALSE
GROUP BY m.content, m.channelId
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC, span_minutes ASC;

-- Step 3: Identify AI messages specifically (likely from the loop)
-- Shows system/AI messages that might be duplicated
SELECT 
    m.id,
    LEFT(m.content, 100) as content_preview,
    m.channelId,
    m.role,
    m.createdAt,
    c.name as channel_name,
    s.name as server_name,
    COUNT(*) OVER (PARTITION BY m.content, m.channelId) as duplicate_count
FROM message m
JOIN channel c ON m.channelId = c.id
JOIN server s ON c.serverId = s.id
WHERE 
    m.createdAt >= DATE_SUB(NOW(), INTERVAL 2 HOUR)
    AND m.deleted = FALSE
    AND (
        m.role = 'SYSTEM' 
        OR m.content LIKE '%🤖%'
        OR m.content LIKE '%AI%'
        OR m.content LIKE '%Processing%'
        OR m.content LIKE '%Enhanced Business Intelligence%'
    )
ORDER BY m.createdAt DESC;

-- Step 4: CLEANUP - Delete duplicate messages (KEEP OLDEST, REMOVE NEWER ONES)
-- This query deletes duplicate messages, keeping only the first occurrence
DELETE m FROM message m
JOIN (
    SELECT 
        id,
        ROW_NUMBER() OVER (
            PARTITION BY content, channelId, memberId 
            ORDER BY createdAt ASC
        ) as rn
    FROM message 
    WHERE 
        createdAt >= DATE_SUB(NOW(), INTERVAL 2 HOUR)
        AND deleted = FALSE
) ranked ON m.id = ranked.id
WHERE ranked.rn > 1;

-- Step 5: Alternative cleanup - Mark as deleted instead of hard delete
-- More conservative approach - marks duplicates as deleted
UPDATE message m
JOIN (
    SELECT 
        id,
        ROW_NUMBER() OVER (
            PARTITION BY content, channelId, memberId 
            ORDER BY createdAt ASC
        ) as rn
    FROM message 
    WHERE 
        createdAt >= DATE_SUB(NOW(), INTERVAL 2 HOUR)
        AND deleted = FALSE
) ranked ON m.id = ranked.id
SET m.deleted = TRUE, m.updatedAt = NOW()
WHERE ranked.rn > 1;

-- Step 6: Verification query - Check cleanup results
-- Run after cleanup to verify duplicates are removed
SELECT 
    'After Cleanup' as status,
    COUNT(*) as total_messages,
    COUNT(DISTINCT content) as unique_content,
    COUNT(*) - COUNT(DISTINCT content) as remaining_duplicates
FROM message 
WHERE 
    createdAt >= DATE_SUB(NOW(), INTERVAL 2 HOUR)
    AND deleted = FALSE;

-- Step 7: Emergency rollback - Restore deleted messages if needed
-- Use only if cleanup went wrong
UPDATE message 
SET deleted = FALSE, updatedAt = NOW()
WHERE 
    deleted = TRUE 
    AND updatedAt >= DATE_SUB(NOW(), INTERVAL 5 MINUTE); 