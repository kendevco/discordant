// ===== IMAGE GENERATION TOOL NODE =====
// Add this as a new JavaScript Code node
// Node Name: "Image Generation Tool"
// Connect: From IF node when processing_type === 'image_generation'

const startTime = Date.now();
console.log('=== IMAGE GENERATION TOOL STARTING ===');

try {
  // Extract input parameters
  const inputData = $input.first().json;
  const processingData = inputData.processing_data || {};
  const originalPrompt = processingData.prompt || inputData.content || '';
  const imageStyle = processingData.style || 'vivid';
  const imageSize = processingData.size || '1024x1024';
  const quality = processingData.quality || 'hd';
  
  console.log(`[IMAGE_GEN] Generating image with prompt: ${originalPrompt.substring(0, 100)}...`);
  console.log(`[IMAGE_GEN] Style: ${imageStyle}, Size: ${imageSize}, Quality: ${quality}`);
  
  // Validate prompt
  if (!originalPrompt || originalPrompt.trim().length === 0) {
    throw new Error('Image generation prompt is required');
  }
  
  // OpenAI API Configuration
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your-openai-api-key';
  
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-openai-api-key') {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }
  
  // Enhanced prompt engineering for business/professional contexts
  const enhancePrompt = (originalPrompt) => {
    // Check if it's already detailed enough
    if (originalPrompt.length > 200) {
      return originalPrompt;
    }
    
    // Add professional context and quality markers
    const enhancedPrompt = `${originalPrompt}

Professional high-quality image with excellent composition, proper lighting, and crisp detail. 
Corporate-appropriate style with modern aesthetics. 
Ensure text is clearly readable if any text elements are included.
Maintain consistent branding colors and professional appearance suitable for business use.`;
    
    return enhancedPrompt;
  };
  
  const finalPrompt = enhancePrompt(originalPrompt);
  
  // Call DALL-E 3 API
  console.log('[IMAGE_GEN] Calling DALL-E 3 API...');
  
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'dall-e-3', // Latest DALL-E model
      prompt: finalPrompt,
      n: 1, // DALL-E 3 supports only 1 image at a time
      size: imageSize, // 1024x1024, 1024x1792, or 1792x1024
      quality: quality, // 'standard' or 'hd'
      style: imageStyle, // 'vivid' or 'natural'
      response_format: 'url' // Get URL directly
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
  }
  
  const imageResult = await response.json();
  const imageUrl = imageResult.data[0].url;
  const revisedPrompt = imageResult.data[0].revised_prompt || finalPrompt;
  
  console.log('[IMAGE_GEN] Image generated:', imageUrl);
  
  const processingTime = Date.now() - startTime;
  console.log(`[IMAGE_GEN] Generation completed in ${processingTime}ms`);
  
  // Format business-focused response with image URL
  const businessResponse = `🎨 **AI Image Generation Complete** (${processingTime}ms)

**🎯 Original Prompt**: ${originalPrompt}
**🤖 AI Enhanced Prompt**: ${revisedPrompt}
**📐 Specifications**: ${imageSize} • ${quality.toUpperCase()} Quality • ${imageStyle} Style
**⏱️ Processing Time**: ${processingTime}ms

**🔗 Generated Image**: ${imageUrl}
**✅ Status**: Successfully generated with DALL-E 3

**💼 Business Intelligence Summary**:
• **AI Model**: DALL-E 3 (Latest OpenAI Image Generation)
• **Quality**: Professional-grade ${quality} resolution
• **Business Use**: Corporate presentations, marketing materials, social media
• **Compliance**: Generated content follows OpenAI usage policies
• **Accessibility**: Public URL available for immediate use

**🚀 Platform Capabilities Demonstrated**:
• Advanced AI image generation with DALL-E 3
• Intelligent prompt enhancement for professional results
• High-resolution output suitable for business use
• Real-time generation and delivery system
• Enterprise-grade quality and reliability`;

  // Return structured response with original data preserved
  return {
    ...inputData, // Preserve all original webhook data
    content: businessResponse,
    imageUrl: imageUrl, // Add generated image URL
    generation_result: {
      success: true,
      originalPrompt: originalPrompt,
      revisedPrompt: revisedPrompt,
      imageSize: imageSize,
      quality: quality,
      style: imageStyle,
      processingTime: processingTime,
      imageUrl: imageUrl,
      timestamp: new Date().toISOString(),
      tool: 'image_generation',
      model: 'dall-e-3'
    }
  };
  
} catch (error) {
  console.error('[IMAGE_GEN] Error:', error.message);
  
  const errorResponse = `🚨 **Image Generation Error**

**Error**: ${error.message}

**Troubleshooting Steps**:
• Verify OpenAI API key is configured correctly
• Check prompt meets OpenAI content policy guidelines
• Ensure sufficient API credits are available
• Confirm image size is supported (1024x1024, 1024x1792, 1792x1024)
• Verify network connectivity to OpenAI API

**DALL-E 3 Capabilities**:
• Professional-quality image generation
• Enhanced text rendering in images
• Multiple aspect ratios and resolutions
• Natural and vivid style options
• Improved prompt understanding and adherence

**Business Applications**:
• Marketing and advertising visuals
• Social media content creation
• Presentation graphics and illustrations
• Product mockups and concepts
• Brand asset generation

**Business Continuity**: Consider alternative image sources or manual creation for critical business needs.`;

  return {
    ...inputData, // Preserve original data even on error
    content: errorResponse,
    generation_result: {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      tool: 'image_generation'
    }
  };
} 