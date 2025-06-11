// Enhanced Input Processor v5.4 - FIXED VERSION
// Simplified for bulletproof reliability

console.log('=== INPUT PROCESSOR START ===');

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
      needsChannelCreation: true,
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
    
    result = {
      input: messageContent,
      userId: payload.userId || 'webhook-user',
      channelName: 'sys-webhook',
      channelId: payload.channelId || null,
      sessionId: payload.sessionId || generateId(),
      platform: payload.platform || 'discordant',
      timestamp: new Date().toISOString(),
      isTestMode: false,
      isExternalCall: !payload.channelId,
      needsChannelCreation: !payload.channelId,
      userName: payload.userName || 'Webhook User',
      serverId: payload.serverId || SYSTEM_SERVER_ID,
      fallbackChannelId: DEFAULT_SYSTEM_CHANNEL_ID,
      processingStartTime: Date.now()
    };
    
    console.log('Webhook result:', JSON.stringify(result, null, 2));
  }
  
  console.log('=== INPUT PROCESSOR SUCCESS ===');
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