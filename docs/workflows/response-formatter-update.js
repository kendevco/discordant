// ===== RESPONSE FORMATTER UPDATE =====
// Modify your existing "Streamlined Response Formatter" node
// Add this code to handle image processing results

// Your existing Response Formatter code should be modified like this:

const inputData = $input.first().json;

// Extract messageId (your existing logic)
const messageId = inputData.messageId || inputData.metadata?.messageId || `processed-${Date.now()}`;

console.log('[RESPONSE_FORMATTER] Formatting response for messageId:', messageId);

// Extract content from any processing path (UPDATED)
let finalContent = inputData.content || 'Processing completed';

// Build metadata (UPDATED)
let metadata = {
  messageId: messageId,
  timestamp: new Date().toISOString(),
  processing_type: inputData.processing_type || 'standard'
};

// Add image processing metadata (NEW)
if (inputData.analysis_result) {
  metadata.analysis = inputData.analysis_result;
  console.log('[RESPONSE_FORMATTER] Added image analysis metadata');
}

if (inputData.generation_result) {
  metadata.generation = inputData.generation_result;
  // If image was generated, include it in the response
  if (inputData.generation_result.imageUrl) {
    metadata.imageUrl = inputData.generation_result.imageUrl;
    console.log('[RESPONSE_FORMATTER] Added generated image URL:', inputData.generation_result.imageUrl);
  }
}

// Your existing response formatting logic continues here...
// Keep all your existing code for:
// - Business logic
// - Tool execution results
// - Calendar formatting
// - Search results formatting
// - etc.

// Format final response (your existing structure)
const response = {
  content: finalContent,
  metadata: metadata
};

console.log('[RESPONSE_FORMATTER] Final response prepared:', {
  contentLength: finalContent.length,
  messageId: messageId,
  processingType: metadata.processing_type,
  hasImageUrl: !!metadata.imageUrl
});

return response; 