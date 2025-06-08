import { useEffect } from 'react';
import { FileProcessingService } from '@/lib/services/file-processing';

interface MessageProcessingConfig {
  messageId?: string;
  directMessageId?: string;
  fileUrl?: string;
  memberId?: string;
  channelId?: string;
  conversationId?: string;
  userContent?: string;
}

export function useMessageProcessing(config: MessageProcessingConfig) {
  useEffect(() => {
    const processMessage = async () => {
      // Only process if we have a file URL and message ID
      if (!config.fileUrl || (!config.messageId && !config.directMessageId)) {
        return;
      }

      try {
        console.log(`[MESSAGE_PROCESSING] Processing message with file:`, config);
        
        await FileProcessingService.processUploadedFile(
          config.fileUrl,
          config.messageId,
          config.directMessageId,
          config.memberId,
          config.channelId,
          config.userContent
        );
        
        console.log(`[MESSAGE_PROCESSING] File processing initiated successfully`);
        
      } catch (error) {
        console.error(`[MESSAGE_PROCESSING] Error processing message:`, error);
      }
    };

    // Small delay to ensure message is fully created
    const timer = setTimeout(processMessage, 1000);
    
    return () => clearTimeout(timer);
  }, [
    config.messageId,
    config.directMessageId,
    config.fileUrl,
    config.memberId,
    config.channelId,
    config.conversationId,
    config.userContent,
  ]);
}

// Utility function for manual processing trigger
export async function triggerFileProcessing(config: MessageProcessingConfig) {
  if (!config.fileUrl || (!config.messageId && !config.directMessageId)) {
    throw new Error('File URL and message ID are required for processing');
  }

  return await FileProcessingService.processUploadedFile(
    config.fileUrl,
    config.messageId,
    config.directMessageId,
    config.memberId,
    config.channelId,
    config.userContent
  );
} 