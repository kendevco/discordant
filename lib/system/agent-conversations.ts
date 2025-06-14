// Agent Direct Message Conversation Handler
// Handles one-on-one conversations between humans and AI agents

import { db } from '@/lib/db';
import { AgentProfile, DirectMessage, Member, Profile, AgentType } from '@prisma/client';
import { randomUUID } from 'crypto';

interface AgentDirectMessageContext {
  conversationId: string;
  humanMessage: DirectMessage & {
    member: Member & {
      profile: Profile;
    };
  };
  agentProfile: AgentProfile;
  req?: any;
}

/**
 * Process a direct message sent to an AI agent
 * This creates a conversational AI response, not a system message
 */
export async function createAgentDirectMessage(
  conversationId: string,
  humanMessage: DirectMessage & {
    member: Member & {
      profile: Profile;
    };
  },
  agentProfile: AgentProfile | null,
  req?: any
): Promise<DirectMessage | null> {
  try {
    if (!agentProfile) {
      console.error('[AGENT_DM] No agent profile provided');
      return null;
    }

    console.log(`[AGENT_DM] Processing conversation with ${agentProfile.agentType} agent`);

    const context: AgentDirectMessageContext = {
      conversationId,
      humanMessage,
      agentProfile,
      req
    };

    // Route to appropriate agent handler based on agent type
    switch (agentProfile.agentType) {
      case AgentType.AI_ASSISTANT:
        return await handleAIAssistantConversation(context);
      
      case AgentType.VAPI_TRANSCRIBER:
        return await handleVAPITranscriberConversation(context);
      
      case AgentType.SYSTEM_NOTIFIER:
        return await handleSystemNotifierConversation(context);
      
      case AgentType.PORTFOLIO_VISITOR:
        return await handlePortfolioVisitorConversation(context);
      
      case AgentType.WORKFLOW_RESPONDER:
        return await handleWorkflowResponderConversation(context);
      
      case AgentType.EXTERNAL_SERVICE:
        return await handleExternalServiceConversation(context);
      
      default:
        console.warn(`[AGENT_DM] Unknown agent type: ${agentProfile.agentType}`);
        return await handleGenericAgentConversation(context);
    }

  } catch (error) {
    console.error('[AGENT_DM] Error processing agent conversation:', error);
    return null;
  }
}

/**
 * Handle conversation with AI Assistant agent
 * This is the main conversational AI that uses workflows
 */
