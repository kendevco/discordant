// Test script for local async callback endpoint
const https = require('https');

// Disable SSL verification for local self-signed certificates
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const testData = {
  content: "🧪 **Local Test Message**\n\nThis is a test of the local async callback endpoint to verify it works before production deployment.",
  metadata: {
    channelId: "local-test-channel",
    userId: "local-test-user", 
    sessionId: "local-test-session",
    platform: "local-terminal-test",
    timestamp: new Date().toISOString(),
    workflowId: "local-test-workflow",
    processingTime: 50,
    toolsUsed: "none",
    messageCount: 1
  }
};

const postData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/ai/workflow-complete',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'n8n-DiscordantAI/1.0',
    'Content-Length': Buffer.byteLength(postData)
  },
  rejectUnauthorized: false // Allow self-signed certificates
};

console.log('🧪 Testing LOCAL async callback endpoint...');
console.log('📡 URL:', `https://${options.hostname}:${options.port}${options.path}`);
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
        console.log('\n🎉 SUCCESS: Local async callback endpoint is working!');
        console.log('✅ Ready to debug production deployment');
      } else {
        console.log('\n❌ ERROR: Local endpoint issue - Status:', res.statusCode);
      }
    } catch (e) {
      console.log('Raw response:', data);
      if (res.statusCode === 200) {
        console.log('\n🎉 SUCCESS: Local endpoint responded (non-JSON response)');
      }
    }
  });
});

req.on('error', (e) => {
  console.error('\n❌ Local request failed:', e.message);
  console.log('💡 Make sure the dev server is running on https://localhost:3000');
});

req.write(postData);
req.end(); 