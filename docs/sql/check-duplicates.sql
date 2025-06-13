-- Quick duplicate check
SELECT 
    COUNT(*) as total_recent_messages,
    COUNT(DISTINCT content) as unique_content,
    (COUNT(*) - COUNT(DISTINCT content)) as potential_duplicates
FROM message 
WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 2 HOUR) 
AND deleted = FALSE; 