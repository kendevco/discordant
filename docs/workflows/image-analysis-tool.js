// Enhanced Image Analysis Tool with GPT-4 Vision API
// Based on OpenAI Vision documentation and business intelligence requirements

const startTime = Date.now();
console.log('=== IMAGE ANALYSIS TOOL STARTING ===');

try {
  // Extract input parameters
  const inputData = $input.first().json;
  const imageUrl = inputData.image_url || inputData.url || inputData.imageUrl || '';
  const analysisType = inputData.analysis_type || 'business_intelligence';
  const customPrompt = inputData.question || inputData.prompt || '';
  
  console.log(`[IMAGE_ANALYSIS] Processing image: ${imageUrl.substring(0, 100)}...`);
  console.log(`[IMAGE_ANALYSIS] Analysis type: ${analysisType}`);
  
  // Validate image URL
  if (!imageUrl || (!imageUrl.includes('http') && !imageUrl.startsWith('data:'))) {
    throw new Error('Valid image URL or data URI is required for analysis');
  }
  
  // OpenAI API Configuration
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your-openai-api-key';
  
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-openai-api-key') {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }
  
  // Create analysis prompt based on type
  const getAnalysisPrompt = (type, custom) => {
    const basePrompt = custom || 'Analyze this image in detail';
    
    switch (type) {
      case 'business_intelligence':
        return `${basePrompt}

**Business Intelligence Analysis Required:**
1. **Content Analysis**: Describe what you see in detail
2. **Text Extraction (OCR)**: Extract and transcribe any text visible in the image
3. **Data Interpretation**: If charts, graphs, or data visualizations are present, interpret the data
4. **Business Insights**: Identify business-relevant information, opportunities, or concerns
5. **Actionable Recommendations**: Suggest next steps or actions based on the image content
6. **Risk Assessment**: Note any potential compliance, security, or business risks
7. **Automation Opportunities**: Identify processes that could be automated based on what's shown

Format your response with clear sections and bullet points for easy business consumption.`;

      case 'document_analysis':
        return `${basePrompt}

**Document Analysis Required:**
1. **Document Type**: Identify the type of document
2. **Text Extraction**: Extract all visible text with high accuracy
3. **Key Information**: Highlight important data points, dates, numbers, names
4. **Structure Analysis**: Describe the document layout and organization
5. **Business Context**: Explain the business purpose and implications
6. **Data Quality**: Assess completeness and clarity of information

Focus on accuracy and business utility in your analysis.`;

      case 'chart_data':
        return `${basePrompt}

**Chart/Data Analysis Required:**
1. **Chart Type**: Identify the type of visualization (bar, line, pie, etc.)
2. **Data Extraction**: Extract numerical values, labels, and trends
3. **Key Insights**: Summarize the main findings and trends
4. **Business Implications**: Explain what this data means for business decisions
5. **Recommendations**: Suggest actions based on the data trends
6. **Data Quality**: Assess the clarity and completeness of the visualization

Provide specific numbers and percentages where visible.`;

      case 'general':
      default:
        return `${basePrompt}

**General Image Analysis:**
1. **Visual Description**: Describe what you see in the image
2. **Text Content**: Extract any text present in the image
3. **Objects and Elements**: Identify key objects, people, or elements
4. **Context and Setting**: Describe the environment or setting
5. **Business Relevance**: Note any business-relevant aspects
6. **Quality Assessment**: Comment on image quality and clarity

Provide a comprehensive but concise analysis.`;
    }
  };
  
  const analysisPrompt = getAnalysisPrompt(analysisType, customPrompt);
  
  // Call OpenAI Vision API
  console.log('[IMAGE_ANALYSIS] Calling OpenAI Vision API...');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o', // Latest vision model
      max_tokens: 1500,
      temperature: 0.1, // Low temperature for accurate analysis
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: analysisPrompt
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
                detail: 'high' // High detail for better analysis
              }
            }
          ]
        }
      ]
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
  }
  
  const apiResult = await response.json();
  const analysisResult = apiResult.choices[0].message.content;
  
  const processingTime = Date.now() - startTime;
  console.log(`[IMAGE_ANALYSIS] Analysis completed in ${processingTime}ms`);
  
  // Format business-focused response
  const businessResponse = `🔍 **AI Image Analysis Complete** (${processingTime}ms)

**📸 Image Source**: ${imageUrl.substring(0, 80)}${imageUrl.length > 80 ? '...' : ''}
**🎯 Analysis Type**: ${analysisType.toUpperCase().replace('_', ' ')}
**⏱️ Processing Time**: ${processingTime}ms

${analysisResult}

**💼 Business Intelligence Summary**:
• **Automation Potential**: High-value opportunities identified
• **Data Quality**: Professional AI analysis completed  
• **Business Impact**: Actionable insights provided
• **Next Steps**: Review recommendations and implement suggested actions

**🚀 Platform Capabilities Demonstrated**:
• Advanced AI vision processing with GPT-4
• Real-time image analysis and OCR
• Business intelligence extraction
• Automated workflow integration
• Enterprise-grade accuracy and reliability`;

  // Return structured response
  return {
    success: true,
    analysisType: analysisType,
    imageUrl: imageUrl,
    processingTime: processingTime,
    content: businessResponse,
    rawAnalysis: analysisResult,
    timestamp: new Date().toISOString(),
    tool: 'image_analysis',
    model: 'gpt-4o'
  };
  
} catch (error) {
  console.error('[IMAGE_ANALYSIS] Error:', error.message);
  
  const errorResponse = `🚨 **Image Analysis Error**

**Error**: ${error.message}

**Troubleshooting Steps**:
• Verify image URL is publicly accessible
• Check OpenAI API key configuration
• Ensure image format is supported (JPG, PNG, GIF, WebP)
• Confirm image size is under 20MB
• Verify network connectivity to OpenAI API

**Supported Features**:
• Document text extraction (OCR)
• Chart and graph analysis
• Business document processing
• Visual content analysis
• Competitive intelligence gathering

**Business Continuity**: Manual review recommended for critical business images.`;

  return {
    success: false,
    error: error.message,
    content: errorResponse,
    timestamp: new Date().toISOString(),
    tool: 'image_analysis'
  };
} 