// Server-Sent Events utility for real-time updates
// This is a placeholder for future SSE implementation

import { db } from '@/lib/db';

interface SSEMessage {
  id: string;
  content: string;
  role?: string;
  author?: string;
  createdAt: Date | string;
}

/**
 * Trigger SSE update for channel messages
 * This simulates what would happen when a new message is created
 */
export async function triggerChannelUpdate(channelId: string, message: SSEMessage): Promise<boolean> {
  try {
    console.log(`[SSE_TRIGGER] Triggering channel update for: ${channelId}`);
    
    // Since we're using simple polling in SSE, we don't need to actively push
    // The SSE endpoint will detect the new message on its next poll
    // This function mainly serves as a notification and logging mechanism
    
    // Log the update for debugging
    console.log(`[SSE_TRIGGER] ✅ Channel ${channelId} message update logged:`, {
      messageId: message.id,
      contentLength: message.content.length,
      timestamp: message.createdAt
    });
    
    return true;
  } catch (error) {
    console.error('[SSE_TRIGGER] ❌ Failed to trigger channel update:', error);
    return false;
  }
}

/**
 * Trigger SSE update for conversation (direct messages)
 */
export async function triggerConversationUpdate(conversationId: string, message: SSEMessage): Promise<boolean> {
  try {
    console.log(`[SSE_TRIGGER] Triggering conversation update for: ${conversationId}`);
    
    // Log the update for debugging
    console.log(`[SSE_TRIGGER] ✅ Conversation ${conversationId} message update logged:`, {
      messageId: message.id,
      contentLength: message.content.length,
      timestamp: message.createdAt
    });
    
    return true;
  } catch (error) {
    console.error('[SSE_TRIGGER] ❌ Failed to trigger conversation update:', error);
    return false;
  }
}

/**
 * Get recent message activity for a channel (used by SSE endpoints)
 */
export async function getChannelActivity(channelId: string, since: Date) {
  try {
    const messages = await db.message.findMany({
      where: {
        channelId,
        createdAt: {
          gt: since
        }
      },
      include: {
        member: {
          include: {
            profile: true
          }
        }
      },
      orderBy: { createdAt: 'asc' },
      take: 50 // Limit to prevent excessive data
    });

    return messages;
  } catch (error) {
    console.error('[SSE_ACTIVITY] Failed to get channel activity:', error);
    return [];
  }
}

/**
 * Get recent direct message activity for a conversation (used by SSE endpoints)
 */
export async function getConversationActivity(conversationId: string, since: Date) {
  try {
    const messages = await db.directMessage.findMany({
      where: {
        conversationId,
        createdAt: {
          gt: since
        }
      },
      include: {
        member: {
          include: {
            profile: true
          }
        }
      },
      orderBy: { createdAt: 'asc' },
      take: 50 // Limit to prevent excessive data
    });

    return messages;
  } catch (error) {
    console.error('[SSE_ACTIVITY] Failed to get conversation activity:', error);
    return [];
  }
}

/**
 * Helper to format message for SSE transmission
 */
export function formatMessageForSSE(message: any) {
  return {
    id: message.id,
    content: message.content,
    role: message.role || 'user',
    author: message.member?.profile?.name || 'Unknown',
    createdAt: message.createdAt.toISOString()
  };
}

/**
 * Utility to check if SSE is available in the current environment
 */
export function isSSEAvailable(): boolean {
  return typeof EventSource !== 'undefined';
}

/**
 * Get SSE endpoint URL for a channel
 */
export function getChannelSSEUrl(channelId: string): string {
  return `/api/sse/channel/${channelId}`;
}

/**
 * Get SSE endpoint URL for a conversation
 */
export function getConversationSSEUrl(conversationId: string): string {
  return `/api/sse/conversation/${conversationId}`;
} 