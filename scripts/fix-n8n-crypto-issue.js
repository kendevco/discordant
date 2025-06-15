#!/usr/bin/env node

/**
 * N8N Crypto Module Fix
 * Provides n8n-compatible alternatives to Node.js crypto module
 */

console.log('🔧 N8N Crypto Module Fix\n');

// N8N-compatible random ID generation functions
const n8nCompatibleCode = `
// === N8N-COMPATIBLE INPUT PROCESSOR (CRYPTO-FREE) ===
console.log('=== ENHANCED INPUT PROCESSOR DEBUG ===');

// Circuit breaker to prevent infinite loops
const EXECUTION_TRACKING_KEY = 'workflow_execution_tracking';
const MAX_EXECUTIONS_PER_MINUTE = 10;
const currentTime = Date.now();

// Check for recent executions
if (typeof globalThis.executionTracking === 'undefined') {
  globalThis.executionTracking = [];
}

// Clean old executions (older than 1 minute)
globalThis.executionTracking = globalThis.executionTracking.filter(
  timestamp => currentTime - timestamp < 60000
);

// Check if we're exceeding the rate limit
if (globalThis.executionTracking.length >= MAX_EXECUTIONS_PER_MINUTE) {
  console.error('=== CIRCUIT BREAKER TRIGGERED ===');
  console.error(\`Too many executions: \${globalThis.executionTracking.length} in the last minute\`);
  console.error('Executions:', globalThis.executionTracking.map(t => new Date(t).toISOString()));
  
  return {
    input: 'Circuit breaker activated - workflow execution rate limit exceeded',
    messageId: 'circuit-breaker', // CRITICAL: Always include messageId
    userId: 'circuit-breaker',
    channelId: 'circuit-breaker',
    sessionId: 'circuit-breaker',
    platform: 'circuit-breaker',
    timestamp: new Date().toISOString(),
    isTestMode: false,
    circuitBreakerTriggered: true,
    errorMessage: \`Rate limit exceeded: \${globalThis.executionTracking.length} executions in 60 seconds\`
  };
}

// Record this execution
globalThis.executionTracking.push(currentTime);
console.log(\`Execution \${globalThis.executionTracking.length} of \${MAX_EXECUTIONS_PER_MINUTE} allowed per minute\`);

const input = $input.first();
console.log('Input keys:', Object.keys(input?.json || {}));
console.log('Full input data:', JSON.stringify(input?.json || {}, null, 2));

// Check different possible locations for webhook data
console.log('input.json.body:', input?.json?.body);
console.log('input.json.params:', input?.json?.params);
console.log('input.json.query:', input?.json?.query);

let normalizedData = {};

// N8N-COMPATIBLE RANDOM ID GENERATION (NO CRYPTO MODULE)
function generateRandomId(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateSessionId() {
  return generateRandomId(32);
}

function generateMessageId(prefix = 'msg') {
  return \`\${prefix}-\${Date.now()}-\${generateRandomId(8)}\`;
}

try {
  if (input.json.chatInput) {
    // Test interface mode - NO CRYPTO MODULE NEEDED
    const testSessionId = generateSessionId();
    const testMessageId = generateMessageId('test-msg');
    
    normalizedData = {
      input: input.json.chatInput || '',
      messageId: testMessageId, // CRITICAL: Test mode messageId
      userId: 'test-user',
      channelId: 'test-channel',
      sessionId: testSessionId,
      platform: 'n8n-chat-test',
      timestamp: new Date().toISOString(),
      isTestMode: true
    };
    console.log('Processing chat test input');
    console.log('Generated test messageId:', testMessageId);
  } else {
    // Discordant webhook mode - try different payload locations
    let payload = {};
    
    // Try multiple locations where webhook data might be
    if (input.json.body && typeof input.json.body === 'object') {
      payload = input.json.body;
      console.log('Found payload in input.json.body');
    } else if (input.json.body && typeof input.json.body === 'string') {
      try {
        payload = JSON.parse(input.json.body);
        console.log('Found and parsed payload from input.json.body string');
      } catch (e) {
        console.log('Failed to parse input.json.body as JSON:', e.message);
        payload = input.json || {};
      }
    } else if (input.json && Object.keys(input.json).length > 0) {
      payload = input.json;
      console.log('Using input.json directly as payload');
    }
    
    console.log('Final payload keys:', Object.keys(payload));
    console.log('Final payload data:', JSON.stringify(payload, null, 2));
    console.log('Message:', payload.message);
    console.log('UserId:', payload.userId);
    console.log('ChannelId:', payload.channelId);
    
    // 🔥 CRITICAL FIX: Extract and preserve messageId
    const messageId = payload.messageId || 
                     payload.metadata?.messageId || 
                     generateMessageId('fallback');
    
    console.log('🎯 CRITICAL: MessageId extracted:', messageId);
    console.log('MessageId source:', payload.messageId ? 'direct' : payload.metadata?.messageId ? 'metadata' : 'generated');
    
    normalizedData = {
      input: payload.message || payload.content || '',
      messageId: messageId, // 🔥 CRITICAL: Preserve messageId for attribution
      userId: payload.userId || 'unknown-user',
      channelId: payload.channelId || 'unknown-channel',
      sessionId: \`\${payload.userId || 'unknown'}-\${payload.channelId || 'unknown'}\`,
      platform: 'discordant',
      timestamp: payload.timestamp || new Date().toISOString(),
      isTestMode: false,
      userName: payload.userName || 'Unknown User',
      serverId: payload.serverId || 'unknown-server'
    };
    console.log('Processing Discordant webhook input');
  }
  
  console.log('=== INPUT PROCESSOR SUCCESS ===');
  console.log('Normalized data:', JSON.stringify(normalizedData, null, 2));
  console.log('Input message length:', normalizedData.input.length);
  console.log('Session ID:', normalizedData.sessionId);
  console.log('Channel ID:', normalizedData.channelId);
  console.log('🎯 PRESERVED MessageId:', normalizedData.messageId); // CRITICAL LOG
  
  return normalizedData;
  
} catch (error) {
  console.error('=== INPUT PROCESSOR ERROR ===');
  console.error('Error details:', error.message);
  console.error('Error stack:', error.stack);
  
  // Provide fallback data with messageId - NO CRYPTO MODULE
  const errorMessageId = generateMessageId('error');
  
  return {
    input: 'Error processing input: ' + error.message,
    messageId: errorMessageId, // CRITICAL: Even errors need messageId
    userId: 'error-user',
    channelId: 'error-channel',
    sessionId: 'error-session',
    platform: 'error',
    timestamp: new Date().toISOString(),
    isTestMode: false,
    errorOccurred: true,
    errorMessage: error.message
  };
}
`;

