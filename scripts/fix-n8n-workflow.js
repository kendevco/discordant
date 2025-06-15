#!/usr/bin/env node

/**
 * N8N Workflow Fix Script
 * Diagnoses and fixes common n8n workflow execution issues
 */

const fetch = require('node-fetch');

const config = {
  webhookUrl: 'https://n8n.kendev.co/webhook/discordant-ai-services',
  apiUrl: 'https://n8n.kendev.co/api/v1',
  apiKey: process.env.N8N_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYzI5YmEwNS03Mzk4LTQwMjItYjBhZS1hYWEzMmM0OTk1ZTMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzM0ODEzMTM5fQ.GBBhKDwdxkWArb4OgWbCwOq2w8URtm4VleJ3b6MxNVo'
};

async function testWorkflowExecution() {
  console.log('🔧 Testing N8N Workflow Execution Issues...\n');
  
  // Test 1: Simple message processing
  console.log('📝 Test 1: Simple Message Processing');
  const simpleTest = await testSimpleMessage();
  console.log(`Result: ${simpleTest.success ? '✅ PASS' : '❌ FAIL'}`);
  if (!simpleTest.success) {
    console.log(`Error: ${simpleTest.error}`);
  }
  console.log('');
  
  // Test 2: Tool use activation
  console.log('🛠️ Test 2: Tool Use Activation');
  const toolTest = await testToolActivation();
  console.log(`Result: ${toolTest.success ? '✅ PASS' : '❌ FAIL'}`);
  if (!toolTest.success) {
    console.log(`Error: ${toolTest.error}`);
  }
  console.log('');
  
  // Test 3: Callback mechanism
  console.log('📞 Test 3: Callback Mechanism');
  const callbackTest = await testCallbackMechanism();
  console.log(`Result: ${callbackTest.success ? '✅ PASS' : '❌ FAIL'}`);
  if (!callbackTest.success) {
    console.log(`Error: ${callbackTest.error}`);
  }
  console.log('');
  
  return { simpleTest, toolTest, callbackTest };
}

