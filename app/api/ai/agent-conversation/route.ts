// AI Agent Conversation Response Handler
// Handles responses from n8n workflows for agent direct message conversations

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { MessageRole } from '@prisma/client';

interface AgentConversationResponse {
  conversationId?: string;
  messageId?: string; // Processing message to update
  content?: string;
  agentResponse?: {
    content: string;
    type?: "text" | "markdown" | "html";
    metadata?: Record<string, any>;
  };
  workflowId?: string;
  executionId?: string;
  processingTime?: number;
  metadata?: {
    processingMessageId?: string;
    agentProfileId?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    console.log('[AGENT_CONVERSATION] === AI Agent Conversation Response Received ===');
    const startTime = Date.now();
    
    const body: AgentConversationResponse = await req.json();
    console.log('[AGENT_CONVERSATION] Response payload keys:', Object.keys(body));
    console.log('[AGENT_CONVERSATION] Content preview:', body.content?.substring(0, 200) || body.agentResponse?.content?.substring(0, 200));
    
    // Extract response data
    const content = body.content || body.agentResponse?.content || 'Agent response completed';
    const conversationId = body.conversationId;
    const messageId = body.messageId || body.metadata?.processingMessageId;
    const agentProfileId = body.metadata?.agentProfileId;
    
    console.log('[AGENT_CONVERSATION] Processing response for:', { 
      conversationId, 
      messageId, 
      agentProfileId,
      contentLength: content.length 
    });
    
    if (!conversationId || !content) {
      console.error('[AGENT_CONVERSATION] Missing required data:', { 
        conversationId: !!conversationId, 
        content: !!content 
      });
      return NextResponse.json({ 
        error: 'Missing conversationId or content',
        received: Object.keys(body)
      }, { status: 400 });
    }
    
    let responseMessage = null;
    
    try {
      if (messageId) {
        // UPDATE the existing processing message with the AI response
        console.log('[AGENT_CONVERSATION] Updating existing processing message:', messageId);
        
        responseMessage = await db.directMessage.update({
          where: { id: messageId },
          data: {
            content,
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
        
        console.log('[AGENT_CONVERSATION] ✅ Successfully updated processing message with agent response');
        
      } else {
        // CREATE a new agent response message (fallback scenario)
        console.log('[AGENT_CONVERSATION] ⚠️ No processing message ID, creating new agent response');
        
        // Find the agent member in this conversation
        const conversation = await db.conversation.findUnique({
          where: { id: conversationId },
          include: {
            memberOne: { 
              include: { 
                profile: { 
                  include: { agentProfile: true } 
                } 
              } 
            },
            memberTwo: { 
              include: { 
                profile: { 
                  include: { agentProfile: true } 
                } 
              } 
            }
          }
        });
        
        if (!conversation) {
          throw new Error(`Conversation not found: ${conversationId}`);
        }
        
        // Find the agent member
        const agentMember = conversation.memberOne.profile.agentProfile 
          ? conversation.memberOne 
          : conversation.memberTwo;
        
        if (!agentMember.profile.agentProfile) {
          throw new Error('No agent found in conversation');
        }
        
        responseMessage = await db.directMessage.create({
          data: {
            id: require('crypto').randomUUID(),
            content,
            conversationId,
            memberId: agentMember.id,
            updatedAt: new Date(),
          },
          include: {
            member: {
              include: {
                profile: true
              }
            }
          }
        });
        
        console.log('[AGENT_CONVERSATION] ✅ Created new agent response message');
      }
      
      // Update agent activity
      if (agentProfileId) {
        try {
          await db.agentProfile.update({
            where: { id: agentProfileId },
            data: {
              lastActive: new Date(),
              messageCount: { increment: 1 }
            }
          });
          console.log('[AGENT_CONVERSATION] ✅ Updated agent activity');
        } catch (agentUpdateError) {
          console.warn('[AGENT_CONVERSATION] Failed to update agent activity:', agentUpdateError);
        }
      }
      
      // Trigger SSE update for real-time display
      try {
        const { triggerConversationUpdate } = await import('@/lib/system/sse-updates');
        await triggerConversationUpdate(conversationId, {
          id: responseMessage.id,
          content: responseMessage.content,
          role: 'system',
          author: responseMessage.member.profile.name,
          createdAt: responseMessage.createdAt
        });
        console.log('[AGENT_CONVERSATION] ✅ SSE update triggered for conversation:', conversationId);
      } catch (sseError) {
        console.log('[AGENT_CONVERSATION] SSE update not available, relying on client polling');
      }
      
      const processingTime = Date.now() - startTime;
      console.log(`[AGENT_CONVERSATION] === Agent Conversation Success (${processingTime}ms) ===`);
      
      return NextResponse.json({ 
        success: true,
        type: 'agent_conversation_response',
        conversationId,
        messageId: responseMessage.id,
        processingTime,
        timestamp: new Date().toISOString(),
        note: 'Agent conversation response processed successfully'
      });
      
    } catch (dbError) {
      console.error('[AGENT_CONVERSATION] Database error:', dbError);
      
      return NextResponse.json({ 
        success: false,
        error: 'Failed to process agent conversation response',
        conversationId,
        processingTime: Date.now() - startTime,
        details: dbError instanceof Error ? dbError.message : 'Database error'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('[AGENT_CONVERSATION] === Agent Conversation Error ===');
    console.error('Error details:', error);
    
    return NextResponse.json({ 
      error: 'Agent conversation processing failed',
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