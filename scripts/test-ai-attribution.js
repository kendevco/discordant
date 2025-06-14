#!/usr/bin/env node

/**
 * AI Attribution Test Script
 * Tests and debugs AI message attribution issues
 */

console.log('🤖 AI Attribution Test Script Starting...\n');

// Test the workflow callback system
async function testWorkflowCallback() {
  console.log('📡 Testing Workflow Callback System...\n');
  
  const testPayload = {
    content: "This is a test AI response from the attribution verification script.",
    metadata: {
      channelId: "test-channel-id",
      userId: "test-user-id", 
      sessionId: "test-session-" + Date.now(),
      messageId: "test-processing-message-id-" + Date.now(),
      platform: "discordant",
      timestamp: new Date().toISOString(),
      workflowId: "attribution-test"
    }
  };

  try {
    console.log('🔄 Sending test callback payload...');
    console.log('Payload:', JSON.stringify(testPayload, null, 2));
    
    const response = await fetch('http://localhost:3000/api/ai/workflow-complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });

    console.log(`📊 Response Status: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Callback Response:', JSON.stringify(result, null, 2));
      
      if (result.attribution) {
        console.log(`\n👤 Attribution Details:`);
        console.log(`   Profile Name: ${result.attribution.profileName}`);
        console.log(`   Profile ID: ${result.attribution.profileId}`);
        console.log(`   Member ID: ${result.attribution.memberId}`);
        console.log(`   Message Role: ${result.attribution.role}`);
        
        if (result.attribution.profileName === 'System User') {
          console.log('✅ ATTRIBUTION SUCCESS: Message properly attributed to System User');
        } else {
          console.log('❌ ATTRIBUTION ISSUE: Message attributed to:', result.attribution.profileName);
        }
      }
    } else {
      const errorText = await response.text();
      console.error('❌ Callback failed:', errorText);
    }
  } catch (error) {
    console.error('❌ Callback test error:', error.message);
  }
}

// Test System User existence
async function testSystemUser() {
  console.log('\n🔍 Testing System User Configuration...\n');
  
  const SYSTEM_USER_ID = process.env.SYSTEM_USER_ID || "system-user-9000";
  console.log(`System User ID: ${SYSTEM_USER_ID}`);
  
  // This would require database access - for now just log the expected setup
  console.log('Expected System User Setup:');
  console.log('  1. Profile with ID: system-user-9000');
  console.log('  2. Name: "System User" (or similar)');
  console.log('  3. Member entries for each server');
  console.log('  4. Proper role assignments');
}

// Test n8n workflow configuration
async function testN8nWorkflow() {
  console.log('\n🔧 Testing n8n Workflow Configuration...\n');
  
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || "https://n8n.kendev.co/webhook";
  console.log(`n8n Webhook URL: ${n8nWebhookUrl}`);
  
  const testWorkflowPayload = {
    message: "test attribution verification",
    userId: "test-user",
    userName: "Test User",
    channelId: "test-channel",
    messageId: "test-message-" + Date.now(), // Critical for attribution
    timestamp: new Date().toISOString(),
    metadata: {
      platform: "discordant-chat",
      messageType: "text",
      hasAttachment: false,
      priority: "normal",
      sessionId: "test-session",
      routedBy: "attribution-test",
      workflowId: "discordant-agent-test",
      intent: "test"
    }
  };

  try {
    console.log('🚀 Testing n8n workflow connection...');
    console.log('Payload messageId:', testWorkflowPayload.messageId);
    
    const webhookUrl = `${n8nWebhookUrl}/discordant-ai-services`;
    console.log(`Webhook URL: ${webhookUrl}`);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Workflow-Id': 'discordant-agent-test',
        'X-Webhook-Path': 'discordant-ai-services',
        'User-Agent': 'Attribution-Test/1.0',
      },
      body: JSON.stringify(testWorkflowPayload),
      signal: AbortSignal.timeout(10000) // 10 second timeout for testing
    });

    console.log(`📊 n8n Response Status: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ n8n Workflow Response:', JSON.stringify(result, null, 2));
      
      // Check if messageId is being preserved
      if (result.messageId === testWorkflowPayload.messageId) {
        console.log('✅ MESSAGE_ID PRESERVED: n8n is correctly passing back messageId');
      } else {
        console.log('❌ MESSAGE_ID LOST: n8n is not preserving messageId for attribution');
        console.log(`   Expected: ${testWorkflowPayload.messageId}`);
        console.log(`   Received: ${result.messageId || 'undefined'}`);
      }
    } else {
      const errorText = await response.text();
      console.error('❌ n8n workflow failed:', errorText);
    }
  } catch (error) {
    console.error('❌ n8n workflow test error:', error.message);
    if (error.name === 'AbortError') {
      console.error('   Workflow timed out - check n8n configuration');
    }
  }
}

// Environment check
function checkEnvironment() {
  console.log('\n⚙️ Environment Configuration Check...\n');
  
  const requiredEnvVars = [
    'SYSTEM_USER_ID',
    'N8N_WEBHOOK_URL',
    'DATABASE_URL'
  ];
  
  requiredEnvVars.forEach(envVar => {
    const value = process.env[envVar];
    if (value) {
      console.log(`✅ ${envVar}: ${envVar === 'DATABASE_URL' ? '[REDACTED]' : value}`);
    } else {
      console.log(`❌ ${envVar}: NOT SET`);
    }
  });
}

// Main test runner
async function runTests() {
  console.log('🔍 AI Attribution Diagnostic Test Suite\n');
  console.log('=====================================\n');
  
  try {
    checkEnvironment();
    await testSystemUser();
    await testWorkflowCallback();
    await testN8nWorkflow();
    
    console.log('\n📋 Test Summary:');
    console.log('================');
    console.log('1. Check the attribution results above');
    console.log('2. Verify messageId is preserved through n8n workflow');
    console.log('3. Confirm System User exists in database');
    console.log('4. Test with real AI message in Discord chat');
    
  } catch (error) {
    console.error('❌ Test suite error:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  runTests();
}

module.exports = {
  testWorkflowCallback,
  testSystemUser,
  testN8nWorkflow,
  checkEnvironment
}; 