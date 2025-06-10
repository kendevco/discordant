// test-workflow-response.js
// Test script to debug n8n response structure

const testPayload = {
  message: "what's on my calendar today",
  userId: "test-user",
  userName: "Test User",
  channelId: "test-channel",
  timestamp: new Date().toISOString(),
  metadata: {
    platform: "discordant-chat",
    messageType: "text",
    hasAttachment: false,
    priority: "normal",
    sessionId: "test-session",
    routedBy: "workflow-router",
    workflowId: "general-assistant",
    intent: "calendar"
  }
};

async function testWorkflow() {
  try {
    console.log('Testing workflow response...');
    console.log('Payload:', JSON.stringify(testPayload, null, 2));
    
    const response = await fetch('http://localhost:3001/api/workflow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Workflow-Id': 'general-assistant',
        'X-Webhook-Path': 'assistant' // Simplified path
      },
      body: JSON.stringify(testPayload)
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    // Check different possible response structures
    console.log('\n=== Response Analysis ===');
    console.log('Type:', typeof data);
    console.log('Is Array:', Array.isArray(data));
    console.log('Keys:', Object.keys(data));
    
    if (Array.isArray(data) && data.length > 0) {
      console.log('First item keys:', Object.keys(data[0]));
      console.log('Message:', data[0].message);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testWorkflow(); 