// Enhanced Input Processing with security, validation, and robust debugging
console.log('=== ENHANCED INPUT PROCESSOR v2.0 ===');
const startTime = Date.now();

const input = $input.first();
console.log('Input keys:', Object.keys(input?.json || {}));
console.log('Input source:', input?.json?.source || 'unknown');

// Enhanced security and validation functions
function sanitizeInput(text) {
  if (!text || typeof text !== 'string') return '';
  
  // Remove potential XSS and injection attempts
  return text
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
    .substring(0, 8000); // Reasonable length limit
}

function validateUserId(userId) {
  if (!userId || typeof userId !== 'string') return 'unknown-user';
  return userId.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 64);
}

function validateChannelId(channelId) {
  if (!channelId || typeof channelId !== 'string') return 'unknown-channel';
  return channelId.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 64);
}

function generateSessionId(userId, channelId, platform) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${platform}-${userId}-${channelId}-${timestamp}-${random}`.substring(0, 128);
}

// Enhanced payload extraction with multiple fallback strategies
function extractPayload(inputJson) {
  console.log('=== PAYLOAD EXTRACTION ===');
  
  // Strategy 1: Direct webhook body
  if (inputJson.body && typeof inputJson.body === 'object') {
    console.log('✅ Found payload in input.json.body (object)');
    return inputJson.body;
  }
  
  // Strategy 2: Parsed webhook body string
  if (inputJson.body && typeof inputJson.body === 'string') {
    try {
      const parsed = JSON.parse(inputJson.body);
      console.log('✅ Found and parsed payload from input.json.body (string)');
      return parsed;
    } catch (e) {
      console.log('❌ Failed to parse input.json.body as JSON:', e.message);
    }
  }
  
  // Strategy 3: Form data or query parameters
  if (inputJson.query && Object.keys(inputJson.query).length > 0) {
    console.log('✅ Found payload in input.json.query');
    return inputJson.query;
  }
  
  // Strategy 4: Direct input.json
  if (inputJson && Object.keys(inputJson).length > 0) {
    console.log('✅ Using input.json directly as payload');
    return inputJson;
  }
  
  console.log('❌ No valid payload found');
  return {};
}

// Main processing logic
let normalizedData = {};

try {
  // Check for test mode first
  if (input.json.chatInput) {
    console.log('=== TEST MODE DETECTED ===');
    
    const testSessionId = generateSessionId('test-user', 'test-channel', 'test');
    const sanitizedInput = sanitizeInput(input.json.chatInput);
    
    normalizedData = {
      input: sanitizedInput,
      userId: 'test-user',
      channelId: 'test-channel',
      sessionId: testSessionId,
      platform: 'n8n-chat-test',
      timestamp: new Date().toISOString(),
      isTestMode: true,
      inputLength: sanitizedInput.length,
      version: '2.0'
    };
    
    console.log('Test input processed:', sanitizedInput.substring(0, 100));
    
  } else {
    console.log('=== WEBHOOK MODE DETECTED ===');
    
    // Extract payload using enhanced strategies
    const payload = extractPayload(input.json);
    
    console.log('Payload keys:', Object.keys(payload));
    console.log('Message preview:', (payload.message || payload.content || '').substring(0, 100));
    
    // Enhanced field extraction with validation
    const rawMessage = payload.message || payload.content || payload.text || '';
    const sanitizedMessage = sanitizeInput(rawMessage);
    const validatedUserId = validateUserId(payload.userId);
    const validatedChannelId = validateChannelId(payload.channelId);
    const sessionId = generateSessionId(validatedUserId, validatedChannelId, 'discordant');
    
    // Input validation and warnings
    if (sanitizedMessage.length === 0) {
      console.warn('⚠️ Empty message detected');
    }
    
    if (rawMessage.length > sanitizedMessage.length) {
      console.warn('⚠️ Message was sanitized and truncated');
      console.warn('Original length:', rawMessage.length, 'Sanitized length:', sanitizedMessage.length);
    }
    
    if (sanitizedMessage.length > 7000) {
      console.warn('⚠️ Very long message detected:', sanitizedMessage.length, 'characters');
    }
    
    // Build normalized data with enhanced metadata
    normalizedData = {
      input: sanitizedMessage,
      userId: validatedUserId,
      channelId: validatedChannelId,
      sessionId: sessionId,
      platform: 'discordant',
      timestamp: payload.timestamp || new Date().toISOString(),
      isTestMode: false,
      userName: sanitizeInput(payload.userName || 'Unknown User'),
      serverId: validateChannelId(payload.serverId || 'unknown-server'),
      inputLength: sanitizedMessage.length,
      originalLength: rawMessage.length,
      wasSanitized: rawMessage.length !== sanitizedMessage.length,
      version: '2.0',
      
      // Additional metadata for enhanced processing
      metadata: {
        source: 'webhook',
        userAgent: payload.userAgent || 'unknown',
        ip: payload.ip || 'unknown',
        requestId: payload.requestId || require('crypto').randomBytes(8).toString('hex'),
        processingStartTime: startTime
      }
    };
    
    console.log('Discordant webhook processed');
    console.log('User:', normalizedData.userName, '(' + normalizedData.userId + ')');
    console.log('Channel:', normalizedData.channelId);
    console.log('Server:', normalizedData.serverId);
  }
  
  // Final validation and security checks
  console.log('=== FINAL VALIDATION ===');
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /eval\s*\(/i,
    /document\./i,
    /window\./i,
    /\.innerHTML/i,
    /base64/i,
    /javascript:/i
  ];
  
  const hasSuspiciousContent = suspiciousPatterns.some(pattern => 
    pattern.test(normalizedData.input)
  );
  
  if (hasSuspiciousContent) {
    console.warn('🚨 SECURITY: Suspicious content detected in input');
    normalizedData.securityWarning = true;
    normalizedData.input = '[CONTENT FILTERED FOR SECURITY]';
  }
  
  // Rate limiting check (basic)
  const messageCount = normalizedData.inputLength;
  if (messageCount > 5000) {
    console.warn('⚠️ RATE LIMIT: Very long message may impact processing time');
    normalizedData.rateLimitWarning = true;
  }
  
  // Final logging
  console.log('=== INPUT PROCESSOR SUCCESS ===');
  console.log('✅ Processing completed successfully');
  console.log('📊 Input length:', normalizedData.inputLength);
  console.log('🆔 Session ID:', normalizedData.sessionId);
  console.log('📍 Channel:', normalizedData.channelId);
  console.log('👤 User:', normalizedData.userId);
  console.log('🔧 Version:', normalizedData.version);
  console.log('⏱️ Processing time:', Date.now() - startTime, 'ms');
  console.log('🛡️ Security checks:', hasSuspiciousContent ? 'BLOCKED' : 'PASSED');
  
  return normalizedData;
  
} catch (error) {
  console.error('=== INPUT PROCESSOR ERROR ===');
  console.error('❌ Error type:', error.name);
  console.error('❌ Error message:', error.message);
  console.error('❌ Error stack:', error.stack);
  console.error('⏱️ Processing time before error:', Date.now() - startTime, 'ms');
  
  // Enhanced error response with proper structure
  const errorSessionId = `error-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  return {
    input: `**Processing Error**: ${error.message}`,
    userId: 'error-user',
    channelId: 'error-channel', 
    sessionId: errorSessionId,
    platform: 'error-handler',
    timestamp: new Date().toISOString(),
    isTestMode: false,
    inputLength: 0,
    version: '2.0',
    
    // Error details
    errorOccurred: true,
    errorMessage: error.message,
    errorType: error.name,
    errorCode: 'INPUT_PROCESSOR_FAILURE',
    processingTime: Date.now() - startTime,
    
    // Recovery suggestions
    recoverySuggestions: [
      'Check webhook payload format',
      'Validate input data structure', 
      'Ensure required fields are present',
      'Review error logs for details'
    ],
    
    metadata: {
      source: 'error-handler',
      requestId: errorSessionId,
      debugInfo: {
        inputKeys: Object.keys(input?.json || {}),
        hasBody: !!input?.json?.body,
        hasChatInput: !!input?.json?.chatInput,
        inputType: typeof input?.json
      }
    }
  };
} 