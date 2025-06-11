#!/usr/bin/env node

/**
 * Async Workflow Test Suite for discordant-agent-0001
 * Tests the new immediate response + async callback pattern
 */

const https = require('https');
const http = require('http');

// Test Configuration
const config = {
  // Production URLs
  discordantUrl: 'https://discordant.kendev.co/api/workflow',
  n8nDirectUrl: 'https://n8n.kendev.co/webhook/discordant-ai-services',
  callbackUrl: 'https://discordant.kendev.co/api/ai/workflow-complete',
  
  // Test data
  testChannelId: 'test-channel-' + Date.now(),
  testUserId: 'test-user-' + Date.now(),
  
  // Timeouts
  immediateTimeout: 5000,  // 5 seconds for immediate response
  callbackTimeout: 60000,  // 60 seconds for callback
};

console.log('🚀 Starting Async Workflow Test Suite');
console.log('📊 Configuration:', JSON.stringify(config, null, 2));

// Test Cases
const testCases = [
  {
    name: 'Basic AI Query',
    message: 'What is the current time and how can you help me?',
    expectedKeywords: ['time', 'help', 'assistant']
  },
  {
    name: 'Calendar Request', 
    message: 'Show me my calendar for this week',
    expectedKeywords: ['calendar', 'week', 'events']
  },
  {
    name: 'Client Research',
    message: 'Research Amazon for GSA automation opportunities',
    expectedKeywords: ['Amazon', 'GSA', 'opportunities']
  },
  {
    name: 'Web Research',
    message: 'Find current news about artificial intelligence trends',
    expectedKeywords: ['artificial intelligence', 'trends', 'news']
  },
  {
    name: 'Simple Greeting',
    message: 'Hello AI assistant!',
    expectedKeywords: ['hello', 'assistant', 'help']
  }
];

// HTTP Request Helper
function makeRequest(url, method = 'POST', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AsyncWorkflowTester/1.0',
        ...headers
      }
    };
    
    if (data) {
      const payload = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(payload);
    }
    
    const req = client.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = responseData ? JSON.parse(responseData) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsed,
            raw: responseData
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: responseData,
            raw: responseData,
            parseError: e.message
          });
        }
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test Individual Workflow
async function testWorkflow(testCase) {
  console.log(`\n🧪 Testing: ${testCase.name}`);
  console.log(`📝 Message: "${testCase.message}"`);
  
  const startTime = Date.now();
  const testSessionId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const payload = {
    message: testCase.message,
    channelId: config.testChannelId,
    userId: config.testUserId,
    sessionId: testSessionId,
    userName: 'Test User',
    serverId: 'test-server',
    platform: 'test',
    timestamp: new Date().toISOString()
  };
  
  try {
    // Step 1: Test immediate response
    console.log('⏱️  Step 1: Testing immediate response...');
    
    const immediateResponse = await makeRequest(
      config.discordantUrl,
      'POST',
      payload,
      {
        'X-Workflow-Id': 'discordant-agent-0001',
        'X-Webhook-Path': 'discordant-ai-services'
      }
    );
    
    const immediateTime = Date.now() - startTime;
    console.log(`✅ Immediate Response (${immediateTime}ms):`, immediateResponse.status);
    console.log(`📊 Response Data:`, JSON.stringify(immediateResponse.data, null, 2));
    
    // Validate immediate response
    if (immediateResponse.status !== 200) {
      throw new Error(`Unexpected immediate response status: ${immediateResponse.status}`);
    }
    
    if (!immediateResponse.data.success || immediateResponse.data.status !== 'processing') {
      console.warn('⚠️  Unexpected immediate response format:', immediateResponse.data);
    }
    
    if (immediateTime > config.immediateTimeout) {
      console.warn(`⚠️  Immediate response took too long: ${immediateTime}ms`);
    }
    
    // Step 2: Test direct n8n workflow (for comparison)
    console.log('🔧 Step 2: Testing direct n8n workflow...');
    
    const directStartTime = Date.now();
    const directResponse = await makeRequest(
      config.n8nDirectUrl,
      'POST',
      payload
    );
    
    const directTime = Date.now() - directStartTime;
    console.log(`🎯 Direct n8n Response (${directTime}ms):`, directResponse.status);
    
    if (directResponse.status === 200) {
      console.log(`📝 Direct Response Preview:`, 
        directResponse.data?.content?.substring(0, 200) || 
        directResponse.raw?.substring(0, 200) || 
        'No content preview available'
      );
    } else {
      console.warn(`⚠️  Direct n8n failed with status ${directResponse.status}`);
      console.warn(`⚠️  Error:`, directResponse.raw || directResponse.data);
    }
    
    return {
      testCase: testCase.name,
      success: true,
      immediateResponse: {
        status: immediateResponse.status,
        time: immediateTime,
        data: immediateResponse.data
      },
      directResponse: {
        status: directResponse.status,
        time: directTime,
        preview: directResponse.data?.content?.substring(0, 200) || directResponse.raw?.substring(0, 200)
      },
      totalTime: Date.now() - startTime
    };
    
  } catch (error) {
    console.error(`❌ Test failed: ${error.message}`);
    return {
      testCase: testCase.name,
      success: false,
      error: error.message,
      totalTime: Date.now() - startTime
    };
  }
}

