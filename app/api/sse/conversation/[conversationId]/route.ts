import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { currentProfile } from '@/lib/current-profile';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params;
  
  if (!conversationId) {
    return new Response('Conversation ID missing', { status: 400 });
  }

  // Verify user has access to this conversation
  const profile = await currentProfile();
  if (!profile) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Verify conversation access
  const conversation = await db.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [
        {
          memberOne: {
            profileId: profile.id
          }
        },
        {
          memberTwo: {
            profileId: profile.id
          }
        }
      ]
    }
  });

  if (!conversation) {
    return new Response('Conversation not found or access denied', { status: 404 });
  }

  // Get the latest direct message timestamp for initial check
  const latestMessage = await db.directMessage.findFirst({
    where: { conversationId },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true }
  });

  let lastCheckTime = latestMessage?.createdAt || new Date();

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      
      // Send initial connection event
      controller.enqueue(encoder.encode('data: {"type":"connected","conversationId":"' + conversationId + '"}\n\n'));
      
      // Set up polling interval to check for new direct messages
      const interval = setInterval(async () => {
        try {
          // Check for new direct messages since last check
          const newMessages = await db.directMessage.findMany({
            where: {
              conversationId,
              createdAt: {
                gt: lastCheckTime
              }
            },
            include: {
              member: {
                include: {
                  profile: true
                }
              }
            },
            orderBy: { createdAt: 'asc' }
          });

          if (newMessages.length > 0) {
            // Update last check time
            lastCheckTime = new Date();
            
            // Send new message event
            const eventData = {
              type: 'new_direct_messages',
              conversationId,
              count: newMessages.length,
              timestamp: new Date().toISOString(),
              messages: newMessages.map(msg => ({
                id: msg.id,
                content: msg.content,
                author: msg.member.profile.name,
                createdAt: msg.createdAt.toISOString()
              }))
            };
            
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(eventData)}\n\n`));
            console.log(`[SSE_CONVERSATION] New direct messages sent for conversation: ${conversationId}, count: ${newMessages.length}`);
          }
        } catch (error) {
          console.error('[SSE_CONVERSATION] Error checking for new direct messages:', error);
          // Send error event but don't close connection
          controller.enqueue(encoder.encode('data: {"type":"error","message":"Failed to check direct messages"}\n\n'));
        }
      }, 5000); // Check every 5 seconds

      // Set up heartbeat to keep connection alive
      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode('data: {"type":"heartbeat","timestamp":"' + new Date().toISOString() + '"}\n\n'));
      }, 30000); // Heartbeat every 30 seconds

      // Cleanup function
      const cleanup = () => {
        clearInterval(interval);
        clearInterval(heartbeat);
      };

      // Handle client disconnect
      req.signal.addEventListener('abort', cleanup);

      // Auto-cleanup after 10 minutes to prevent resource leaks
      setTimeout(() => {
        cleanup();
        controller.close();
      }, 600000); // 10 minutes
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
} 