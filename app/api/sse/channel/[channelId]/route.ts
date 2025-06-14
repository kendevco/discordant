import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { currentProfile } from '@/lib/current-profile';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  const { channelId } = await params;
  
  if (!channelId) {
    return new Response('Channel ID missing', { status: 400 });
  }

  // Verify user has access to this channel
  const profile = await currentProfile();
  if (!profile) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Verify channel access
  const channel = await db.channel.findFirst({
    where: {
      id: channelId,
      server: {
        members: {
          some: {
            profileId: profile.id
          }
        }
      }
    }
  });

  if (!channel) {
    return new Response('Channel not found or access denied', { status: 404 });
  }

  // Get the latest message timestamp for initial check
  const latestMessage = await db.message.findFirst({
    where: { channelId },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true }
  });

  let lastCheckTime = latestMessage?.createdAt || new Date();
  let consecutiveEmptyChecks = 0;
  let currentInterval = 5000; // Start with 5 seconds

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      
      // Send initial connection event
      controller.enqueue(encoder.encode(`data: {"type":"connected","channelId":"${channelId}","timestamp":"${new Date().toISOString()}"}\n\n`));
      
      // Adaptive polling function
      const checkForMessages = async () => {
        try {
          // Check for new messages since last check
          const newMessages = await db.message.findMany({
            where: {
              channelId,
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
            // Reset empty check counter and interval when messages found
            consecutiveEmptyChecks = 0;
            currentInterval = Math.max(5000, currentInterval * 0.8); // Speed up slightly
            
            // Update last check time
            lastCheckTime = new Date();
            
            // Send new message event
            const eventData = {
              type: 'new_messages',
              channelId,
              count: newMessages.length,
              timestamp: new Date().toISOString(),
              messages: newMessages.map(msg => ({
                id: msg.id,
                content: msg.content,
                role: msg.role,
                author: msg.member.profile.name,
                createdAt: msg.createdAt.toISOString()
              }))
            };
            
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(eventData)}\n\n`));
            console.log(`[SSE_CHANNEL] New messages sent for channel: ${channelId}, count: ${newMessages.length}, interval: ${currentInterval}ms`);
          } else {
            // Increase interval when no messages found (adaptive decay)
            consecutiveEmptyChecks++;
            
            // Adaptive interval calculation
            if (consecutiveEmptyChecks > 3) {
              currentInterval = Math.min(60000, currentInterval * 1.2); // Slow down, max 1 minute
            }
          }
        } catch (error) {
          console.error('[SSE_CHANNEL] Error checking for new messages:', error);
          // Send error event but don't close connection
          controller.enqueue(encoder.encode(`data: {"type":"error","message":"Failed to check messages","timestamp":"${new Date().toISOString()}"}\n\n`));
          
          // Increase interval on errors to reduce load
          currentInterval = Math.min(30000, currentInterval * 1.5);
        }
      };

      // Initial message check
      checkForMessages();

      // Set up adaptive polling
      let pollingTimeout: NodeJS.Timeout;
      
      const scheduleNextCheck = () => {
        pollingTimeout = setTimeout(async () => {
          await checkForMessages();
          scheduleNextCheck(); // Schedule next check
        }, currentInterval);
      };

      scheduleNextCheck();

      // Set up heartbeat to keep connection alive (less frequent)
      const heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`data: {"type":"heartbeat","timestamp":"${new Date().toISOString()}","interval":${currentInterval}}\n\n`));
        } catch (error) {
          console.error('[SSE_CHANNEL] Heartbeat error:', error);
          clearInterval(heartbeatInterval);
        }
      }, 60000); // Heartbeat every 60 seconds

      // Cleanup function
      const cleanup = () => {
        clearTimeout(pollingTimeout);
        clearInterval(heartbeatInterval);
        console.log(`[SSE_CHANNEL] Connection cleanup for channel: ${channelId}`);
      };

      // Handle client disconnect
      req.signal.addEventListener('abort', cleanup);

      // Auto-cleanup after 30 minutes to prevent resource leaks
      const autoCleanupTimeout = setTimeout(() => {
        cleanup();
        try {
          controller.close();
        } catch (error) {
          console.error('[SSE_CHANNEL] Error closing controller:', error);
        }
        console.log(`[SSE_CHANNEL] Auto-cleanup triggered for channel: ${channelId}`);
      }, 1800000); // 30 minutes

      // Add auto-cleanup to main cleanup
      const originalCleanup = cleanup;
      const enhancedCleanup = () => {
        clearTimeout(autoCleanupTimeout);
        originalCleanup();
      };

      req.signal.addEventListener('abort', enhancedCleanup);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    },
  });
} 