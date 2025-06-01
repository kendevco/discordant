// Test Production n8n Connectivity
const BASE_URL = 'https://discordant.kendev.co';
const N8N_WEBHOOK_URL = 'https://n8n.kendev.co/webhook';

const testMessage = {
  message: "test connectivity from production",
  userId: "test-user-123",
  userName: "Test User",
  channelId: "test-channel-456",
  serverId: "test-server-789",
  timestamp: new Date().toISOString(),
  metadata: {
    platform: "discordant-chat",
    messageType: "text",
    hasAttachment: false,
    priority: "normal",
    sessionId: "test-session",
    routedBy: "production-test",
    workflowId: "general-assistant:general",
    intent: "general"
  }
};

console.log('🔍 Testing Production n8n Connectivity...');
console.log('📍 Production App URL:', BASE_URL);
console.log('📍 N8N Webhook URL:', N8N_WEBHOOK_URL);
console.log('📦 Test Payload:', JSON.stringify(testMessage, null, 2));

// Test 1: Direct n8n webhook
console.log('\n🧪 Test 1: Direct n8n webhook call...');
fetch(`${N8N_WEBHOOK_URL}/discordant-ai-services`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Production-Test/1.0'
  },
  body: JSON.stringify(testMessage)
})
.then(response => {
  console.log('✅ Direct n8n webhook response status:', response.status);
  return response.text();
})
.then(data => {
  console.log('📄 Direct n8n webhook response:', data);
})
.catch(error => {
  console.error('❌ Direct n8n webhook error:', error.message);
});

// Test 2: Production app workflow proxy
console.log('\n🧪 Test 2: Production app workflow proxy...');
fetch(`${BASE_URL}/api/workflow`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Workflow-Id': 'general-assistant:general',
    'X-Webhook-Path': 'discordant-ai-services',
    'User-Agent': 'Production-Test/1.0'
  },
  body: JSON.stringify(testMessage)
})
.then(response => {
  console.log('✅ Production proxy response status:', response.status);
  return response.text();
})
.then(data => {
  console.log('📄 Production proxy response:', data);
})
.catch(error => {
  console.error('❌ Production proxy error:', error.message);
});

console.log('\n⏱️ Tests initiated. Check results above...'); 