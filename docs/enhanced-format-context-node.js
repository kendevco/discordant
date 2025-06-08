// Enhanced Format Context with conversation intelligence and performance optimization
console.log('=== ENHANCED FORMAT CONTEXT v2.0 ===');
const startTime = Date.now();

try {
  // Get channel history and input data with enhanced error handling
  const channelHistory = $('Load Channel History').all();
  const inputData = $('Enhanced Input Processor').first().json;
  
  console.log('=== CONTEXT ANALYSIS ===');
  console.log('📊 Channel history items:', channelHistory?.length || 0);
  console.log('📝 Input data keys:', Object.keys(inputData || {}));
  console.log('👤 Current user:', inputData?.userId || 'unknown');
  console.log('📍 Channel:', inputData?.channelId || 'unknown');
  console.log('⏱️ Processing time so far:', Date.now() - startTime, 'ms');
  
  // Enhanced cold start detection
  const isColdStart = !channelHistory || channelHistory.length === 0;
  const isTestMode = inputData?.isTestMode || false;
  
  if (isColdStart && !isTestMode) {
    console.log('🚨 COLD START DETECTED for channel:', inputData?.channelId);
    console.log('This might be due to:');
    console.log('• First message in channel');
    console.log('• Database connection delay');
    console.log('• Channel history loading timeout');
  }
  
  // Enhanced conversation processing with intelligence
  let conversationHistory = 'No previous conversation in this channel';
  let conversationMetadata = {
    totalMessages: 0,
    uniqueUsers: new Set(),
    recentActivity: false,
    averageMessageLength: 0,
    topicKeywords: [],
    lastMessageTime: null,
    conversationFlow: 'new'
  };
  
  try {
    if (channelHistory && channelHistory.length > 0) {
      console.log('=== CONVERSATION PROCESSING ===');
      
      // Filter and validate messages with enhanced criteria
      const validMessages = channelHistory
        .filter(item => {
          const isValid = item?.json && 
                         item.json.content && 
                         typeof item.json.content === 'string' && 
                         item.json.content.trim().length > 0 &&
                         item.json.content.length < 4000 && // Prevent memory issues
                         !item.json.content.startsWith('[DELETED]'); // Skip deleted messages
          
          if (!isValid && item?.json?.content) {
            console.log('⚠️ Filtered invalid message:', item.json.content.substring(0, 50));
          }
          
          return isValid;
        })
        .slice(-50); // Limit to last 50 messages for performance
      
      console.log('✅ Valid messages found:', validMessages.length);
      
      if (validMessages.length > 0) {
        // Enhanced conversation analysis
        const messageTexts = [];
        const userIds = new Set();
        let totalLength = 0;
        let lastMessageTimestamp = null;
        
        // Process messages in chronological order
        const sortedMessages = validMessages
          .sort((a, b) => {
            const timeA = new Date(a.json.created_at || a.json.timestamp || 0).getTime();
            const timeB = new Date(b.json.created_at || b.json.timestamp || 0).getTime();
            return timeA - timeB;
          })
          .slice(-20); // Keep last 20 messages for context
        
        // Build conversation history with enhanced formatting
        const conversationLines = sortedMessages.map((item, index) => {
          const content = item.json.content.trim();
          const userId = item.json.user_id || item.json.userId || 'unknown';
          const userName = item.json.user_name || item.json.userName || userId;
          const timestamp = item.json.created_at || item.json.timestamp;
          
          // Collect metadata
          messageTexts.push(content);
          userIds.add(userId);
          totalLength += content.length;
          
          if (timestamp) {
            lastMessageTimestamp = Math.max(lastMessageTimestamp || 0, new Date(timestamp).getTime());
          }
          
          // Enhanced message formatting with context
          const isCurrentUser = userId === inputData?.userId;
          const userPrefix = isCurrentUser ? '👤 You' : `👥 ${userName}`;
          const timePrefix = timestamp ? ` (${new Date(timestamp).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            timeZone: 'America/New_York'
          })})` : '';
          
          // Add message indicators
          let messagePrefix = '';
          if (index === sortedMessages.length - 1) {
            messagePrefix = '🔥 [LATEST] ';
          } else if (index === 0 && sortedMessages.length > 5) {
            messagePrefix = '📜 [EARLIER] ';
          }
          
          return `${messagePrefix}${userPrefix}${timePrefix}: ${content}`;
        });
        
        conversationHistory = conversationLines.join('\n\n');
        
        // Calculate conversation intelligence
        conversationMetadata = {
          totalMessages: validMessages.length,
          uniqueUsers: userIds,
          recentActivity: lastMessageTimestamp && (Date.now() - lastMessageTimestamp) < 300000, // 5 minutes
          averageMessageLength: Math.round(totalLength / messageTexts.length),
          topicKeywords: extractTopicKeywords(messageTexts),
          lastMessageTime: lastMessageTimestamp ? new Date(lastMessageTimestamp).toISOString() : null,
          conversationFlow: determineConversationFlow(messageTexts, inputData?.input),
          hasCurrentUser: userIds.has(inputData?.userId),
          messageVelocity: calculateMessageVelocity(sortedMessages),
          sentimentTrend: analyzeSentimentTrend(messageTexts.slice(-5)) // Last 5 messages
        };
        
        console.log('📊 Conversation Analysis:');
        console.log('• Total messages:', conversationMetadata.totalMessages);
        console.log('• Unique users:', conversationMetadata.uniqueUsers.size);
        console.log('• Recent activity:', conversationMetadata.recentActivity);
        console.log('• Average length:', conversationMetadata.averageMessageLength);
        console.log('• Conversation flow:', conversationMetadata.conversationFlow);
        console.log('• Top keywords:', conversationMetadata.topicKeywords.slice(0, 3));
        
      } else {
        console.log('⚠️ No valid messages found after filtering');
        conversationHistory = 'No valid messages found in recent history';
      }
    }
  } catch (historyError) {
    console.error('❌ Error processing conversation history:', historyError.message);
    console.error('Stack:', historyError.stack);
    conversationHistory = 'Conversation history temporarily unavailable (processing error)';
  }
  
  // Enhanced timestamp and context
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toLocaleTimeString('en-US', { 
    timeZone: 'America/New_York',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  const messageCount = conversationMetadata.totalMessages;
  const processingTime = Date.now() - startTime;
  
  // Build enhanced result with conversation intelligence
  const result = {
    ...inputData,
    
    // Core context data
    conversationHistory,
    currentDate,
    currentTime,
    messageCount,
    
    // Enhanced metadata
    processingTime,
    coldStartRecovery: isColdStart,
    conversationIntelligence: {
      totalMessages: conversationMetadata.totalMessages,
      uniqueUsers: conversationMetadata.uniqueUsers.size,
      recentActivity: conversationMetadata.recentActivity,
      averageMessageLength: conversationMetadata.averageMessageLength,
      topicKeywords: conversationMetadata.topicKeywords,
      lastMessageTime: conversationMetadata.lastMessageTime,
      conversationFlow: conversationMetadata.conversationFlow,
      hasCurrentUser: conversationMetadata.hasCurrentUser,
      messageVelocity: conversationMetadata.messageVelocity,
      sentimentTrend: conversationMetadata.sentimentTrend
    },
    
    // Context quality indicators
    contextQuality: {
      hasHistory: messageCount > 0,
      historyDepth: messageCount > 10 ? 'deep' : messageCount > 3 ? 'moderate' : 'shallow',
      isFirstMessage: messageCount === 0,
      isOngoing: conversationMetadata.recentActivity,
      qualityScore: calculateContextQuality(conversationMetadata, processingTime)
    },
    
    // Processing metadata
    metadata: {
      version: '2.0',
      processingTimeMs: processingTime,
      memoryEfficient: true,
      intelligenceEnabled: true,
      errorRecovery: 'active'
    }
  };
  
  console.log('=== FORMAT CONTEXT SUCCESS ===');
  console.log('✅ Processing completed successfully');
  console.log('📊 Final message count:', result.messageCount);
  console.log('📍 Channel:', inputData?.channelId);
  console.log('📝 Conversation history length:', result.conversationHistory.length);
  console.log('🧠 Context quality score:', result.contextQuality.qualityScore);
  console.log('⏱️ Total processing time:', result.processingTime, 'ms');
  console.log('🔥 Recent activity:', result.conversationIntelligence.recentActivity);
  
  return result;
  
} catch (error) {
  console.error('=== FORMAT CONTEXT ERROR ===');
  console.error('❌ Error type:', error.name);
  console.error('❌ Error message:', error.message);
  console.error('❌ Error stack:', error.stack);
  console.error('⏱️ Processing time before error:', Date.now() - startTime, 'ms');
  
  // Enhanced error recovery with context preservation
  const inputData = $('Enhanced Input Processor').first()?.json || {};
  const processingTime = Date.now() - startTime;
  
  return {
    ...inputData,
    
    // Fallback context data
    conversationHistory: 'Channel history temporarily unavailable (system error)',
    currentDate: new Date().toISOString().split('T')[0],
    currentTime: new Date().toLocaleTimeString('en-US', { 
      timeZone: 'America/New_York',
      hour12: true 
    }),
    messageCount: 0,
    
    // Error details with recovery info
    errorOccurred: true,
    errorMessage: error.message,
    errorType: error.name,
    errorCode: 'FORMAT_CONTEXT_FAILURE',
    processingTime,
    coldStartIssue: true,
    
    // Minimal intelligence fallback
    conversationIntelligence: {
      totalMessages: 0,
      uniqueUsers: 0,
      recentActivity: false,
      conversationFlow: 'error',
      errorRecovery: true
    },
    
    contextQuality: {
      hasHistory: false,
      historyDepth: 'none',
      isFirstMessage: true,
      isOngoing: false,
      qualityScore: 0.1 // Minimal score for error state
    },
    
    metadata: {
      version: '2.0',
      processingTimeMs: processingTime,
      errorRecovery: 'active',
      fallbackMode: true
    },
    
    // Recovery suggestions
    recoverySuggestions: [
      'Check database connection',
      'Verify channel history loading',
      'Review node execution order',
      'Check memory usage and optimization'
    ]
  };
}

// Helper functions for conversation intelligence
function extractTopicKeywords(messages) {
  if (!messages || messages.length === 0) return [];
  
  const text = messages.join(' ').toLowerCase();
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'can', 'may', 'might', 'must', 'shall', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them']);
  
  const words = text.match(/\b\w{3,}\b/g) || [];
  const wordCounts = {};
  
  words.forEach(word => {
    if (!commonWords.has(word)) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });
  
  return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

function determineConversationFlow(messages, currentInput) {
  if (!messages || messages.length === 0) return 'new';
  if (messages.length === 1) return 'starting';
  
  const recentMessages = messages.slice(-3).join(' ').toLowerCase();
  const currentLower = (currentInput || '').toLowerCase();
  
  // Check for question patterns
  if (currentLower.includes('?') || currentLower.startsWith('what') || currentLower.startsWith('how') || currentLower.startsWith('why')) {
    return 'inquiry';
  }
  
  // Check for response patterns
  if (recentMessages.includes('?') && !currentLower.includes('?')) {
    return 'response';
  }
  
  // Check for continuation patterns
  if (currentLower.includes('also') || currentLower.includes('additionally') || currentLower.includes('furthermore')) {
    return 'continuation';
  }
  
  return 'ongoing';
}

function calculateMessageVelocity(messages) {
  if (!messages || messages.length < 2) return 0;
  
  const timestamps = messages
    .map(msg => new Date(msg.json.created_at || msg.json.timestamp || 0).getTime())
    .filter(ts => ts > 0)
    .sort((a, b) => a - b);
  
  if (timestamps.length < 2) return 0;
  
  const timeSpan = timestamps[timestamps.length - 1] - timestamps[0];
  const messagesPerMinute = (timestamps.length / (timeSpan / 1000 / 60));
  
  return Math.round(messagesPerMinute * 100) / 100;
}

function analyzeSentimentTrend(recentMessages) {
  if (!recentMessages || recentMessages.length === 0) return 'neutral';
  
  const positiveWords = ['good', 'great', 'awesome', 'excellent', 'amazing', 'perfect', 'love', 'like', 'thanks', 'thank'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'problem', 'issue', 'error', 'broken', 'wrong'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  recentMessages.forEach(message => {
    const lowerMessage = message.toLowerCase();
    positiveWords.forEach(word => {
      if (lowerMessage.includes(word)) positiveCount++;
    });
    negativeWords.forEach(word => {
      if (lowerMessage.includes(word)) negativeCount++;
    });
  });
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function calculateContextQuality(metadata, processingTime) {
  let score = 0.5; // Base score
  
  // Message count contribution (0-0.3)
  if (metadata.totalMessages > 20) score += 0.3;
  else if (metadata.totalMessages > 10) score += 0.2;
  else if (metadata.totalMessages > 5) score += 0.1;
  
  // User diversity contribution (0-0.2)
  if (metadata.uniqueUsers.size > 5) score += 0.2;
  else if (metadata.uniqueUsers.size > 2) score += 0.1;
  
  // Recent activity contribution (0-0.2)
  if (metadata.recentActivity) score += 0.2;
  
  // Processing efficiency (0-0.1)
  if (processingTime < 1000) score += 0.1;
  else if (processingTime > 5000) score -= 0.1;
  
  // Topic richness (0-0.1)
  if (metadata.topicKeywords && metadata.topicKeywords.length > 5) score += 0.1;
  
  return Math.min(1.0, Math.max(0.1, Math.round(score * 100) / 100));
} 