// Test Callback Endpoint
async function testCallbackEndpoint() {
  console.log('\n🔗 Testing Callback Endpoint...');
  
  const testCallbackPayload = {
    content: '🧪 **Test Callback Response**\n\nThis is a test of the async callback system.\n\n**Status**: Callback endpoint operational\n**Time**: ' + new Date().toLocaleTimeString(),
    metadata: {
      channelId: config.testChannelId,
      userId: config.testUserId,
      sessionId: 'callback-test-' + Date.now(),
      timestamp: new Date().toISOString(),
      testMode: true
    }
  };
  
  try {
    const callbackResponse = await makeRequest(
      config.callbackUrl,
      'POST',
      testCallbackPayload
    );
    
    console.log('✅ Callback Response:', callbackResponse.status);
    console.log('📊 Callback Data:', JSON.stringify(callbackResponse.data, null, 2));
    
    return {
      success: callbackResponse.status === 200,
      status: callbackResponse.status,
      data: callbackResponse.data
    };
    
  } catch (error) {
    console.error(`❌ Callback test failed: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

// Health Check
async function healthCheck() {
  console.log('\n🏥 Running Health Checks...');
  
  const checks = [
    { name: 'Discordant API', url: 'https://discordant.kendev.co/api/health' },
    { name: 'n8n Webhook', url: config.n8nDirectUrl }
  ];
  
  const results = [];
  
  for (const check of checks) {
    try {
      const response = await makeRequest(check.url, 'GET');
      results.push({
        name: check.name,
        status: response.status,
        success: response.status >= 200 && response.status < 400
      });
      console.log(`✅ ${check.name}: ${response.status}`);
    } catch (error) {
      results.push({
        name: check.name,
        error: error.message,
        success: false
      });
      console.log(`❌ ${check.name}: ${error.message}`);
    }
  }
  
  return results;
}

// Main Test Runner
async function runAllTests() {
  const startTime = Date.now();
  
  console.log('🏁 Starting Comprehensive Test Suite\n');
  
  // Health check first
  const healthResults = await healthCheck();
  
  // Test callback endpoint
  const callbackResult = await testCallbackEndpoint();
  
  // Run workflow tests
  const testResults = [];
  
  for (const testCase of testCases) {
    const result = await testWorkflow(testCase);
    testResults.push(result);
    
    // Wait between tests to avoid rate limiting
    if (testResults.length < testCases.length) {
      console.log('⏳ Waiting 3 seconds between tests...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  // Generate Summary Report
  const totalTime = Date.now() - startTime;
  const successfulTests = testResults.filter(r => r.success).length;
  const failedTests = testResults.filter(r => !r.success).length;
  
  console.log('\n📋 COMPREHENSIVE TEST REPORT');
  console.log('=' .repeat(50));
  console.log(`⏱️  Total Execution Time: ${totalTime}ms`);
  console.log(`✅ Successful Tests: ${successfulTests}/${testCases.length}`);
  console.log(`❌ Failed Tests: ${failedTests}/${testCases.length}`);
  console.log(`🔗 Callback Test: ${callbackResult.success ? 'PASS' : 'FAIL'}`);
  console.log(`🏥 Health Checks: ${healthResults.filter(h => h.success).length}/${healthResults.length} PASS`);
  
  console.log('\n📊 INDIVIDUAL TEST RESULTS:');
  testResults.forEach(result => {
    console.log(`  ${result.success ? '✅' : '❌'} ${result.testCase} (${result.totalTime}ms)`);
    if (result.immediateResponse) {
      console.log(`    • Immediate: ${result.immediateResponse.time}ms`);
      console.log(`    • Direct n8n: ${result.directResponse.time}ms`);
    }
    if (result.error) {
      console.log(`    • Error: ${result.error}`);
    }
  });
  
  console.log('\n🎯 RECOMMENDATIONS:');
  
  if (failedTests > 0) {
    console.log('❌ Some tests failed - check error messages above');
  }
  
  const avgImmediateTime = testResults
    .filter(r => r.immediateResponse)
    .reduce((sum, r) => sum + r.immediateResponse.time, 0) / successfulTests;
    
  if (avgImmediateTime > 2000) {
    console.log('⚠️  Average immediate response time is high:', avgImmediateTime.toFixed(0) + 'ms');
  } else {
    console.log('✅ Immediate response times are good:', avgImmediateTime.toFixed(0) + 'ms average');
  }
  
  if (!callbackResult.success) {
    console.log('❌ Callback endpoint needs attention');
  } else {
    console.log('✅ Callback endpoint operational');
  }
  
  console.log('\n🚀 Next Steps:');
  console.log('1. Deploy the updated workflow to production');
  console.log('2. Monitor callback endpoint logs for async responses'); 
  console.log('3. Test real Discord integration with HTTPS development server');
  console.log('4. Verify MySQL search tools are working correctly');
  
  console.log('\n✨ Test Suite Complete!');
  
  return {
    totalTime,
    successfulTests,
    failedTests,
    callbackWorking: callbackResult.success,
    avgImmediateTime,
    healthPassing: healthResults.filter(h => h.success).length
  };
}

// Execute if run directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runAllTests,
  testWorkflow,
  testCallbackEndpoint,
  healthCheck,
  config
}; 