console.log('📋 N8N-Compatible Code Generated');
console.log('🔧 Key Changes Made:');
console.log('  • Removed require("crypto") calls');
console.log('  • Added generateRandomId() function using Math.random()');
console.log('  • Added generateSessionId() function');
console.log('  • Added generateMessageId() function');
console.log('  • All random ID generation now uses n8n-compatible methods');

console.log('\n📝 Instructions for N8N Workflow Update:');
console.log('1. Open n8n workflow editor');
console.log('2. Navigate to "Input Processor" code node');
console.log('3. Replace the existing code with the crypto-free version above');
console.log('4. Save and test the workflow');

console.log('\n🎯 This fixes the "Cannot find module \'crypto\'" error');
console.log('✅ All functionality preserved with n8n-compatible alternatives');

// Also provide a simple test function
const testCode = `
// Simple test for n8n compatibility
function testN8nCompatibility() {
  try {
    // Test random ID generation
    const testId = generateRandomId(8);
    const testSessionId = generateSessionId();
    const testMessageId = generateMessageId('test');
    
    console.log('✅ Random ID generation working:', testId);
    console.log('✅ Session ID generation working:', testSessionId);
    console.log('✅ Message ID generation working:', testMessageId);
    
    return {
      success: true,
      testId,
      testSessionId,
      testMessageId
    };
  } catch (error) {
    console.error('❌ N8N compatibility test failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run test
const testResult = testN8nCompatibility();
console.log('Test result:', testResult);
`;

console.log('\n🧪 Test Code for N8N:');
console.log(testCode);

module.exports = {
  n8nCompatibleCode,
  testCode
}; 