#!/usr/bin/env node

/**
 * Quick N8N Test - Demonstrates webhook functionality
 */

const fetch = require('node-fetch');

async function quickTest() {
  const webhookUrl = 'https://n8n.kendev.co/webhook/discordant-ai-services';
  
  const testData = {
    message: 'Quick test from automated script - please confirm Enhanced AI Agent v5.5 is working',
    userId: 'test-script-user',
    userName: 'Automated Test Script',
    channelId: 'test-channel-' + Date.now(),
    serverId: 'a90f1d41-12a9-4586-b9a4-a513d3bd01d9',
    timestamp: new Date().toISOString(),
    metadata: {
      platform: 'discordant-chat',
      messageType: 'text',
      sessionId: 'test-session-' + Date.now(),
      routedBy: 'quick-test-script'
    }
  };

  console.log('🚀 Testing Enhanced Business Intelligence AI Agent v5.5');
  console.log('📡 Webhook URL:', webhookUrl);
  console.log('📝 Test Message:', testData.message);
  console.log('⏱️ Starting test...\n');

  const startTime = Date.now();

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Discordant-Quick-Test/1.0'
      },
      body: JSON.stringify(testData),
      timeout: 60000
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    console.log('✅ SUCCESS!');
    console.log('⚡ Response Time:', duration + 'ms');
    console.log('📊 Status:', response.status);
    
    if (result.content) {
      console.log('🤖 AI Response Preview:');
      console.log(result.content.substring(0, 200) + '...');
    } else {
      console.log('📄 Response Type:', typeof result);
      console.log('📄 Response Keys:', Object.keys(result));
    }

  } catch (error) {
    const duration = Date.now() - startTime;
    console.log('❌ FAILED!');
    console.log('⚡ Duration:', duration + 'ms');
    console.log('🚨 Error:', error.message);
  }
}

// Run the test
quickTest().then(() => {
  console.log('\n🎯 Quick test complete!');
}).catch(error => {
  console.error('💥 Test failed:', error.message);
  process.exit(1);
}); 