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
    
    // Handle both message updates and new message creation
    try {
      let messageToEmit = null;
      
      if (messageId && messageId !== 'skip-update') {
        // Try to get updated message from database
        messageToEmit = await db.message.findUnique({
          where: { id: messageId },
          include: {
            member: {
              include: {
                profile: true
              }
            }
          }
        });
        console.log('Found existing message to update:', !!messageToEmit);
      }
      
      if (!messageToEmit) {
        // Create new AI system message since no existing message to update
        console.log('Creating new AI system message...');
        
        // Find any admin member for this channel to create the system message
        const adminMember = await db.member.findFirst({
          where: {
            role: 'ADMIN',
            server: {
              channels: {
                some: {
                  id: channelId
                }
              }
            }
          },
          include: {
            profile: true
          }
        });
        
        if (adminMember) {
          messageToEmit = await db.message.create({
            data: {
              id: require('crypto').randomUUID(),
              content,
              role: 'system',
              memberId: adminMember.id,
              channelId: channelId,
              updatedAt: new Date()
            },
            include: {
              member: {
                include: {
                  profile: true
                }
              }
            }
          });
          console.log('Created new AI system message:', messageToEmit.id);
        } else {
          console.error('No admin member found for channel:', channelId);
        }
      }

      if (messageToEmit) {
        console.log(`✅ AI message created/updated successfully: ${messageToEmit.id}`);
        console.log(`Channel: ${channelId}, Content length: ${content.length}`);
        
        // In serverless environments, Socket.IO emissions are unreliable
        // The client will pick up the new message through normal polling/refresh
        // or we can trigger a Server-Sent Events update
        
        try {
          // Try to trigger a Server-Sent Events update if available
          const { triggerChannelUpdate } = await import('@/lib/system/sse-updates');
          await triggerChannelUpdate(channelId, messageToEmit);
          console.log(`✅ SSE update triggered for channel: ${channelId}`);
        } catch (sseError) {
          console.log('SSE update not available, relying on client polling');
        }
      } else {
        console.warn('No message to emit for channel:', channelId);
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