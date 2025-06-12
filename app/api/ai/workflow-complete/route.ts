import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { externalSocketService, type SocketMessage } from '@/lib/socket-service';

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
    
    console.log('Processing callback for:', { channelId, userId, sessionId });
    
    if (!channelId || !content) {
      console.error('Missing required callback data:', { channelId: !!channelId, content: !!content });
      return NextResponse.json({ 
        error: 'Missing channelId or content',
        received: Object.keys(body)
      }, { status: 400 });
    }
    
    // Find the existing "AI Processing Started" message and update it instead of creating a new one
    try {
      // First, try to find the most recent system message in this channel that contains "AI Processing Started"
      const existingMessage = await db.message.findFirst({
        where: {
          channelId,
          role: 'system',
          content: {
            contains: 'AI Processing Started'
          },
          createdAt: {
            gte: new Date(Date.now() - 5 * 60 * 1000) // Only look for messages in the last 5 minutes
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      let message;
      if (existingMessage) {
        // Update the existing message with the final AI response
        message = await db.message.update({
          where: { id: existingMessage.id },
          data: {
            content,
            updatedAt: new Date(),
          }
        });
        console.log('Updated existing processing message:', message.id);
      } else {
        // Fallback: create new message if no processing message found
        message = await db.message.create({
          data: {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            content,
            channelId,
            memberId: 'ai-assistant-bot',
            role: 'system',
            fileUrl: null,
            updatedAt: new Date(),
          }
        });
        console.log('Created new AI response message:', message.id);
      }
      
      // Real-time update via Socket.IO
      const socketMessage: SocketMessage = {
        id: message.id,
        content: message.content,
        channelId: message.channelId,
        conversationId: undefined,
        member: {
          id: 'ai-assistant-bot',
          profile: {
            id: 'ai-assistant-bot',
            name: 'AI Assistant',
            imageUrl: '/ai-avatar.png'
          }
        },
        role: 'system',
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        fileUrl: message.fileUrl || undefined
      };
      
      // Use existing Socket.IO service
      externalSocketService.emitChannelMessage(channelId, socketMessage);
      
      console.log('Real-time message broadcasted to channel:', channelId);
      
      const processingTime = Date.now() - startTime;
      console.log(`=== ASYNC CALLBACK SUCCESS (${processingTime}ms) ===`);
      
      return NextResponse.json({ 
        success: true,
        messageId: message.id,
        channelId,
        processingTime,
        timestamp: new Date().toISOString()
      });
      
    } catch (dbError) {
      console.error('Database error in async callback:', dbError);
      
      // Still try to send real-time update even if DB fails
      const fallbackMessage: SocketMessage = {
        id: `temp-${Date.now()}`,
        content: content + '\n\n⚠️ *Message delivery confirmed, database sync pending*',
        channelId,
        conversationId: undefined,
        member: {
          id: 'ai-assistant-bot',
          profile: {
            id: 'ai-assistant-bot',
            name: 'AI Assistant',
            imageUrl: '/ai-avatar.png'
          }
        },
        role: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        fileUrl: undefined
      };
      
      externalSocketService.emitChannelMessage(channelId, fallbackMessage);
      
      return NextResponse.json({ 
        success: true,
        warning: 'Database sync pending',
        channelId,
        processingTime: Date.now() - startTime
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