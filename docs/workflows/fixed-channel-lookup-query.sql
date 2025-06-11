-- Fixed Channel Lookup Query for Enhanced Input Processor v5.5
-- Handles both existing channels (by ID) and new channels (by name)

SELECT 
  id as channelId, 
  name as channelName, 
  type, 
  serverId 
FROM channel 
WHERE 
  (
    -- Case 1: We have an existing channelId (bypass name lookup)
    ('{{ $json.channelId }}' IS NOT NULL AND '{{ $json.channelId }}' != '' AND id = '{{ $json.channelId }}')
    OR
    -- Case 2: We need to lookup by name (for new channel detection)
    ('{{ $json.channelName }}' IS NOT NULL AND '{{ $json.channelName }}' != '' AND name = '{{ $json.channelName }}' AND serverId = '{{ $json.serverId }}')
  )
LIMIT 1 