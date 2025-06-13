import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    console.log('=== ASYNC WORKFLOW CALLBACK RECEIVED ===');
    const startTime = Date.now();
    
    const body = await req.json();
    console.log('Callback payload keys:', Object.keys(body));
    console.log('Callback content preview:', body.content?.substring(0, 200));
    
    // Extract response data
    const content = body.content || body.output || body.text || 'Workflow completed';
    const metadata = body.metadata || {};
    const channelId = metadata.channelId || body.channelId;
    const userId = metadata.userId || body.userId;
    const sessionId = metadata.sessionId || body.sessionId;
    const messageId = metadata.messageId || body.messageId;
    
    console.log('Processing callback for:', { channelId, userId, sessionId, messageId });
    
    if (!channelId || !content) {
      console.error('Missing required callback data:', { channelId: !!channelId, content: !!content });
      return NextResponse.json({ 
        error: 'Missing channelId or content',
        received: Object.keys(body)
      }, { status: 400 });
    }
    
    // The n8n workflow handles database updates directly via MySQL UPDATE
    // This endpoint ONLY handles real-time Socket.IO notifications
    try {
      // Get the updated message from database to emit the complete object
      const updatedMessage = await db.message.findUnique({
        where: { id: messageId },
        include: {
          member: {
            include: {
              profile: true
            }
          }
        }
      });

      if (updatedMessage) {
        // Import socket service dynamically to avoid initialization issues
        const { socketHelper } = await import('@/lib/system/socket');
        
        // Emit to the CORRECT channel key that useChatSocket is listening to
        const channelKey = `chat:${channelId}:messages`;
        
        // Emit the complete updated message object (not a new message)
        socketHelper.emit(channelKey, updatedMessage);
        
        console.log(`Real-time update notification sent to channel: ${channelKey}`);
      } else {
        console.warn('Updated message not found in database:', messageId);
      }
      
      const processingTime = Date.now() - startTime;
      console.log(`=== ASYNC CALLBACK SUCCESS (${processingTime}ms) ===`);
      
      return NextResponse.json({ 
        success: true,
        type: 'socket_notification',
        channelId,
        messageId,
        processingTime,
        timestamp: new Date().toISOString(),
        note: 'Real-time notification sent to correct socket channel'
      });
      
    } catch (socketError) {
      console.error('Socket error in async callback:', socketError);
      
      return NextResponse.json({ 
        success: false,
        warning: 'Failed to send real-time update notification',
        channelId,
        processingTime: Date.now() - startTime,
        error: socketError instanceof Error ? socketError.message : 'Socket error'
      });
    }
    
  } catch (error) {
    console.error('=== ASYNC CALLBACK ERROR ===');
    console.error('Error details:', error);
    
    return NextResponse.json({ 
      error: 'Callback processing failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 