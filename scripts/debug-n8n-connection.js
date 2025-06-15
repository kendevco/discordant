#!/usr/bin/env node

/**
 * N8N Connection Debugger
 * Comprehensive testing of n8n integration and response handling
 */

const fetch = require('node-fetch');

const config = {
  webhookUrl: 'https://n8n.kendev.co/webhook/discordant-ai-services',
  apiUrl: 'https://n8n.kendev.co/api/v1',
  apiKey: process.env.N8N_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYzI5YmEwNS03Mzk4LTQwMjItYjBhZS1hYWEzMmM0OTk1ZTMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzM0ODEzMTM5fQ.GBBhKDwdxkWArb4OgWbCwOq2w8URtm4VleJ3b6MxNVo'
};

async function testWebhookConnection() {
  console.log('🔗 Testing N8N Webhook Connection...\n');
  
  const testPayload = {
    message: "Test connection - please respond with status",
    userId: "debug-user",
    userName: "Debug User",
    channelId: "debug-channel",
    messageId: `debug-${Date.now()}`,
    timestamp: new Date().toISOString(),
    metadata: {
      platform: "debug-test",
      messageType: "text",
      hasAttachment: false,
      priority: "normal",
      sessionId: "debug-session",
      routedBy: "debug-script",
      workflowId: "connection-test"
    }
  };

  try {
    console.log('📤 Sending payload:', JSON.stringify(testPayload, null, 2));
    
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Discordant-Debug/1.0'
      },
      body: JSON.stringify(testPayload),
      timeout: 30000
    });

    console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
    console.log('📋 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📄 Raw Response:', responseText);
    
    if (responseText) {
      try {
        const jsonResponse = JSON.parse(responseText);
        console.log('✅ Parsed JSON Response:', JSON.stringify(jsonResponse, null, 2));
        return { success: true, data: jsonResponse };
      } catch (parseError) {
        console.log('❌ JSON Parse Error:', parseError.message);
        return { success: false, error: 'Invalid JSON response', raw: responseText };
      }
    } else {
      console.log('⚠️ Empty response body');
      return { success: false, error: 'Empty response' };
    }
    
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function testAPIConnection() {
  console.log('\n🔗 Testing N8N API Connection...\n');
  
  try {
    const response = await fetch(`${config.apiUrl}/workflows`, {
      headers: {
        'X-N8N-API-KEY': config.apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log(`📊 API Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const workflows = await response.json();
      console.log(`✅ Found ${workflows.data?.length || 0} workflows`);
      
      // Look for our specific workflow
      const discordantWorkflow = workflows.data?.find(w => 
        w.name?.includes('Discordant') || w.name?.includes('discordant')
      );
      
      if (discordantWorkflow) {
        console.log('🎯 Found Discordant workflow:', {
          id: discordantWorkflow.id,
          name: discordantWorkflow.name,
          active: discordantWorkflow.active
        });
        return { success: true, workflow: discordantWorkflow };
      } else {
        console.log('⚠️ No Discordant workflow found');
        return { success: true, workflows: workflows.data?.map(w => ({ id: w.id, name: w.name })) };
      }
    } else {
      const errorText = await response.text();
      console.log('❌ API Error:', errorText);
      return { success: false, error: errorText };
    }
    
  } catch (error) {
    console.error('❌ API Connection Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function testToolUseCapability() {
  console.log('\n🛠️ Testing Tool Use Capability...\n');
  
  const toolTestPayload = {
    message: "What's the weather like in Tampa, FL? Please use your web search tool to find current weather information.",
    userId: "tool-test-user",
    userName: "Tool Test User", 
    channelId: "tool-test-channel",
    messageId: `tool-test-${Date.now()}`,
    timestamp: new Date().toISOString(),
    metadata: {
      platform: "tool-test",
      messageType: "text",
      hasAttachment: false,
      priority: "normal",
      sessionId: "tool-test-session",
      routedBy: "tool-test-script",
      workflowId: "tool-capability-test",
      intent: "research"
    }
  };

  try {
    console.log('🔧 Testing tool use with research query...');
    
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Discordant-ToolTest/1.0'
      },
      body: JSON.stringify(toolTestPayload),
      timeout: 45000 // Longer timeout for tool use
    });

    console.log(`📊 Tool Test Status: ${response.status}`);
    
    const responseText = await response.text();
    console.log('📄 Tool Test Response:', responseText);
    
    if (responseText) {
      try {
        const jsonResponse = JSON.parse(responseText);
        
        // Check if response indicates tool use
        const responseStr = JSON.stringify(jsonResponse).toLowerCase();
        const hasToolIndicators = [
          'tavily', 'search', 'weather', 'tool', 'research'
        ].some(indicator => responseStr.includes(indicator));
        
        console.log('🔍 Tool Use Indicators Found:', hasToolIndicators);
        return { success: true, toolsUsed: hasToolIndicators, response: jsonResponse };
      } catch (parseError) {
        console.log('❌ Tool Test JSON Parse Error:', parseError.message);
        return { success: false, error: 'Invalid JSON in tool test' };
      }
    } else {
      console.log('⚠️ Empty tool test response');
      return { success: false, error: 'Empty tool test response' };
    }
    
  } catch (error) {
    console.error('❌ Tool Test Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function testImageHandler() {
  console.log('\n🖼️ Testing Image Handler Capability...\n');
  
  const imageTestPayload = {
    message: "Please analyze this test image",
    userId: "image-test-user",
    userName: "Image Test User",
    channelId: "image-test-channel", 
    messageId: `image-test-${Date.now()}`,
    timestamp: new Date().toISOString(),
    metadata: {
      platform: "image-test",
      messageType: "file",
      hasAttachment: true,
      attachmentUrl: "https://via.placeholder.com/300x200.png?text=Test+Image",
      priority: "normal",
      sessionId: "image-test-session",
      routedBy: "image-test-script",
      workflowId: "image-handler-test",
      intent: "document"
    }
  };

  try {
    console.log('🖼️ Testing image processing capability...');
    
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Discordant-ImageTest/1.0'
      },
      body: JSON.stringify(imageTestPayload),
      timeout: 60000 // Longer timeout for image processing
    });

    console.log(`📊 Image Test Status: ${response.status}`);
    
    const responseText = await response.text();
    console.log('📄 Image Test Response:', responseText);
    
    if (responseText) {
      try {
        const jsonResponse = JSON.parse(responseText);
        
        // Check if response indicates image processing
        const responseStr = JSON.stringify(jsonResponse).toLowerCase();
        const hasImageIndicators = [
          'image', 'analysis', 'visual', 'picture', 'photo'
        ].some(indicator => responseStr.includes(indicator));
        
        console.log('🔍 Image Processing Indicators Found:', hasImageIndicators);
        return { success: true, imageProcessed: hasImageIndicators, response: jsonResponse };
      } catch (parseError) {
        console.log('❌ Image Test JSON Parse Error:', parseError.message);
        return { success: false, error: 'Invalid JSON in image test' };
      }
    } else {
      console.log('⚠️ Empty image test response');
      return { success: false, error: 'Empty image test response' };
    }
    
  } catch (error) {
    console.error('❌ Image Test Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function runDiagnostics() {
  console.log('🚀 N8N Integration Diagnostics Starting...\n');
  console.log('=' .repeat(60));
  
  const results = {
    webhook: await testWebhookConnection(),
    api: await testAPIConnection(), 
    toolUse: await testToolUseCapability(),
    imageHandler: await testImageHandler()
  };
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 DIAGNOSTIC SUMMARY');
  console.log('='.repeat(60));
  
  console.log(`🔗 Webhook Connection: ${results.webhook.success ? '✅ WORKING' : '❌ FAILED'}`);
  if (!results.webhook.success) {
    console.log(`   Error: ${results.webhook.error}`);
  }
  
  console.log(`🔗 API Connection: ${results.api.success ? '✅ WORKING' : '❌ FAILED'}`);
  if (!results.api.success) {
    console.log(`   Error: ${results.api.error}`);
  }
  
  console.log(`🛠️ Tool Use: ${results.toolUse.success && results.toolUse.toolsUsed ? '✅ WORKING' : '❌ FAILED'}`);
  if (!results.toolUse.success) {
    console.log(`   Error: ${results.toolUse.error}`);
  } else if (!results.toolUse.toolsUsed) {
    console.log(`   Issue: Tools not being used in responses`);
  }
  
  console.log(`🖼️ Image Handler: ${results.imageHandler.success && results.imageHandler.imageProcessed ? '✅ WORKING' : '❌ FAILED'}`);
  if (!results.imageHandler.success) {
    console.log(`   Error: ${results.imageHandler.error}`);
  } else if (!results.imageHandler.imageProcessed) {
    console.log(`   Issue: Image processing not detected in responses`);
  }
  
  console.log('\n🎯 RECOMMENDATIONS:');
  
  if (!results.webhook.success) {
    console.log('• Fix webhook connectivity - check n8n server status');
    console.log('• Verify webhook URL and routing configuration');
  }
  
  if (!results.api.success) {
    console.log('• Check N8N API key and permissions');
    console.log('• Verify n8n server API endpoint accessibility');
  }
  
  if (results.webhook.success && (!results.toolUse.toolsUsed || !results.imageHandler.imageProcessed)) {
    console.log('• Workflow is responding but tools may not be configured properly');
    console.log('• Check OpenAI function calling configuration in workflows');
    console.log('• Verify tool response formatting and callback handling');
  }
  
  console.log('\n✅ Diagnostics Complete!');
  
  return results;
}

// Run diagnostics if called directly
if (require.main === module) {
  runDiagnostics().catch(console.error);
}

module.exports = { runDiagnostics, testWebhookConnection, testAPIConnection, testToolUseCapability, testImageHandler }; 