import { headers } from 'next/headers';
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    
    if (!profile) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get('channelId');

    if (!channelId) {
      return new Response('Channel ID missing', { status: 400 });
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
      return new Response('Channel not found', { status: 404 });
    }

    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection success
        controller.enqueue('data: {"type":"connected"}\n\n');

        // Keep connection alive with ping every 30 seconds
        const pingInterval = setInterval(() => {
          controller.enqueue('data: {"type":"ping"}\n\n');
        }, 30000);

        // Cleanup on close
        return () => {
          clearInterval(pingInterval);
        };
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'Transfer-Encoding': 'chunked'
      },
    });
  } catch (error) {
    console.error('[MESSAGES_STREAM]', error);
    return new Response('Internal Error', { status: 500 });
  }
} 