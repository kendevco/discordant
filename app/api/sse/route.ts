import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
    const headersList = headers();
    
    // Check if the client accepts server-sent events
    const acceptsSSE = headersList.get('accept')?.includes('text/event-stream');
    if (!acceptsSSE) {
        return new NextResponse('SSE not supported', { status: 400 });
    }

    // Set up SSE headers
    const responseHeaders = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    };

    const stream = new ReadableStream({
        start(controller) {
            // Send initial connection message
            controller.enqueue('data: {"type":"connected"}\n\n');

            // Keep connection alive with periodic pings
            const interval = setInterval(() => {
                controller.enqueue('data: {"type":"ping"}\n\n');
            }, 30000);

            // Clean up on close
            return () => {
                clearInterval(interval);
            };
        }
    });

    return new NextResponse(stream, { headers: responseHeaders });
} 