async function handleAIAssistantConversation(context: AgentDirectMessageContext): Promise<DirectMessage | null> {
  try {
    console.log('[AGENT_DM] Processing AI Assistant conversation');

    // Create a processing message first
    const agentMember = await getAgentMember(context.conversationId, context.agentProfile.profileId);
    if (!agentMember) {
      console.error('[AGENT_DM] Could not find agent member');
      return null;
    }

    const processingMessage = await db.directMessage.create({
      data: {
        id: randomUUID(),
        content: "🤖 *Thinking...*\n\nI'm processing your message and will respond shortly.",
        conversationId: context.conversationId,
        memberId: agentMember.id,
        updatedAt: new Date(),
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    // Process through workflow system but with conversational context
    const { WorkflowRouter } = await import('@/lib/system/workflow-router');
    const route = WorkflowRouter.getWorkflowRoute(context.humanMessage.content);
    
         // Create conversational payload (different from system message payload)
     const payload = {
       message: context.humanMessage.content,
       content: context.humanMessage.content,
       userId: context.humanMessage.member.profile.id,
       userName: context.humanMessage.member.profile.name,
       conversationId: context.conversationId,
       messageId: processingMessage.id, // For updating the processing message
       context: {
         isDirectMessage: true,
         isAgentConversation: true,
         agentType: context.agentProfile.agentType,
         conversational: true, // Flag for more natural responses
         humanName: context.humanMessage.member.profile.name
       },
       metadata: {
         processingMessageId: processingMessage.id,
         agentProfileId: context.agentProfile.id
       },
       // Special callback URL for agent conversations
       callbackUrl: getAgentConversationCallbackUrl(context.req)
     };

    // Call workflow with conversational context
    const proxyUrl = getWorkflowProxyUrl(context.req);
    
    try {
      const res = await fetch(proxyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Workflow-Id": route.workflowId,
          "X-Webhook-Path": route.webhookPath,
          "X-Conversation-Mode": "true", // Special header for conversational responses
          "User-Agent": "Discordant-Agent-Conversation/1.0",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(60000),
      });

      if (res.ok) {
        console.log('[AGENT_DM] ✅ Workflow processing initiated for AI Assistant');
        // The workflow will update the processing message
        return processingMessage;
      } else {
        throw new Error(`Workflow failed: ${res.status}`);
      }

    } catch (workflowError) {
      console.error('[AGENT_DM] Workflow failed, using fallback response:', workflowError);
      
      // Update processing message with fallback
      const fallbackMessage = await db.directMessage.update({
        where: { id: processingMessage.id },
        data: {
          content: `Hi ${context.humanMessage.member.profile.name}! 👋\n\nI received your message: "${context.humanMessage.content}"\n\nI'm currently experiencing some technical difficulties, but I'm here to help. Could you try rephrasing your request or ask me something else?\n\n*This is a fallback response - my main AI systems are temporarily unavailable.*`,
          updatedAt: new Date(),
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });

      return fallbackMessage;
    }

  } catch (error) {
    console.error('[AGENT_DM] Error in AI Assistant conversation:', error);
    return null;
  }
}

/**
 * Handle other agent types with simpler responses
 */
async function handleVAPITranscriberConversation(context: AgentDirectMessageContext): Promise<DirectMessage | null> {
  return await createSimpleAgentResponse(
    context,
    `Hello! I'm the VAPI Transcriber agent. I handle voice call transcriptions and convert them to text messages. Is there something specific about voice transcription you'd like to know?`
  );
}

async function handleSystemNotifierConversation(context: AgentDirectMessageContext): Promise<DirectMessage | null> {
  return await createSimpleAgentResponse(
    context,
    `Hi! I'm the System Notifier agent. I handle system alerts and notifications. How can I help you with system notifications?`
  );
}

async function handlePortfolioVisitorConversation(context: AgentDirectMessageContext): Promise<DirectMessage | null> {
  return await createSimpleAgentResponse(
    context,
    `Hello! I'm the Portfolio Visitor agent. I help manage interactions from portfolio website visitors. What would you like to know about visitor management?`
  );
}

async function handleWorkflowResponderConversation(context: AgentDirectMessageContext): Promise<DirectMessage | null> {
  return await createSimpleAgentResponse(
    context,
    `Hi there! I'm the Workflow Responder agent. I handle automated workflow responses and integrations. How can I assist you with workflow automation?`
  );
}

async function handleExternalServiceConversation(context: AgentDirectMessageContext): Promise<DirectMessage | null> {
  return await createSimpleAgentResponse(
    context,
    `Hello! I'm an External Service agent. I handle integrations with external systems and services. What external service integration can I help you with?`
  );
}

async function handleGenericAgentConversation(context: AgentDirectMessageContext): Promise<DirectMessage | null> {
  return await createSimpleAgentResponse(
    context,
    `Hello! I'm an AI agent here to help. You sent: "${context.humanMessage.content}"\n\nI'm not sure how to handle that specific request, but I'm here to assist. Could you tell me more about what you need?`
  );
}

/**
 * Create a simple agent response for non-AI-Assistant agents
 */
async function createSimpleAgentResponse(
  context: AgentDirectMessageContext,
  responseContent: string
): Promise<DirectMessage | null> {
  try {
    const agentMember = await getAgentMember(context.conversationId, context.agentProfile.profileId);
    if (!agentMember) {
      console.error('[AGENT_DM] Could not find agent member for simple response');
      return null;
    }

    const agentResponse = await db.directMessage.create({
      data: {
        id: randomUUID(),
        content: responseContent,
        conversationId: context.conversationId,
        memberId: agentMember.id,
        updatedAt: new Date(),
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    console.log(`[AGENT_DM] ✅ Simple agent response created for ${context.agentProfile.agentType}`);
    return agentResponse;

  } catch (error) {
    console.error('[AGENT_DM] Error creating simple agent response:', error);
    return null;
  }
}

/**
 * Get the agent member for a conversation
 */
async function getAgentMember(conversationId: string, agentProfileId: string): Promise<Member | null> {
  try {
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        memberOne: { include: { profile: true } },
        memberTwo: { include: { profile: true } }
      }
    });

    if (!conversation) return null;

    // Find which member is the agent
    if (conversation.memberOne.profile.id === agentProfileId) {
      return conversation.memberOne;
    } else if (conversation.memberTwo.profile.id === agentProfileId) {
      return conversation.memberTwo;
    }

    return null;
  } catch (error) {
    console.error('[AGENT_DM] Error finding agent member:', error);
    return null;
  }
}

/**
 * Get workflow proxy URL (same as system messages)
 */
function getWorkflowProxyUrl(req?: any): string {
  // Use the same logic as system messages
  return process.env.NODE_ENV === 'production' 
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/workflow`
    : 'https://localhost:3000/api/workflow';
}

/**
 * Get agent conversation callback URL
 */
function getAgentConversationCallbackUrl(req?: any): string {
  return process.env.NODE_ENV === 'production' 
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/ai/agent-conversation`
    : 'https://localhost:3000/api/ai/agent-conversation';
} 