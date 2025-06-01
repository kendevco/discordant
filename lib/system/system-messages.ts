import { db } from "@/lib/db";
import { Message, Profile } from "@prisma/client";
import { analyzeImage } from "./image-analysis";
import { randomUUID } from "crypto";
import { getAIResponse } from "./ai-interface";
import { WorkflowContent } from "./types/message-content";
import { determineWorkflow } from "./workflow-utils";
import { CalendarCommandDetector } from "@/lib/utils/calendar-command-detector";
import { ResearchAgent, ResearchResult } from "./research-agent";
import { WorkflowRouter, WorkflowRoute, WorkflowPayload } from "./workflow-router";
import OpenAI from "openai";

const SYSTEM_USER_ID = process.env.SYSTEM_USER_ID || "system-user-9000";

// Initialize OpenAI client for fallback
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface MessageWithMember extends Message {
  member: {
    profile: Profile;
  };
  asIs?: boolean;
  type?: string; // for extensibility
}

export interface HandlerContext {
  channelId: string;
  serverId?: string;
  socketIo?: any;
  context: any;
}

export type SystemMessageResult = any;

export interface SystemMessageHandler {
  canHandle(message: MessageWithMember): boolean;
  handle(message: MessageWithMember, ctx: HandlerContext): Promise<SystemMessageResult>;
}

async function fetchSystemMember(channelId: string) {
  const channel = await db.channel.findUnique({
    where: { id: channelId },
    select: { serverId: true },
  });

  if (!channel) throw new Error("Channel not found");

  const systemUser = await db.profile.findUnique({
    where: { id: SYSTEM_USER_ID },
  });

  if (!systemUser) {
    throw new Error("System user not found");
  }

  const member = await db.member.findFirst({
    where: {
      profileId: SYSTEM_USER_ID,
      serverId: channel.serverId,
    },
  });

  if (!member) {
    return db.member.create({
      data: {
        id: randomUUID(),
        profileId: SYSTEM_USER_ID,
        serverId: channel.serverId,
        role: "GUEST",
      },
    });
  }

  return member;
}

