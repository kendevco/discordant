// Test script for async callback endpoint
const https = require('https');

const testData = {
  content: "🧪 **Test Message from Terminal**\n\nThis is a test of the async callback endpoint to verify authentication is working correctly.",
  metadata: {
    channelId: "test-channel-123",
    userId: "test-user-456", 
    sessionId: "test-session-789",
    platform: "terminal-test",
    timestamp: new Date().toISOString(),
    workflowId: "test-workflow",
    processingTime: 150,
    toolsUsed: "none",
    messageCount: 1
  }
};

const postData = JSON.stringify(testData);

const options = {
  hostname: 'discordant-git-main-ken-dev-co.vercel.app',
  port: 443,
  path: '/api/ai/workflow-complete',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'n8n-DiscordantAI/1.0',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🧪 Testing async callback endpoint...');
console.log('📡 URL:', `https://${options.hostname}${options.path}`);
console.log('📦 Payload size:', Buffer.byteLength(postData), 'bytes');

const req = https.request(options, (res) => {
  console.log('\n✅ Response received:');
  console.log('📊 Status Code:', res.statusCode);
  console.log('📋 Headers:', JSON.stringify(res.headers, null, 2));
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\n📄 Response Body:');
    try {
      const jsonResponse = JSON.parse(data);
      console.log(JSON.stringify(jsonResponse, null, 2));
      
      if (res.statusCode === 200) {
        console.log('\n🎉 SUCCESS: Async callback endpoint is working!');
      } else {
        console.log('\n❌ ERROR: Unexpected status code');
      }
    } catch (e) {
      console.log('Raw response:', data);
      if (res.statusCode === 200) {
        console.log('\n🎉 SUCCESS: Endpoint responded (non-JSON response)');
      }
    }
  });
});

req.on('error', (e) => {
  console.error('\n❌ Request failed:', e.message);
});

req.write(postData);
req.end(); 