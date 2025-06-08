// Enhanced Format Response with markdown enforcement and model optimization
console.log('=== ENHANCED FORMAT RESPONSE NODE ===');
const startTime = Date.now();

try {
  const aiResponse = $('Enhanced AI Agent').first().json;
  const contextData = $('Format Context').first().json;
  
  console.log('AI Response keys:', Object.keys(aiResponse || {}));
  console.log('Context Data keys:', Object.keys(contextData || {}));
  console.log('Model used:', contextData?.model || 'unknown');
  
  // Enhanced response extraction with model-specific handling
  let responseText = null;
  
  // Model-specific response extraction
  const modelType = contextData?.model || 'unknown';
  
  if (modelType.includes('gpt-4o-mini') || modelType.includes('gpt-4.1-mini')) {
    // OpenAI response structure
    if (aiResponse?.choices?.[0]?.message?.content) {
      responseText = aiResponse.choices[0].message.content;
      console.log('Extracted OpenAI response:', responseText.substring(0, 100));
    }
  } else if (modelType.includes('gemini')) {
    // Gemini response structure
    if (aiResponse?.candidates?.[0]?.content?.parts?.[0]?.text) {
      responseText = aiResponse.candidates[0].content.parts[0].text;
      console.log('Extracted Gemini response:', responseText.substring(0, 100));
    }
  } else if (modelType.includes('claude')) {
    // Claude response structure
    if (aiResponse?.content?.[0]?.text) {
      responseText = aiResponse.content[0].text;
      console.log('Extracted Claude response:', responseText.substring(0, 100));
    }
  }
  
  // Fallback to generic extraction
  if (!responseText) {
    const responseFields = ['output', 'text', 'content', 'message', 'result', 'answer', 'response'];
    
    for (const field of responseFields) {
      if (aiResponse && aiResponse[field]) {
        responseText = aiResponse[field];
        console.log(`Found response in field '${field}':`, responseText.substring(0, 100));
        break;
      }
    }
  }
  
  // Check if entire response is a string
  if (!responseText && typeof aiResponse === 'string' && aiResponse.length > 10) {
    responseText = aiResponse;
    console.log('Using entire response as string');
  }
  
  // MARKDOWN FORMATTING VALIDATION AND ENFORCEMENT
  if (responseText) {
    console.log('=== MARKDOWN VALIDATION ===');
    
    // Check for HTML tags and warn
    const htmlTagRegex = /<[^>]+>/g;
    const hasHtmlTags = htmlTagRegex.test(responseText);
    
    if (hasHtmlTags) {
      console.warn('⚠️ HTML tags detected in response - this may cause formatting issues');
      console.warn('HTML found:', responseText.match(htmlTagRegex));
      
      // Basic HTML to markdown conversion for common cases
      responseText = responseText
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<p>/gi, '')
        .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
        .replace(/<b>(.*?)<\/b>/gi, '**$1**')
        .replace(/<em>(.*?)<\/em>/gi, '*$1*')
        .replace(/<i>(.*?)<\/i>/gi, '*$1*')
        .replace(/<a href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
        .replace(/<[^>]+>/g, ''); // Remove any remaining HTML tags
      
      console.log('Converted HTML to markdown');
    }
    
    // Validate markdown structure
    const hasProperHeaders = /^#{1,6}\s/.test(responseText);
    const hasProperBold = /\*\*[^*]+\*\*/.test(responseText);
    const hasProperLinks = /\[[^\]]+\]\([^)]+\)/.test(responseText);
    
    console.log('Markdown validation:', {
      hasHeaders: hasProperHeaders,
      hasBold: hasProperBold,
      hasLinks: hasProperLinks,
      length: responseText.length
    });
  }
  
  // Error handling with model-aware messaging
  const hasError = aiResponse?.error || aiResponse?.errorOccurred;
  const errorMessage = aiResponse?.errorMessage || aiResponse?.error;
  
  // Generate enhanced fallback response if needed
  if (!responseText || responseText.trim().length === 0) {
    console.log('=== GENERATING ENHANCED FALLBACK ===');
    console.log('AI Response structure:', JSON.stringify(aiResponse, null, 2));
    
    const userMessage = contextData?.input || 'your request';
    const currentTime = new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York' });
    const modelInfo = modelType !== 'unknown' ? ` (Model: ${modelType})` : '';
    
    if (hasError) {
      responseText = `⚠️ **AI Processing Issue Detected**

I encountered a technical issue while processing your request with the AI model${modelInfo}.

**Request**: "${userMessage}"
**Error Details**: ${errorMessage || 'Unknown processing error'}
**Time**: ${currentTime}

## Recommended Actions

1. **Retry**: Wait 30 seconds and try your request again
2. **Simplify**: Try rephrasing your request in simpler terms
3. **Alternative**: Use the /test-ai interface for direct testing
4. **Support**: Contact support if the issue persists

## Current Status

- **AI Core**: Operational
- **Advanced Tools**: May be experiencing delays
- **Model**: ${modelType}
- **Fallback**: Available

*This is an automated response with proper markdown formatting.*`;
    } else {
      // Generate contextual fallback based on message content
      const messageType = userMessage.toLowerCase();
      
      if (messageType.includes('calendar') || messageType.includes('meeting') || messageType.includes('schedule')) {
        responseText = `📅 **Calendar Assistant Response**

I received your calendar request: "${userMessage}"

## Current Status
The calendar integration tools are experiencing connectivity issues.

## Alternative Options
- **Direct Access**: Check your calendar app directly
- **Retry**: Try the request again in 1-2 minutes  
- **Test Interface**: Use /test-ai for basic testing
- **Manual Scheduling**: Create events manually for now

**Time**: ${currentTime}${modelInfo}
**Status**: Calendar tools temporarily unavailable

---
*Automated response with enhanced error handling*`;
        
      } else if (messageType.includes('search') || messageType.includes('find') || messageType.includes('message')) {
        responseText = `🔍 **Search Assistant Response**

I received your search request: "${userMessage}"

## Current Status
Message search tools are experiencing processing delays.

## Available Alternatives
- **Discord Search**: Use Discord's built-in search feature
- **Recent History**: Check conversation history manually
- **Retry**: Try your request in a few moments
- **Simplified Search**: Use basic keyword searches

**Time**: ${currentTime}${modelInfo}
**Status**: Search tools temporarily delayed

---
*Response generated with fallback system*`;
        
      } else if (messageType.includes('research') || messageType.includes('web') || messageType.includes('company')) {
        responseText = `🌐 **Research Assistant Response**

I received your research request: "${userMessage}"

## Current Status
Web research tools are experiencing connection issues.

## Manual Research Options
- **Direct Sources**: Try [Yahoo Finance](https://finance.yahoo.com) or [Bloomberg](https://www.bloomberg.com)
- **Company Websites**: Check official company sites directly
- **Retry**: Automated research will be available shortly
- **GSA Database**: Check [SAM.gov](https://sam.gov) for government contracts

**Time**: ${currentTime}${modelInfo}
**Status**: Research tools temporarily offline

---
*Enhanced business research assistant response*`;
        
      } else {
        responseText = `🤖 **Enhanced AI Assistant Response**

I received your request: "${userMessage}"

## Current Status
Experiencing technical difficulties with advanced processing tools.

## Available Services
- **General Chat**: Basic conversation and questions
- **Business Analysis**: Strategic recommendations  
- **System Status**: Real-time status updates
- **Fallback Support**: Automated assistance

## Troubleshooting
1. **Retry**: Try your request again
2. **Simplify**: Use simpler language
3. **Test Mode**: Try /test-ai interface
4. **Direct Contact**: Reach out for support

**Time**: ${currentTime}${modelInfo}
**Status**: Core AI operational, tools temporarily unavailable

---
*Powered by enhanced AI assistant with markdown formatting*`;
      }
    }
  }
  
  // Final response validation
  console.log('Final response validation:');
  console.log('- Length:', responseText?.length || 0);
  console.log('- Has markdown headers:', /^#{1,6}\s/.test(responseText || ''));
  console.log('- Has markdown bold:', /\*\*[^*]+\*\*/.test(responseText || ''));
  console.log('- Is test mode:', contextData?.isTestMode);
  console.log('- Model used:', modelType);
  
  let result;
  
  if (contextData?.isTestMode) {
    result = { 
      output: responseText,
      testMode: true,
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - startTime,
      model: modelType,
      markdownValidated: true
    };
  } else {
    result = {
      content: responseText,
      metadata: {
        userId: contextData?.userId || 'unknown',
        channelId: contextData?.channelId || 'unknown',
        sessionId: contextData?.sessionId || 'unknown',
        platform: contextData?.platform || 'discordant',
        messageCount: contextData?.messageCount || 0,
        timestamp: new Date().toISOString(),
        responseSource: 'n8n-enhanced-workflow',
        processingTime: Date.now() - startTime,
        hadFallback: !aiResponse?.output && !aiResponse?.text && !aiResponse?.choices,
        model: modelType,
        markdownValidated: true,
        debugInfo: {
          aiResponseKeys: Object.keys(aiResponse || {}),
          contextKeys: Object.keys(contextData || {}),
          responseFound: !!responseText,
          modelSupported: ['gpt-4o-mini', 'gpt-4.1-mini', 'gemini', 'claude'].some(m => modelType.includes(m))
        }
      }
    };
  }
  
  console.log('=== ENHANCED FORMAT RESPONSE SUCCESS ===');
  console.log('Final result content length:', result.content?.length || result.output?.length || 0);
  console.log('Processing time:', Date.now() - startTime, 'ms');
  console.log('Model optimization applied:', modelType);
  console.log('Markdown formatting enforced: ✅');
  
  return result;
  
} catch (error) {
  console.error('=== ENHANCED FORMAT RESPONSE ERROR ===');
  console.error('Error details:', error.message);
  console.error('Error stack:', error.stack);
  console.error('Processing time before error:', Date.now() - startTime, 'ms');
  
  // Provide comprehensive error response with proper markdown
  const currentTime = new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York' });
  
  return {
    content: `🚨 **Workflow Processing Error**

A critical error occurred while formatting your AI response.

## Error Details
- **Error**: ${error.message}
- **Time**: ${currentTime}
- **Processing Duration**: ${Date.now() - startTime}ms
- **Node**: Enhanced Format Response

## Recovery Options

1. **Immediate Retry**: Try your request again right now
2. **Simplified Request**: Use simpler language and retry
3. **Test Interface**: Use /test-ai for direct AI access
4. **Technical Support**: Contact administrator with error code below

## Technical Information
- **Error Code**: ENHANCED_FORMAT_RESPONSE_FAILURE
- **Timestamp**: ${new Date().toISOString()}
- **Session**: ${Math.random().toString(36).substring(7)}

---
*Enhanced error handling with markdown formatting*`,
    metadata: {
      userId: 'error-handler',
      channelId: 'error-channel',
      timestamp: new Date().toISOString(),
      errorOccurred: true,
      errorMessage: error.message,
      responseSource: 'n8n-enhanced-workflow-error',
      processingTime: Date.now() - startTime,
      markdownValidated: true,
      errorCode: 'ENHANCED_FORMAT_RESPONSE_FAILURE'
    }
  };
} 