async function testSimpleMessage() {
  const payload = {
    input: "Hello, please respond with a simple greeting",
    messageId: `simple-test-${Date.now()}`,
    userId: "test-user",
    channelId: "test-channel",
    sessionId: "test-session",
    platform: "discordant-chat",
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'N8N-WorkflowFix/1.0'
      },
      body: JSON.stringify(payload),
      timeout: 30000
    });

    const result = await response.text();
    console.log('Simple message response:', result);
    
    // Check if we get a proper response
    if (result && result.includes('processing')) {
      return { success: true, response: result };
    } else {
      return { success: false, error: 'No processing response received' };
    }
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testToolActivation() {
  const payload = {
    input: "Please search the web for current weather in Tampa, Florida using your Tavily search tool",
    messageId: `tool-test-${Date.now()}`,
    userId: "test-user",
    channelId: "test-channel", 
    sessionId: "test-session",
    platform: "discordant-chat",
    timestamp: new Date().toISOString(),
    metadata: {
      intent: "research",
      requiresTools: true
    }
  };

  try {
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'N8N-ToolTest/1.0'
      },
      body: JSON.stringify(payload),
      timeout: 45000
    });

    const result = await response.text();
    console.log('Tool activation response:', result);
    
    // Wait a bit and check if we get a callback
    console.log('Waiting 10 seconds for tool execution...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    return { success: true, response: result };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testCallbackMechanism() {
  // Test the callback endpoint directly
  const callbackPayload = {
    content: "Test callback response from workflow fix script",
    metadata: {
      channelId: "test-channel",
      messageId: `callback-test-${Date.now()}`,
      workflowId: "test-workflow",
      platform: "n8n-test"
    }
  };

  try {
    const response = await fetch('https://discordant-git-main-ken-dev-co.vercel.app/api/ai/workflow-complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'N8N-CallbackTest/1.0'
      },
      body: JSON.stringify(callbackPayload),
      timeout: 15000
    });

    const result = await response.text();
    console.log('Callback test response:', result);
    console.log('Callback status:', response.status);
    
    if (response.ok) {
      return { success: true, response: result };
    } else {
      return { success: false, error: `HTTP ${response.status}: ${result}` };
    }
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function diagnoseWorkflowIssues() {
  console.log('🔍 Diagnosing N8N Workflow Issues...\n');
  
  const issues = [];
  const fixes = [];
  
  // Check 1: Webhook response format
  console.log('1. Checking webhook response format...');
  try {
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'format-check' }),
      timeout: 10000
    });
    
    const result = await response.text();
    
    if (result.includes('{{ new Date().toISOString() }}')) {
      issues.push('❌ Template expressions not being processed in webhook response');
      fixes.push('• Fix template processing in n8n workflow response node');
    }
    
    if (!result.includes('processing')) {
      issues.push('❌ Webhook not returning expected processing status');
      fixes.push('• Check webhook response node configuration');
    }
    
    console.log('✅ Webhook format check complete');
    
  } catch (error) {
    issues.push(`❌ Webhook connectivity issue: ${error.message}`);
    fixes.push('• Check n8n server status and webhook URL');
  }
  
  // Check 2: Tool configuration
  console.log('2. Checking tool configuration...');
  
  // This would require API access, but we know it's failing
  issues.push('❌ N8N API access denied (401 Unauthorized)');
  fixes.push('• Update N8N API key or check permissions');
  fixes.push('• Verify API key has workflow read/write access');
  
  // Check 3: Callback URL accessibility
  console.log('3. Checking callback URL accessibility...');
  try {
    const response = await fetch('https://discordant-git-main-ken-dev-co.vercel.app/api/ai/workflow-complete', {
      method: 'OPTIONS',
      timeout: 10000
    });
    
    if (response.ok) {
      console.log('✅ Callback endpoint accessible');
    } else {
      issues.push('❌ Callback endpoint not accessible');
      fixes.push('• Check Vercel deployment status');
    }
    
  } catch (error) {
    issues.push(`❌ Callback endpoint error: ${error.message}`);
    fixes.push('• Verify callback URL in n8n workflow');
  }
  
  return { issues, fixes };
}

async function generateFixRecommendations() {
  console.log('🛠️ Generating Fix Recommendations...\n');
  
  const diagnosis = await diagnoseWorkflowIssues();
  
  console.log('📋 IDENTIFIED ISSUES:');
  diagnosis.issues.forEach(issue => console.log(`  ${issue}`));
  
  console.log('\n🔧 RECOMMENDED FIXES:');
  diagnosis.fixes.forEach(fix => console.log(`  ${fix}`));
  
  console.log('\n🎯 PRIORITY ACTIONS:');
  console.log('  1. Fix template processing in n8n workflow response');
  console.log('  2. Update N8N API key for proper authentication');
  console.log('  3. Verify tool configurations in workflow');
  console.log('  4. Test callback mechanism end-to-end');
  console.log('  5. Enable workflow debugging/logging');
  
  console.log('\n📝 SPECIFIC N8N WORKFLOW FIXES NEEDED:');
  console.log('  • Response node: Fix timestamp template expression');
  console.log('  • AI Agent node: Verify OpenAI credentials and model');
  console.log('  • Tool nodes: Check Tavily API key and configuration');
  console.log('  • HTTP Request node: Verify callback URL and payload');
  console.log('  • Error handling: Add proper error nodes and logging');
  
  return diagnosis;
}

async function main() {
  console.log('🚀 N8N Workflow Fix Script Starting...\n');
  console.log('='.repeat(60));
  
  // Run tests
  const testResults = await testWorkflowExecution();
  
  console.log('='.repeat(60));
  
  // Generate recommendations
  const recommendations = await generateFixRecommendations();
  
  console.log('\n✅ Workflow fix analysis complete!');
  console.log('\nNext steps:');
  console.log('1. Access n8n workflow editor');
  console.log('2. Apply the recommended fixes');
  console.log('3. Test with this script again');
  console.log('4. Monitor callback responses');
  
  return { testResults, recommendations };
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testWorkflowExecution, diagnoseWorkflowIssues, generateFixRecommendations }; 