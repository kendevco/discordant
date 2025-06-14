// ===== IMAGE PROCESSING ROUTER NODE =====
// Add this as a new JavaScript Code node after your Input Processor
// Node Name: "Image Processing Router"

const startTime = Date.now();
console.log('=== IMAGE PROCESSING ROUTER STARTING ===');

try {
  // Extract Discord message data (works with your existing Input Processor output)
  const inputData = $input.first().json;
  const messageContent = inputData.content || inputData.message || '';
  const attachments = inputData.attachments || [];
  const imageUrl = inputData.imageUrl || inputData.image_url || '';
  
  console.log(`[IMAGE_ROUTER] Processing message: "${messageContent.substring(0, 100)}..."`);
  console.log(`[IMAGE_ROUTER] Attachments: ${attachments.length}, Image URL: ${imageUrl ? 'present' : 'none'}`);
  
  // Determine processing type based on content and attachments
  const hasImageAttachment = imageUrl || attachments.length > 0;
  
  // Extract image URL from attachments if available
  let actualImageUrl = imageUrl;
  if (!actualImageUrl && attachments.length > 0) {
    // Find first image attachment
    const imageAttachment = attachments.find(att => 
      att.url && (
        att.url.includes('.jpg') || 
        att.url.includes('.jpeg') || 
        att.url.includes('.png') || 
        att.url.includes('.gif') || 
        att.url.includes('.webp') ||
        att.contentType?.startsWith('image/')
      )
    );
    actualImageUrl = imageAttachment?.url || '';
  }
  
  // Image analysis keywords and patterns
  const analysisKeywords = [
    'analyze', 'what is', 'what\'s in', 'describe', 'explain', 'read', 'ocr',
    'extract text', 'what does', 'tell me about', 'identify', 'examine',
    'chart', 'graph', 'document', 'screenshot', 'business intelligence'
  ];
  
  // Image generation keywords and patterns
  const generationKeywords = [
    'generate', 'create', 'make', 'draw', 'design', 'image of', 'picture of',
    'illustration', 'artwork', 'logo', 'banner', 'poster', 'marketing',
    'social media', 'advertisement', 'mockup'
  ];
  
  // Check for explicit image processing requests
  const contentLower = messageContent.toLowerCase();
  const hasAnalysisKeyword = analysisKeywords.some(keyword => contentLower.includes(keyword));
  const hasGenerationKeyword = generationKeywords.some(keyword => contentLower.includes(keyword));
  
  let processingType = 'standard_ai'; // Default to your existing AI workflow
  let processingData = {};
  
  // Decision logic
  if (hasImageAttachment && (hasAnalysisKeyword || !hasGenerationKeyword)) {
    // Has image and analysis keywords OR has image but no generation keywords
    processingType = 'image_analysis';
    
    // Determine analysis type
    let analysisType = 'general';
    if (contentLower.includes('business') || contentLower.includes('intelligence')) {
      analysisType = 'business_intelligence';
    } else if (contentLower.includes('document') || contentLower.includes('text') || contentLower.includes('ocr')) {
      analysisType = 'document_analysis';
    } else if (contentLower.includes('chart') || contentLower.includes('graph') || contentLower.includes('data')) {
      analysisType = 'chart_data';
    }
    
    processingData = {
      image_url: actualImageUrl,
      analysis_type: analysisType,
      question: messageContent,
      original_message: messageContent
    };
    
  } else if (hasGenerationKeyword || (!hasImageAttachment && (
    contentLower.includes('image') || 
    contentLower.includes('picture') || 
    contentLower.includes('visual') ||
    contentLower.includes('photo')
  ))) {
    // Has generation keywords OR mentions images without attachment
    processingType = 'image_generation';
    
    // Extract generation parameters from message
    let imageStyle = 'vivid';
    let imageSize = '1024x1024';
    let quality = 'hd';
    
    if (contentLower.includes('natural style') || contentLower.includes('realistic')) {
      imageStyle = 'natural';
    }
    
    if (contentLower.includes('portrait') || contentLower.includes('vertical')) {
      imageSize = '1024x1792';
    } else if (contentLower.includes('landscape') || contentLower.includes('horizontal')) {
      imageSize = '1792x1024';
    }
    
    if (contentLower.includes('standard quality') || contentLower.includes('basic')) {
      quality = 'standard';
    }
    
    // Clean prompt by removing processing keywords
    let cleanPrompt = messageContent;
    const removePatterns = [
      /generate an? image of /gi,
      /create an? image of /gi,
      /make an? image of /gi,
      /draw an? image of /gi,
      /please /gi,
      /can you /gi,
      /could you /gi
    ];
    
    removePatterns.forEach(pattern => {
      cleanPrompt = cleanPrompt.replace(pattern, '');
    });
    
    processingData = {
      prompt: cleanPrompt.trim(),
      style: imageStyle,
      size: imageSize,
      quality: quality,
      original_message: messageContent
    };
  }
  
  const processingTime = Date.now() - startTime;
  console.log(`[IMAGE_ROUTER] Decision: ${processingType} (${processingTime}ms)`);
  
  // Return routing decision with all original data preserved
  const result = {
    ...inputData, // Preserve ALL original webhook data
    processing_type: processingType,
    processing_data: processingData,
    routing_info: {
      has_image_attachment: hasImageAttachment,
      image_url: actualImageUrl,
      has_analysis_keywords: hasAnalysisKeyword,
      has_generation_keywords: hasGenerationKeyword,
      message_content: messageContent,
      processing_time: processingTime,
      timestamp: new Date().toISOString()
    }
  };
  
  console.log(`[IMAGE_ROUTER] Result: ${processingType}`);
  
  return result;
  
} catch (error) {
  console.error('[IMAGE_ROUTER] Error:', error.message);
  
  return {
    ...inputData, // Preserve original data even on error
    processing_type: 'standard_ai', // Default to existing AI on error
    processing_data: {
      error: error.message,
      original_message: inputData.content || inputData.message || ''
    },
    routing_info: {
      error: true,
      timestamp: new Date().toISOString()
    }
  };
} 