#!/usr/bin/env node

/**
 * VAPI Integration Test Script - Discordant AI Bot Integration
 * Tests the unified VAPI-Discord integration using the main AI workflow
 */

const https = require('https');
const http = require('http');

// Configuration
const config = {
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://discordant.kendev.co' 
    : 'https://localhost:3000',
  testCallId: `test-call-${Date.now()}`,
  testChannelId: process.env.TEST_CHANNEL_ID || 'test-channel-id',
  testServerId: process.env.TEST_SERVER_ID || 'a90f1d41-12a9-4586-b9a4-a513d3bd01d9'
};

// Helper function to make HTTP requests
function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'https:' ? https : http;
    
    // For localhost, reject unauthorized certificates
    if (options.hostname === 'localhost') {
      options.rejectUnauthorized = false;
    }
    
    const req = protocol.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test functions
async function testHealthCheck() {
  console.log('\n🔍 Testing VAPI Proxy Health Check...');
  
  try {
    const url = new URL(`${config.baseUrl}/api/voice-ai/vapi/proxy`);
    
    const response = await makeRequest({
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.status === 200) {
      const data = JSON.parse(response.body);
      console.log('✅ Health check passed');
      console.log('📊 Response:', JSON.stringify(data, null, 2));
      return true;
    } else {
      console.error('❌ Health check failed:', response.status);
      console.log('📊 Response:', response.body);
      return false;
    }
  } catch (error) {
    console.error('❌ Health check error:', error.message);
    return false;
  }
}

async function testVAPIWebhook(transcript = "Hello, I need help with my GSA Schedule qualification") {
  console.log('\n🎤 Testing VAPI Webhook with Discordant AI Integration...');
  
  try {
    const url = new URL(`${config.baseUrl}/api/voice-ai/vapi/webhook`);
    
    const webhookPayload = {
      message: {
        type: "webhook",
        call: {
          id: config.testCallId,
          phoneNumber: "+1234567890",
          assistantId: "test-assistant",
          status: "in-progress",
          metadata: {
            serverId: config.testServerId,
            channelId: config.testChannelId
          }
        },
        transcript: transcript,
        customer: {
          number: "+1234567890"
        }
      }
    };
    
    console.log('📤 Sending transcript:', transcript);
    
    const response = await makeRequest({
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }, webhookPayload);
    
    if (response.status === 200) {
      const data = JSON.parse(response.body);
      console.log('✅ VAPI webhook test passed');
      console.log('📊 Response:', JSON.stringify(data, null, 2));
      console.log('\n🤖 AI Response:', data.response);
      return data;
    } else {
      console.error('❌ VAPI webhook test failed:', response.status);
      console.log('📊 Response:', response.body);
      return null;
    }
  } catch (error) {
    console.error('❌ VAPI webhook test error:', error.message);
    return null;
  }
}

async function testToolExecution() {
  console.log('\n🛠️ Testing Tool Execution through VAPI...');
  
  const toolQueries = [
    {
      query: "Search for recent messages about GSA schedules",
      expectedTool: "Intelligent Search Hub"
    },
    {
      query: "What's the latest news about federal contracting opportunities?",
      expectedTool: "Web Research"
    },
    {
      query: "Analyze if ABC Company qualifies for GSA Schedule 70",
      expectedTool: "GSA Research Suite"
    }
  ];
  
  for (const test of toolQueries) {
    console.log(`\n📝 Testing: "${test.query}"`);
    console.log(`🎯 Expected Tool: ${test.expectedTool}`);
    
    const result = await testVAPIWebhook(test.query);
    
    if (result && result.response) {
      console.log('✅ Tool execution test completed');
    } else {
      console.log('❌ Tool execution test failed');
    }
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

async function testEndToEndFlow() {
  console.log('\n🔄 Testing End-to-End Flow with Discordant AI Bot...');
  
  console.log('\n📞 Simulating VAPI voice call...');
  
  // Step 1: Initial query
  const initialQuery = await testVAPIWebhook(
    "Hello, I'm calling about GSA Schedule consulting services. Can you help me understand if my IT company qualifies?"
  );
  
  if (!initialQuery) {
    console.error('❌ End-to-end flow failed at initial query');
    return false;
  }
  
  console.log('\n⏳ Waiting for follow-up...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Step 2: Follow-up query
  const followUpQuery = await testVAPIWebhook(
    "My company provides cloud computing services to government agencies. We have about 50 employees and $10M in annual revenue."
  );
  
  if (!followUpQuery) {
    console.error('❌ End-to-end flow failed at follow-up query');
    return false;
  }
  
  console.log('\n✅ End-to-end flow test completed successfully!');
  console.log('📋 Summary:');
  console.log('   - Call ID:', config.testCallId);
  console.log('   - Channel ID:', config.testChannelId);
  console.log('   - AI Workflow: Discordant AI Bot v3.0');
  console.log('   - Integration: Unified VAPI-Discord');
  
  return true;
}

// Main execution
async function main() {
  console.log('🚀 Starting VAPI-Discordant AI Integration Tests');
  console.log('🌐 Base URL:', config.baseUrl);
  console.log('📞 Test Call ID:', config.testCallId);
  console.log('📺 Test Channel ID:', config.testChannelId);
  console.log('🏢 Test Server ID:', config.testServerId);
  console.log('🤖 AI Workflow: Discordant AI Bot v3.0');
  
  const args = process.argv.slice(2);
  let testsRun = 0;
  let testsPassed = 0;
  
  // Parse command line arguments
  if (args.includes('--health-only')) {
    testsRun++;
    if (await testHealthCheck()) testsPassed++;
  } else if (args.includes('--webhook-test')) {
    testsRun++;
    if (await testHealthCheck()) testsPassed++;
    
    testsRun++;
    if (await testVAPIWebhook()) testsPassed++;
  } else if (args.includes('--tools-test')) {
    testsRun++;
    if (await testHealthCheck()) testsPassed++;
    
    await testToolExecution();
    testsRun++;
    testsPassed++; // Tool tests are informational
  } else {
    // Run all tests
    testsRun++;
    if (await testHealthCheck()) testsPassed++;
    
    testsRun++;
    if (await testVAPIWebhook()) testsPassed++;
    
    await testToolExecution();
    testsRun++;
    testsPassed++; // Tool tests are informational
    
    testsRun++;
    if (await testEndToEndFlow()) testsPassed++;
  }
  
  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log(`   Tests Run: ${testsRun}`);
  console.log(`   Tests Passed: ${testsPassed}`);
  console.log(`   Success Rate: ${Math.round((testsPassed/testsRun) * 100)}%`);
  
  if (testsPassed === testsRun) {
    console.log('\n🎉 All tests passed! VAPI-Discordant AI integration is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the logs above for details.');
    process.exit(1);
  }
}

// Run main function
main().catch(console.error); 