async function getSystemContext(channelId: string) {
  // Get active users and channels
  const activeChannels = await db.channel.findMany({
    where: {
      messages: {
        some: {
          createdAt: {
            gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // Last 48 hours
          },
        },
      },
    },
    include: {
      _count: {
        select: { messages: true },
      },
    },
    take: 50,
  });

  // Get recent messages for context
  const recentMessages = await db.message.findMany({
    where: {
      channelId,
      createdAt: {
        gte: new Date(Date.now() - 1000 * 60 * 60 * 24), // Last 24 hours
      },
    },
    include: {
      member: {
        include: { profile: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return {
    systemState: {
      platform: "Multi-Workspace, Multi-Channel Chat Platform",
      timestamp: new Date().toISOString(),
    },
    channelContext: {
      activeChannels: activeChannels.map((c) => ({
        name: c.name,
        messageCount: c._count.messages,
      })),
    },
    userContext: {
      onlineUsers: [
        ...new Set(recentMessages.map((m) => m.member.profile.name)),
      ],
    },
    recentMessages: recentMessages.map((m) => ({
      content: m.content,
      author: m.member.profile.name,
      timestamp: m.createdAt,
      role: m.role,
    })),
  };
}

// Enhanced Site AI Orchestrator - coordinates with n8n and provides intelligent formatting
async function getSiteAIResponse(
  message: MessageWithMember, 
  context: any, 
  channelId: string,
  workflowRoute?: WorkflowRoute,
  workflowError?: string
): Promise<string> {
  try {
    console.log(`[SITE_AI_ORCHESTRATOR] Processing message: ${message.content.substring(0, 100)}`);
    
    // Get recent conversation history for context
    const conversationHistory = await db.message.findMany({
      where: {
        channelId,
        createdAt: {
          gte: new Date(Date.now() - 1000 * 60 * 60 * 2), // Last 2 hours
        },
      },
      include: {
        member: {
          include: { profile: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // Format conversation history
    const historyText = conversationHistory
      .reverse()
      .map(msg => `${msg.member.profile.name}: ${msg.content}`)
      .join('\n');

    // Determine if this was a workflow failure or direct site AI request
    const workflowFailed = workflowError || workflowRoute;
    const currentTime = new Date();
    const timeString = currentTime.toLocaleTimeString('en-US', { timeZone: 'America/New_York' });
    const dateString = currentTime.toISOString().split('T')[0];

    // Enhanced system prompt for Site AI Orchestrator
    const systemPrompt = `You are Kenneth's Enhanced Site AI Orchestrator for Discordant at discordant.kendev.co.

🎯 **Your Role**: Chief Intelligence Officer for National Registration Group
⏰ **Current Context**:
- Date: ${dateString}
- Time: ${timeString} Eastern
- Channel: ${context.channelContext?.activeChannels?.[0]?.name || 'general'}
- Online Users: ${context.userContext?.onlineUsers?.join(', ') || 'Kenneth Courtney'}

🛠️ **Available Capabilities**:
${workflowFailed ? `
🔄 **System Status**: Advanced n8n workflow temporarily unavailable
- Primary AI tools experiencing ${workflowError ? 'connectivity issues' : 'processing delays'}
- Operating in Site AI mode with full business intelligence capabilities
- Can still provide comprehensive analysis and recommendations
` : `
✅ **System Status**: All systems operational
- Full access to calendar management tools
- Message search and conversation analysis
- Real-time web research capabilities
- Business intelligence and strategic analysis
`}

📅 **Calendar Management**: Schedule, view, and manage meetings
🔍 **Message Search**: Find conversations and business discussions  
🌐 **Business Intelligence**: Market research and strategic analysis
💼 **Executive Support**: Data-driven recommendations and insights

🎯 **Response Guidelines**:
- Provide strategic business insights suitable for executive decision-making
- Be conversational and engaging with appropriate humor when requested
- Use professional formatting with clear action items
- Include relevant timestamps and context
- Format responses as proper system messages

${workflowFailed ? `
🔧 **Recovery Mode**: 
- Acknowledge any system limitations honestly
- Provide maximum value with available resources
- Suggest alternatives when primary tools unavailable
` : ''}

📊 **Recent Conversation Context**:
${historyText}

Remember: You serve as Kenneth's intelligent business assistant. Provide clear, actionable insights with professional presentation.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message.content }
      ],
      temperature: 0.3,
      max_tokens: 2000,
      stream: false,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error("No response received from Site AI");
    }

    // Format as system message with timestamp and status
    let formattedResponse = response;
    
    if (workflowFailed) {
      formattedResponse += `\n\n---\n🔄 **System Status**: Response generated by Site AI Orchestrator\n⏱️ **Response Time**: ${timeString}\n${workflowError ? `📊 **Note**: Advanced workflow tools temporarily unavailable - ${workflowError}` : ''}`;
    } else {
      formattedResponse += `\n\n---\n✅ **System Status**: Full capabilities operational\n⏱️ **Response Time**: ${timeString}`;
    }

    console.log(`[SITE_AI_ORCHESTRATOR] Generated response: ${formattedResponse.substring(0, 200)}...`);
    return formattedResponse;

  } catch (error) {
    console.error(`[SITE_AI_ORCHESTRATOR] Error:`, error);
    
    const currentTime = new Date();
    const timeString = currentTime.toLocaleTimeString('en-US', { timeZone: 'America/New_York' });
    
    return `🚨 **Site AI Orchestrator Alert**

I'm experiencing technical difficulties processing your request at this time.

**Your Message**: "${message.content}"
**Error Time**: ${timeString}
**Error Details**: ${error instanceof Error ? error.message : 'Unknown error'}

**Immediate Actions**:
1. **Retry** your request in 30 seconds
2. **Contact** system administrator if issue persists
3. **Alternative**: Use the chat test interface at /test-ai

**Status**: Both primary workflow and Site AI systems experiencing issues
**Expected Resolution**: Typically resolves within 2-3 minutes

---
🔧 **System ID**: Site-AI-Orchestrator
⏱️ **Error Time**: ${timeString}`;
  }
}

// --- Handlers ---

class OnboardingHandler implements SystemMessageHandler {
  canHandle(message: MessageWithMember) {
    return message.asIs === true;
  }
  async handle(message: MessageWithMember, { channelId, socketIo }: HandlerContext) {
    // asIs logic
    const systemMember = await fetchSystemMember(message.channelId);
    const systemMessage = await db.message.create({
      data: {
        id: randomUUID(),
        content: message.content,
        channelId,
        memberId: systemMember.id,
        role: "system",
        updatedAt: new Date(),
      },
      include: {
        member: { include: { profile: true } },
      },
    });
    const channelKey = `chat:${channelId}:messages`;
    socketIo?.emit(channelKey, systemMessage);
    return systemMessage;
  }
}

// Enhanced Workflow Handler with robust fallback mechanism
class WorkflowHandler implements SystemMessageHandler {
  canHandle(message: MessageWithMember) {
    // Handle all messages except onboarding
    return !message.asIs;
  }

  async handle(message: MessageWithMember, { channelId, serverId, socketIo, context }: HandlerContext) {
    // Determine which workflow should handle this message
    const route = WorkflowRouter.getWorkflowRoute(message.content);
    
    console.log(`[WORKFLOW_HANDLER] === PRODUCTION DEBUG ===`);
    console.log(`[WORKFLOW_HANDLER] Environment: ${process.env.NODE_ENV}`);
    console.log(`[WORKFLOW_HANDLER] App URL: ${process.env.NEXT_PUBLIC_APP_URL}`);
    console.log(`[WORKFLOW_HANDLER] N8N URL: ${process.env.N8N_WEBHOOK_URL}`);
    console.log(`[WORKFLOW_HANDLER] Channel ID: ${channelId}`);
    console.log(`[WORKFLOW_HANDLER] Server ID: ${serverId}`);
    console.log(`[WORKFLOW_HANDLER] Message content: ${message.content}`);
    console.log(`[WORKFLOW_HANDLER] Routing message to: ${route.workflowId}`);
    console.log(`[WORKFLOW_HANDLER] Webhook path: ${route.webhookPath}`);

    // Process message based on intent
    let processedMessage = message.content;
    const intent = WorkflowRouter.detectIntent(message.content);
    
    // Add date/time context for calendar-related messages
    if (intent === "calendar") {
      const calendarProcessed = CalendarCommandDetector.processCalendarMessage(message.content);
      processedMessage = calendarProcessed.processedMessage;
      console.log(`[WORKFLOW_HANDLER] Calendar message enhanced with date/time context`);
    }

    // Create the workflow payload
    const payload = WorkflowRouter.createWorkflowPayload(
      { ...message, content: processedMessage },
      route,
      channelId,
      serverId
    );

    // Get the webhook URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                   (process.env.NODE_ENV === 'production' ? "https://discordant.kendev.co" : "http://localhost:3000");
    const proxyUrl = `${baseUrl}/api/workflow`;
    
    console.log(`[WORKFLOW_HANDLER] Proxy URL: ${proxyUrl}`);
    console.log(`[WORKFLOW_HANDLER] Payload:`, JSON.stringify(payload, null, 2));
    
    let workflowResponse;
    let errorType = null;
    let usedFallback = false;

    // First, try the n8n workflow
    try {
      console.log(`[WORKFLOW_HANDLER] Attempting n8n workflow connection...`);
      console.log(`[WORKFLOW_HANDLER] Making fetch request to: ${proxyUrl}`);
      
      const res = await fetch(proxyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Workflow-Id": route.workflowId,
          "X-Webhook-Path": route.webhookPath,
          "User-Agent": "Discordant-Chat-App/1.0",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(60000), // 60 second timeout to match n8n workflow settings
      });

      console.log(`[WORKFLOW_HANDLER] Response status: ${res.status}`);
      console.log(`[WORKFLOW_HANDLER] Response headers:`, Object.fromEntries(res.headers.entries()));

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`[WORKFLOW_HANDLER] HTTP Error Response: ${errorText}`);
        throw new Error(`HTTP ${res.status}: ${res.statusText} - ${errorText}`);
      }

      workflowResponse = await res.json();
      console.log(`[WORKFLOW_HANDLER] ✅ n8n workflow response received:`, JSON.stringify(workflowResponse, null, 2));

    } catch (err) {
      console.error(`[WORKFLOW_HANDLER] ❌ n8n workflow failed, attempting OpenAI fallback:`, err);
      console.error(`[WORKFLOW_HANDLER] Error details:`, {
        name: err instanceof Error ? err.name : 'Unknown',
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : 'No stack trace'
      });
      
      // Fallback to OpenAI
      try {
        const fallbackResponse = await getSiteAIResponse(message, context, channelId, route, err instanceof Error ? err.message : undefined);
        workflowResponse = {
          content: fallbackResponse,
          output: fallbackResponse,
          message: fallbackResponse,
          metadata: {
            originalMessage: message.content,
            processedMessage: processedMessage,
            sessionId: payload.metadata.sessionId,
            platform: "site-ai-fallback",
            workflowId: "fallback-site-ai",
            intent: intent,
            responseTime: new Date().toISOString(),
            fallbackReason: err instanceof Error ? err.message : "Unknown error",
          },
        };
        usedFallback = true;
        errorType = "fallback_used";
        console.log(`[WORKFLOW_HANDLER] ✅ Site AI fallback successful`);
        
      } catch (fallbackErr) {
        console.error(`[WORKFLOW_HANDLER] ❌ Site AI fallback also failed:`, fallbackErr);
        errorType = "total_failure";
        workflowResponse = {
          message: `🚨 **System Status Alert**

Both the primary AI workflow system and the backup Site AI service are currently experiencing difficulties.

**Primary System Error:** ${err instanceof Error ? err.message : 'Connection failed'}
**Backup System Error:** ${fallbackErr instanceof Error ? fallbackErr.message : 'Unknown error'}

**Your message:** "${message.content}"

Please try again in a few minutes, or contact your system administrator if the issue persists.

**Environment:** ${process.env.NODE_ENV}
**Timestamp:** ${new Date().toISOString()}`,
          type: "system_error",
          timestamp: new Date().toISOString(),
          metadata: {
            originalMessage: message.content,
            processedMessage: processedMessage,
            sessionId: payload.metadata.sessionId,
            platform: "system-error",
            error: "total_system_failure",
            workflowId: route.workflowId,
            primaryError: err instanceof Error ? err.message : 'Unknown',
            fallbackError: fallbackErr instanceof Error ? fallbackErr.message : 'Unknown',
          },
        };
      }
    }

    // Format the response
    const systemContent = this.formatWorkflowResponse(workflowResponse, route, errorType, usedFallback);
    
    // Handle array response for metadata extraction
    let responseData = workflowResponse;
    if (Array.isArray(workflowResponse) && workflowResponse.length > 0) {
      responseData = workflowResponse[0];
    }
    
    const systemMetadata = responseData?.metadata || {
      originalMessage: message.content,
      processedMessage: processedMessage,
      sessionId: payload.metadata.sessionId,
      platform: usedFallback ? "site-ai-fallback" : "n8n-workflow",
      workflowId: usedFallback ? "fallback-site-ai" : route.workflowId,
      intent: intent,
      responseTime: new Date().toISOString(),
      usedFallback: usedFallback,
    };

    // Create system message
    const systemMember = await fetchSystemMember(channelId);
    const systemMessage = await db.message.create({
      data: {
        id: randomUUID(),
        content: systemContent,
        channelId,
        memberId: systemMember.id,
        role: "system",
        updatedAt: new Date(),
      },
      include: { member: { include: { profile: true } } },
    });

    // Emit to socket with workflow metadata
    const channelKey = `chat:${channelId}:messages`;
    
    // Debug logging for socket emission
    console.log(`[SYSTEM_MESSAGE] Emitting to channel key: ${channelKey}`);
    console.log(`[SYSTEM_MESSAGE] Socket IO available:`, !!socketIo);
    console.log(`[SYSTEM_MESSAGE] Message content length:`, systemContent.length);
    console.log(`[SYSTEM_MESSAGE] System message structure:`, {
      id: systemMessage.id,
      content: systemContent.substring(0, 100) + '...',
      channelId: systemMessage.channelId,
      memberId: systemMessage.memberId,
      role: systemMessage.role,
      member: !!systemMessage.member
    });

    // Emit message in the same format as regular messages to ensure compatibility
    const messageToEmit = {
      ...systemMessage,
      // Include metadata for debugging but don't modify the core message structure
      _systemMetadata: {
        messageType: usedFallback ? "fallback_response" : "workflow_response",
        workflowId: usedFallback ? "fallback-site-ai" : route.workflowId,
        intent: intent,
        metadata: systemMetadata,
        usedFallback: usedFallback,
      }
    };

    try {
      socketIo?.emit(channelKey, messageToEmit);
      console.log(`[SYSTEM_MESSAGE] ✅ Socket emission completed`);
    } catch (emitError) {
      console.error(`[SYSTEM_MESSAGE] ❌ Socket emission failed:`, emitError);
    }

    return systemMessage;
  }

  private formatWorkflowResponse(response: any, route: WorkflowRoute, errorType: string | null, usedFallback: boolean = false): string {
    console.log(`[FORMAT_WORKFLOW_RESPONSE] Starting format for workflow: ${route.workflowId}`);
    console.log(`[FORMAT_WORKFLOW_RESPONSE] Error type: ${errorType}`);
    console.log(`[FORMAT_WORKFLOW_RESPONSE] Used fallback: ${usedFallback}`);
    console.log(`[FORMAT_WORKFLOW_RESPONSE] Raw response type:`, typeof response);
    console.log(`[FORMAT_WORKFLOW_RESPONSE] Raw response:`, JSON.stringify(response, null, 2));

    if (errorType === "total_failure") {
      console.log(`[FORMAT_WORKFLOW_RESPONSE] Returning total failure message`);
      return response.message || `⚠️ ${route.description} service experiencing critical difficulties.`;
    }

    // Handle array response from n8n
    let responseData = response;
    if (Array.isArray(response) && response.length > 0) {
      responseData = response[0];
      console.log(`[FORMAT_WORKFLOW_RESPONSE] Using first item from array response`);
    }

    // Extract message from the response data - check multiple possible fields
    let message = responseData?.message || 
                  responseData?.formattedMessage || 
                  responseData?.text || 
                  responseData?.content || 
                  responseData?.output ||
                  responseData?.data?.message ||
                  responseData?.data?.content ||
                  responseData?.data?.output;

    console.log(`[FORMAT_WORKFLOW_RESPONSE] Extracted message from field check:`, message ? message.substring(0, 100) + '...' : 'null');

    // If message is still not found, check if the whole response is a string
    if (!message && typeof responseData === 'string') {
      message = responseData;
      console.log(`[FORMAT_WORKFLOW_RESPONSE] Using entire response as string`);
    }

    // Debug logging to see what we're getting
    console.log(`[WORKFLOW_HANDLER] Raw response:`, JSON.stringify(response, null, 2));
    console.log(`[WORKFLOW_HANDLER] Extracted message:`, message);

    // If no message found, provide helpful debug info
    if (!message || message === "No calendar data available.") {
      console.log(`[WORKFLOW_HANDLER] Response structure:`, {
        isArray: Array.isArray(response),
        responseType: typeof response,
        keys: response ? Object.keys(response) : [],
        dataKeys: responseData ? Object.keys(responseData) : []
      });
      
      // Check if this is a "no data" response from calendar
      if (route.workflowId === "calendar-assistant" && (!message || message === "No calendar data available.")) {
        message = "I couldn't find any calendar events for that time period. Try checking a different date range or creating a new event.";
        console.log(`[FORMAT_WORKFLOW_RESPONSE] Generated calendar fallback message`);
      } else {
        message = `I received your request but couldn't process the response properly. Please check the logs for details.`;
        console.log(`[FORMAT_WORKFLOW_RESPONSE] Generated generic fallback message`);
      }
    }

    console.log(`[FORMAT_WORKFLOW_RESPONSE] Final message length:`, message ? message.length : 0);

    // NOTE: Long messages are now handled by frontend "Show More" component
    // No longer truncating messages here - let the frontend handle display gracefully
    // if (message && typeof message === 'string' && message.length > 2000) {
    //   message = message.substring(0, 1900) + '...\n\n*Response truncated for display*';
    // }

    // Add fallback indicator if used
    if (usedFallback && errorType === "fallback_used") {
      // Don't add extra fallback indicator - Site AI Orchestrator includes its own status footer
      // message = `🔄 ${message}\n\n*Note: Response generated using backup AI system*`;
      console.log(`[FORMAT_WORKFLOW_RESPONSE] Fallback used, Site AI status included`);
    }

    // Return message without military-style prefixes - just clean, professional responses
    const finalMessage = message.trim();
    console.log(`[FORMAT_WORKFLOW_RESPONSE] Returning final message: ${finalMessage.substring(0, 100)}...`);
    return finalMessage;
  }
}

// Legacy handlers for specific use cases (can be removed if all handled by workflows)
class ImageAnalysisHandler implements SystemMessageHandler {
  canHandle(message: MessageWithMember) {
    return !!message.fileUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  }
  async handle(message: MessageWithMember, { channelId, socketIo }: HandlerContext) {
    const analysis = await analyzeImage(message.fileUrl!, message.content || "");
    if (!analysis) throw new Error("Image analysis failed");
    const parsedAnalysis = JSON.parse(analysis);
    const workflowContent: WorkflowContent = {
      type: "workflow",
      originalPrompt: message.content,
      analysis: parsedAnalysis,
      workflow: determineWorkflow(parsedAnalysis.categories, message.fileUrl!),
    };
    const updatedMessage = await db.message.update({
      where: { id: message.id },
      data: { content: JSON.stringify(workflowContent) },
      include: { member: { include: { profile: true } } },
    });
    const channelKey = `chat:${channelId}:messages`;
    socketIo?.emit(channelKey, { ...updatedMessage, action: "update" });
    return updatedMessage;
  }
}

export async function createSystemMessage(
  channelId: string,
  message: MessageWithMember,
  socketIo?: any
) {
  const context = await getSystemContext(channelId);
  
  // Get serverId for workflow routing
  const channel = await db.channel.findUnique({
    where: { id: channelId },
    select: { serverId: true },
  });

  const handlers = [
    new OnboardingHandler(),
    new WorkflowHandler(), // This now handles all non-onboarding messages
    // ImageAnalysisHandler can be kept for local image processing or moved to workflow
  ];

  for (const handler of handlers) {
    if (handler.canHandle(message)) {
      return await handler.handle(message, { 
        channelId, 
        serverId: channel?.serverId,
        socketIo, 
        context 
      });
    }
  }

  return null;
}
