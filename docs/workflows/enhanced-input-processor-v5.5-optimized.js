// Enhanced Input Processor v5.5 - OPTIMIZED FOR EXISTING CHANNELS
// This version passes channel data directly when we already have it

console.log('=== INPUT PROCESSOR v5.5 OPTIMIZED START ===');

try {
  const input = $input.first();
  console.log('Raw input:', JSON.stringify(input.json, null, 2));
  
  // Constants
  const SYSTEM_SERVER_ID = 'a90f1d41-12a9-4586-b9a4-a513d3bd01d9';
  const DEFAULT_SYSTEM_CHANNEL_ID = 'clwtz9i7m0008n9n01vhep8zt';
  
  // Simple session ID generator
  const generateId = () => 'test-' + Math.floor(Math.random() * 1000000);
  
  let result = {};
  
  // Check if this is from Chat Test Interface
  if (input.json.chatInput) {
    console.log('=== CHAT TEST MODE ===');
    
    const userMessage = input.json.chatInput || '';
    const sessionId = generateId();
    
    // Check if it's a system message
    const isSystemMsg = userMessage.toLowerCase().includes('hello system');
    const channelName = isSystemMsg ? 'sys-system-messages' : 'sys-workflow-test';
    
    result = {
      input: userMessage,
      userId: 'test-user',
      channelName: channelName,
      channelId: null,
      sessionId: sessionId,
      platform: 'n8n-chat-test',
      timestamp: new Date().toISOString(),
      isTestMode: true,
      isExternalCall: true,
      isSystemMessage: isSystemMsg,
      needsChannelCreation: true, // Chat test needs channel creation
      userName: 'Test User',
      serverId: SYSTEM_SERVER_ID,
      fallbackChannelId: DEFAULT_SYSTEM_CHANNEL_ID,
      processingStartTime: Date.now()
    };
    
    console.log('Chat test result:', JSON.stringify(result, null, 2));
    
  } else {
    console.log('=== WEBHOOK MODE ===');
    
    // Handle webhook input
    const payload = input.json.body || input.json || {};
    const messageContent = payload.message || payload.content || '';
    const existingChannelId = payload.channelId;
    const existingServerId = payload.serverId;
    
    console.log('Webhook payload channelId:', existingChannelId);
    console.log('Webhook payload serverId:', existingServerId);
    
    // OPTIMIZED LOGIC: If we have a valid channel ID, prepare channel data directly
    const hasValidChannel = existingChannelId && 
                           existingChannelId !== 'unknown-channel' && 
                           existingChannelId !== 'unknown' &&
                           existingChannelId.length > 10; // Valid UUID-like ID
    
    const hasValidServer = existingServerId && 
                          existingServerId !== 'unknown-server' &&
                          existingServerId.length > 10; // Valid UUID-like ID
    
    let needsChannelCreation = false;
    let channelName = null;
    let channelId = null;
    let serverId = SYSTEM_SERVER_ID;
    let channelData = null; // NEW: Direct channel data
    
    if (hasValidChannel && hasValidServer) {
      // EXISTING CHANNEL: Prepare data directly, no lookup needed
      console.log('=== USING EXISTING CHANNEL - DIRECT DATA ===');
      needsChannelCreation = false;
      channelId = existingChannelId;
      serverId = existingServerId;
      channelName = null; // Don't set name when using existing channel
      
      // NEW: Create channel data directly to bypass lookup
      channelData = {
        channelId: existingChannelId,
        channelName: 'existing-channel', // Placeholder name
        type: 'TEXT', // Default type
        serverId: existingServerId,
        channelExists: true,
        channelCreated: false,
        usingExistingData: true
      };
      
    } else {
      // NEW CHANNEL NEEDED: Set up for creation
      console.log('=== CREATING NEW CHANNEL ===');
      needsChannelCreation = true;
      channelId = null; // Will be set after creation
      
      const isSystemMsg = messageContent.toLowerCase().includes('hi system') || 
                         messageContent.toLowerCase().includes('hello system');
      
      // Determine channel name based on source and content
      if (payload.platform === 'vapi') {
        channelName = 'sys-vapi-calls';
      } else if (payload.platform === 'external-api') {
        channelName = 'sys-external-api';
      } else if (isSystemMsg) {
        channelName = 'sys-system-messages';
      } else {
        channelName = 'sys-general';
      }
    }
    
    result = {
      input: messageContent,
      userId: payload.userId || 'webhook-user',
      channelName: channelName,
      channelId: channelId,
      sessionId: payload.sessionId || generateId(),
      platform: payload.platform || 'discordant',
      timestamp: new Date().toISOString(),
      isTestMode: false,
      isExternalCall: !hasValidChannel, // Only external if no valid channel
      needsChannelCreation: needsChannelCreation,
      userName: payload.userName || 'Webhook User',
      serverId: serverId,
      fallbackChannelId: DEFAULT_SYSTEM_CHANNEL_ID,
      processingStartTime: Date.now(),
      // NEW: Include direct channel data when available
      ...(channelData && { channelData }),
      // Debug info
      debugInfo: {
        hasValidChannel: hasValidChannel,
        hasValidServer: hasValidServer,
        originalChannelId: existingChannelId,
        originalServerId: existingServerId,
        channelCreationNeeded: needsChannelCreation,
        hasDirectChannelData: !!channelData
      }
    };
    
    console.log('Webhook result:', JSON.stringify(result, null, 2));
  }
  
  console.log('=== INPUT PROCESSOR SUCCESS ===');
  console.log('Final needsChannelCreation:', result.needsChannelCreation);
  console.log('Final channelId:', result.channelId);
  console.log('Final channelName:', result.channelName);
  console.log('Has direct channel data:', !!result.channelData);
  
  return result;
  
} catch (error) {
  console.error('=== INPUT PROCESSOR ERROR ===');
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  
  // Emergency fallback
  return {
    input: 'Error: ' + error.message,
    userId: 'error-user',
    channelName: 'sys-error-handling',
    channelId: null,
    sessionId: 'error-session',
    platform: 'error',
    timestamp: new Date().toISOString(),
    isTestMode: false,
    isExternalCall: true,
    needsChannelCreation: true,
    errorOccurred: true,
    errorMessage: error.message,
    userName: 'Error Handler',
    serverId: 'a90f1d41-12a9-4586-b9a4-a513d3bd01d9',
    fallbackChannelId: 'clwtz9i7m0008n9n01vhep8zt'
  };
} 