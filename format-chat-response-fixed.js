// Enhanced Format Chat Response function with comprehensive debugging
// Debug: Log what the AI Agent produced
const aiOutput = $input.first().json;
console.log('=== AI AGENT OUTPUT DEBUG ===');
console.log('AI Agent Response:', JSON.stringify(aiOutput, null, 2));
console.log('Response Type:', typeof aiOutput);
console.log('All keys in aiOutput:', Object.keys(aiOutput || {}));

// Check if it's an execution data node output
let actualAiResponse = aiOutput;
if (aiOutput.json) {
  actualAiResponse = aiOutput.json;
  console.log('Found .json property, using that:', JSON.stringify(actualAiResponse, null, 2));
}

// Try to extract the response from different possible fields with enhanced detection
let responseMessage = '';

// Check various possible response fields
const possibleFields = [
  'output', 'text', 'response', 'content', 'message', 'result', 
  'answer', 'reply', 'chatResponse', 'aiResponse', 'data'
];

console.log('=== CHECKING RESPONSE FIELDS ===');
for (const field of possibleFields) {
  if (actualAiResponse && actualAiResponse[field]) {
    console.log(`Found response in field '${field}':`, actualAiResponse[field]);
    responseMessage = actualAiResponse[field];
    break;
  }
}

// If no field found, check if the whole response is a string
if (!responseMessage && typeof actualAiResponse === 'string') {
  responseMessage = actualAiResponse;
  console.log('Using entire response as string:', responseMessage);
}

// Check for nested structures
if (!responseMessage && actualAiResponse) {
  // Check for common nested patterns
  if (actualAiResponse.choices && actualAiResponse.choices[0]?.message?.content) {
    responseMessage = actualAiResponse.choices[0].message.content;
    console.log('Found OpenAI-style response:', responseMessage);
  } else if (actualAiResponse.generations && actualAiResponse.generations[0]?.text) {
    responseMessage = actualAiResponse.generations[0].text;
    console.log('Found generations-style response:', responseMessage);
  } else if (actualAiResponse.completion) {
    responseMessage = actualAiResponse.completion;
    console.log('Found completion field:', responseMessage);
  }
}

// Last resort - try to find any string value in the object
if (!responseMessage && actualAiResponse && typeof actualAiResponse === 'object') {
  console.log('=== SEARCHING FOR ANY STRING VALUES ===');
  const findStringValues = (obj, path = '') => {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      if (typeof value === 'string' && value.length > 10) {
        console.log(`Found potential response at ${currentPath}:`, value.substring(0, 100) + '...');
        return value;
      } else if (typeof value === 'object' && value !== null) {
        const found = findStringValues(value, currentPath);
        if (found) return found;
      }
    }
    return null;
  };
  
  const foundString = findStringValues(actualAiResponse);
  if (foundString) {
    responseMessage = foundString;
  }
}

// If still no response, provide detailed error
if (!responseMessage) {
  console.log('=== NO RESPONSE FOUND - FULL DEBUG ===');
  console.log('Available data structure:', JSON.stringify(actualAiResponse, null, 2));
  responseMessage = `📋 **Calendar Assistant Debug Info**

I received your request but couldn't extract the response properly.

**Available data keys:** ${Object.keys(actualAiResponse || {}).join(', ')}

**Request:** Show me my events for next week

**Debug:** The AI Agent ran but the response format is unexpected. Please check the n8n logs for the full output structure.

This appears to be a formatting issue in the workflow. Please contact your administrator to review the AI Agent output format.`;
}

// Get original context from earlier in the workflow
const parseNode = $('Parse Chat Message').first().json;
const originalMessage = parseNode?.originalMessage || parseNode?.chatInput || parseNode?.input || '';
const userId = parseNode?.userId || 'unknown';
const sessionId = parseNode?.sessionId || 'unknown';

console.log('=== CONTEXT DEBUG ===');
console.log('Original Message:', originalMessage);
console.log('User ID:', userId);
console.log('Session ID:', sessionId);

// Clean up the response message
if (responseMessage && typeof responseMessage === 'string') {
  // Remove any extra whitespace and ensure it's properly formatted
  responseMessage = responseMessage.trim();
  
  // If it's a very long response, ensure it's reasonable for chat
  if (responseMessage.length > 2000) {
    responseMessage = responseMessage.substring(0, 1900) + '...\n\n*Response truncated for chat display*';
  }
}

// Format the response
const formattedResponse = {
  message: responseMessage,
  timestamp: new Date().toISOString(),
  userId: 'calendar-assistant',
  type: 'calendar_response',
  metadata: {
    originalMessage: originalMessage,
    sessionId: sessionId,
    platform: 'n8n-calendar-assistant',
    responseFound: !!responseMessage,
    debugTimestamp: new Date().toISOString()
  }
};

console.log('=== FORMATTED RESPONSE ===');
console.log('Final Response:', JSON.stringify(formattedResponse, null, 2));
console.log('Response message length:', responseMessage?.length || 0);

return formattedResponse; 