// Advanced Image Generation Tool with DALL-E 3 and UploadThing Integration
// Based on OpenAI Image Generation API and the n8n transcript

const startTime = Date.now();
console.log('=== IMAGE GENERATION TOOL STARTING ===');

try {
  // Extract input parameters
  const inputData = $input.first().json;
  const originalPrompt = inputData.prompt || inputData.description || '';
  const imageStyle = inputData.style || 'vivid';
  const imageSize = inputData.size || '1024x1024';
  const quality = inputData.quality || 'hd';
  
  console.log(`[IMAGE_GEN] Generating image with prompt: ${originalPrompt.substring(0, 100)}...`);
  console.log(`[IMAGE_GEN] Style: ${imageStyle}, Size: ${imageSize}, Quality: ${quality}`);
  
  // Validate prompt
  if (!originalPrompt || originalPrompt.trim().length === 0) {
    throw new Error('Image generation prompt is required');
  }
  
  // OpenAI API Configuration
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your-openai-api-key';
  const UPLOADTHING_SECRET = process.env.UPLOADTHING_SECRET || 'your-uploadthing-secret';
  
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
      response_format: 'b64_json' // Get base64 for easier handling
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
  }
  
  const imageResult = await response.json();
  const base64Image = imageResult.data[0].b64_json;
  const revisedPrompt = imageResult.data[0].revised_prompt || finalPrompt;
  
  console.log('[IMAGE_GEN] Image generated, uploading to UploadThing...');
  
  // Convert base64 to blob for UploadThing upload
  const base64Data = base64Image;
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: 'image/png' });
  
  // Create FormData for UploadThing
  const formData = new FormData();
  const filename = `ai-generated-${Date.now()}.png`;
  formData.append('files', blob, filename);
  
  let permanentImageUrl = '';
  let uploadError = null;
  
  // Upload to UploadThing if configured
  if (UPLOADTHING_SECRET && UPLOADTHING_SECRET !== 'your-uploadthing-secret') {
    try {
      const uploadResponse = await fetch('https://api.uploadthing.com/api/uploadFiles', {
        method: 'POST',
        headers: {
          'X-Uploadthing-Api-Key': UPLOADTHING_SECRET,
        },
        body: formData
      });
      
      if (uploadResponse.ok) {
        const uploadResult = await uploadResponse.json();
        permanentImageUrl = uploadResult.data?.[0]?.url || '';
        console.log(`[IMAGE_GEN] Uploaded to UploadThing: ${permanentImageUrl}`);
      } else {
        uploadError = `UploadThing Error: ${uploadResponse.status}`;
        console.error('[IMAGE_GEN] UploadThing upload failed:', uploadError);
      }
    } catch (error) {
      uploadError = error.message;
      console.error('[IMAGE_GEN] UploadThing upload error:', error);
    }
  } else {
    uploadError = 'UploadThing not configured';
  }
  
  // Create data URI as fallback
  const dataUri = `data:image/png;base64,${base64Image}`;
  
  const processingTime = Date.now() - startTime;
  console.log(`[IMAGE_GEN] Generation completed in ${processingTime}ms`);
  
  // Format business-focused response with permanent URL
  const businessResponse = `🎨 **AI Image Generation Complete** (${processingTime}ms)

**🎯 Original Prompt**: ${originalPrompt}
**🤖 AI Enhanced Prompt**: ${revisedPrompt}
**📐 Specifications**: ${imageSize} • ${quality.toUpperCase()} Quality • ${imageStyle} Style
**⏱️ Processing Time**: ${processingTime}ms

${permanentImageUrl ? 
`**🔗 Permanent Image URL**: ${permanentImageUrl}
**✅ Upload Status**: Successfully stored on UploadThing CDN` : 
`**⚠️ Upload Status**: ${uploadError}
**🔗 Temporary Image**: Available as base64 data (expires with session)`}

**💼 Business Intelligence Summary**:
• **AI Model**: DALL-E 3 (Latest OpenAI Image Generation)
• **Quality**: Professional-grade ${quality} resolution
• **Business Use**: Corporate presentations, marketing materials, social media
• **Compliance**: Generated content follows OpenAI usage policies
• **Storage**: ${permanentImageUrl ? 'Permanent CDN hosting' : 'Temporary base64 encoding'}

**🚀 Platform Capabilities Demonstrated**:
• Advanced AI image generation with DALL-E 3
• Intelligent prompt enhancement for professional results
• Automatic CDN upload and permanent storage
• High-resolution output suitable for business use
• Real-time generation and delivery system`;

  // Return structured response
  return {
    success: true,
    originalPrompt: originalPrompt,
    revisedPrompt: revisedPrompt,
    imageSize: imageSize,
    quality: quality,
    style: imageStyle,
    processingTime: processingTime,
    permanentUrl: permanentImageUrl,
    temporaryDataUri: permanentImageUrl ? undefined : dataUri, // Only include if no permanent URL
    base64Data: base64Image,
    content: businessResponse,
    uploadStatus: permanentImageUrl ? 'success' : 'failed',
    uploadError: uploadError,
    timestamp: new Date().toISOString(),
    tool: 'image_generation',
    model: 'dall-e-3'
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
    success: false,
    error: error.message,
    content: errorResponse,
    timestamp: new Date().toISOString(),
    tool: 'image_generation'
  };
} 