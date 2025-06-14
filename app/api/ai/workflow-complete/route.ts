import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    console.log('=== ASYNC WORKFLOW CALLBACK RECEIVED ===');
    const startTime = Date.now();
    
    const body = await req.json();
    console.log('Callback payload keys:', Object.keys(body));
    console.log('Callback content preview:', body.content?.substring(0, 200));
    
    // Extract response data with multiple fallback paths
    const content = body.content || body.output || body.text || body.message || 'Workflow completed';
    const metadata = body.metadata || {};
    const channelId = metadata.channelId || body.channelId;
    const userId = metadata.userId || body.userId;
    const sessionId = metadata.sessionId || body.sessionId;
    const messageId = metadata.messageId || body.messageId;
    
    console.log('Processing callback for:', { channelId, userId, sessionId, messageId });
    console.log('Content type:', typeof content, 'Length:', content?.length || 0);
    
    if (!channelId || !content) {
      console.error('Missing required callback data:', { channelId: !!channelId, content: !!content });
      return NextResponse.json({ 
        error: 'Missing channelId or content',
        received: Object.keys(body)
      }, { status: 400 });
    }
    
    // Enhanced message processing with better error handling
    try {
      let messageToEmit = null;
      
      if (messageId && messageId !== 'skip-update') {
        // UPDATE the existing processing message with the AI response
        console.log('🔄 Attempting to update existing processing message:', messageId);
        
        try {
          // First verify the message exists and get its current state
          const existingMessage = await db.message.findUnique({
            where: { id: messageId },
            include: {
              member: {
                include: {
                  profile: true
                }
              }
            }
          });
          
          if (existingMessage) {
            console.log('✅ Found existing processing message:', {
              id: existingMessage.id,
              currentContent: existingMessage.content.substring(0, 100) + '...',
              memberName: existingMessage.member.profile.name,
              memberId: existingMessage.member.id,
              role: existingMessage.role || 'not set'
            });
            
            // Update the message with new content
            messageToEmit = await db.message.update({
              where: { id: messageId },
              data: {
                content,
                role: 'system', // Ensure it's marked as system message
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
            console.log('✅ Successfully updated processing message with AI response');
            console.log('Updated message member:', messageToEmit.member.profile.name);
          } else {
            console.error('❌ Processing message not found:', messageId);
            throw new Error(`Processing message ${messageId} not found`);
          }
        } catch (updateError) {
          console.error('❌ Failed to update processing message:', updateError);
          throw updateError;
        }
      }
      
      // Fallback: Create new message if update failed or no messageId provided
      if (!messageToEmit) {
        console.log('🆕 Creating new AI system message (fallback mode)');
        
        // Use the System User specifically, not just any admin
        const SYSTEM_USER_ID = process.env.SYSTEM_USER_ID || "system-user-9000";
        
        // Find the channel to get server ID
        const channel = await db.channel.findUnique({
          where: { id: channelId },
          select: { serverId: true },
        });

        if (!channel) {
          console.error('Channel not found:', channelId);
          return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
        }

        // Find the System User member for this server
        const systemMember = await db.member.findFirst({
          where: {
            profileId: SYSTEM_USER_ID,
            serverId: channel.serverId,
          },
          include: {
            profile: true
          }
        });
        
        if (systemMember) {
          console.log('Creating new message with System User:', systemMember.profile.name);
          messageToEmit = await db.message.create({
            data: {
              id: require('crypto').randomUUID(),
              content,
              role: 'system',
              memberId: systemMember.id,
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
          console.log('✅ Created new AI system message from System User:', messageToEmit.id);
        } else {
          console.error('❌ System User member not found for channel:', channelId);
          console.error('This indicates the System User is not properly set up in the server');
          return NextResponse.json({ 
            error: 'System User not configured properly for this server',
            systemUserId: SYSTEM_USER_ID,
            serverId: channel.serverId
          }, { status: 500 });
        }
      }

      if (messageToEmit) {
        console.log(`✅ AI message processed successfully: ${messageToEmit.id}`);
        console.log(`👤 Message attributed to: ${messageToEmit.member.profile.name} (${messageToEmit.member.profile.id})`);
        console.log(`📝 Message role: ${messageToEmit.role || 'not set'}`);
        console.log(`📍 Channel: ${channelId}, Content length: ${content.length}`);
        
        // Enhanced real-time notification with attribution verification
        try {
          // Try to trigger a Server-Sent Events update if available
          const { triggerChannelUpdate } = await import('@/lib/system/sse-updates');
          await triggerChannelUpdate(channelId, {
            id: messageToEmit.id,
            content: messageToEmit.content,
            role: messageToEmit.role || 'system',
            author: messageToEmit.member.profile.name,
            createdAt: messageToEmit.createdAt
          });
          console.log(`✅ SSE update triggered for channel: ${channelId}`);
        } catch (sseError) {
          console.log('SSE update not available, relying on client polling');
        }
      } else {
        console.error('❌ Failed to process AI message for channel:', channelId);
        return NextResponse.json({ 
          error: 'Failed to process AI message',
          channelId,
          messageId
        }, { status: 500 });
      }
      
      const processingTime = Date.now() - startTime;
      console.log(`=== ASYNC CALLBACK SUCCESS (${processingTime}ms) ===`);
      console.log(`Final attribution: ${messageToEmit.member.profile.name} (Role: ${messageToEmit.role})`);
      
      return NextResponse.json({ 
        success: true,
        type: 'message_update',
        channelId,
        messageId: messageToEmit.id,
        attribution: {
          memberId: messageToEmit.member.id,
          profileId: messageToEmit.member.profile.id,
          profileName: messageToEmit.member.profile.name,
          role: messageToEmit.role
        },
        processingTime,
        timestamp: new Date().toISOString(),
        note: 'AI response properly attributed to System User'
      });
      
    } catch (processingError) {
      console.error('❌ Message processing error:', processingError);
      
      return NextResponse.json({ 
        success: false,
        error: 'Message processing failed',
        details: processingError instanceof Error ? processingError.message : 'Unknown error',
        channelId,
        messageId,
        processingTime: Date.now() - startTime
      }, { status: 500 });
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