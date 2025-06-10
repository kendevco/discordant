import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticateWithFallback } from "@/lib/api-auth";
import { MessageRole } from "@prisma/client";
import { randomUUID } from "crypto";
import { externalSocketService } from "@/lib/socket-service";

interface N8nWebhookRequest {
  // Standard n8n workflow data
  message?: string;
  userId?: string;
  channelId?: string;
  userName?: string;
  serverId?: string;
  
  // Enhanced external integration data
  externalMessageId?: string;
  responseType?: "channel" | "conversation" | "webhook";
  
  // Agent response data
  agentResponse?: {
    content: string;
    type: "text" | "markdown" | "html";
    metadata?: Record<string, any>;
  };
  
  // Workflow metadata
  workflowId?: string;
  workflowName?: string;
  executionId?: string;
  processingTime?: number;
  
  // Response routing
  callbackUrl?: string;
  notificationTargets?: string[];
}

export async function POST(req: NextRequest) {
  try {
    // Authenticate with fallback (API token or regular user auth)
    const authResult = await authenticateWithFallback(req);
    if (!authResult.success || !authResult.profile) {
      return new NextResponse(authResult.error || "Unauthorized", { 
        status: authResult.statusCode || 401 
      });
    }

    const profile = authResult.profile;
    const body: N8nWebhookRequest = await req.json();

    console.log("[N8N_WEBHOOK] Received request:", {
      externalMessageId: body.externalMessageId,
      channelId: body.channelId,
      responseType: body.responseType,
      workflowId: body.workflowId,
      hasAgentResponse: !!body.agentResponse
    });

    // Handle different types of n8n responses
    if (body.externalMessageId) {
      // This is a response to an external message
      return await handleExternalMessageResponse(body, profile.id);
    } else if (body.channelId && body.agentResponse) {
      // Direct channel message from n8n workflow
      return await handleDirectChannelMessage(body, profile.id);
    } else if (body.callbackUrl) {
      // Webhook callback response
      return await handleWebhookCallback(body);
    } else {
      return new NextResponse("Invalid webhook payload", { status: 400 });
    }

  } catch (error) {
    console.error("[N8N_WEBHOOK_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

async function handleExternalMessageResponse(
  body: N8nWebhookRequest,
  profileId: string
): Promise<NextResponse> {
  if (!body.externalMessageId || !body.agentResponse) {
    return new NextResponse("externalMessageId and agentResponse required", { status: 400 });
  }

  try {
    // Find the external message
    const externalMessage = await db.externalMessage.findUnique({
      where: { id: body.externalMessageId },
      include: {
        apiToken: {
          include: {
            agentProfile: true
          }
        }
      }
    });

    if (!externalMessage) {
      return new NextResponse("External message not found", { status: 404 });
    }

    // Determine response target
    let responseMessage;
    let channelKey;

    if (externalMessage.channelId) {
      // Respond in channel
      const channel = await db.channel.findUnique({
        where: { id: externalMessage.channelId },
        include: { server: true }
      });

      if (!channel) {
        return new NextResponse("Channel not found", { status: 404 });
      }

      // Find agent member in server
      const agentProfile = externalMessage.apiToken.agentProfile;
      let memberToUse;

      if (agentProfile) {
        memberToUse = await db.member.findFirst({
          where: {
            profileId: agentProfile.profileId,
            serverId: channel.serverId
          }
        });
      }

      if (!memberToUse) {
        // Use the token owner's member
        memberToUse = await db.member.findFirst({
          where: {
            profileId: profileId,
            serverId: channel.serverId
          }
        });
      }

      if (!memberToUse) {
        return new NextResponse("No valid member found for response", { status: 400 });
      }

      // Create response message
      responseMessage = await db.message.create({
        data: {
          id: randomUUID(),
          content: body.agentResponse.content,
          channelId: externalMessage.channelId,
          memberId: memberToUse.id,
          role: MessageRole.system,
          createdAt: new Date(),
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

      channelKey = `chat:${externalMessage.channelId}:messages`;

    } else if (externalMessage.conversationId) {
      // Respond in conversation
      const conversation = await db.conversation.findUnique({
        where: { id: externalMessage.conversationId }
      });

      if (!conversation) {
        return new NextResponse("Conversation not found", { status: 404 });
      }

      // Use the agent or token owner for response
      const agentProfile = externalMessage.apiToken.agentProfile;
      let memberToUse;

      if (agentProfile) {
        memberToUse = await db.member.findFirst({
          where: {
            profileId: agentProfile.profileId,
            OR: [
              { id: conversation.memberOneId },
              { id: conversation.memberTwoId }
            ]
          }
        });
      }

      if (!memberToUse) {
        memberToUse = await db.member.findFirst({
          where: {
            profileId: profileId,
            OR: [
              { id: conversation.memberOneId },
              { id: conversation.memberTwoId }
            ]
          }
        });
      }

      if (!memberToUse) {
        return new NextResponse("No valid member found for conversation response", { status: 400 });
      }

      // Create direct message response
      responseMessage = await db.directMessage.create({
        data: {
          id: randomUUID(),
          content: body.agentResponse.content,
          conversationId: externalMessage.conversationId,
          memberId: memberToUse.id,
          createdAt: new Date(),
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

      channelKey = `conversation:${externalMessage.conversationId}:messages`;
    }

    // Update agent activity if applicable
    if (externalMessage.apiToken.agentProfile) {
      await db.agentProfile.update({
        where: { id: externalMessage.apiToken.agentProfile.id },
        data: {
          lastActive: new Date(),
          messageCount: { increment: 1 }
        }
      });
    }

    // Log workflow execution
    await logWorkflowExecution(body, externalMessage.id, responseMessage?.id);

    // Emit to socket for real-time updates
    if (channelKey && responseMessage) {
      if ('channelId' in responseMessage) {
        // This is a Message (channel message)
        externalSocketService.emitChannelMessage(responseMessage.channelId, {
          id: responseMessage.id,
          content: responseMessage.content,
          channelId: responseMessage.channelId,
          member: {
            ...responseMessage.member,
            profile: {
              ...responseMessage.member.profile,
              imageUrl: responseMessage.member.profile.imageUrl || undefined
            }
          },
          role: responseMessage.role,
          createdAt: responseMessage.createdAt,
          updatedAt: responseMessage.updatedAt,
          fileUrl: responseMessage.fileUrl || undefined,
          _external: true,
          _sourceType: 'n8n-workflow',
          _forceUpdate: true
        });
      } else {
        // This is a DirectMessage (conversation message)
        externalSocketService.emitDirectMessage(responseMessage.conversationId, {
          id: responseMessage.id,
          content: responseMessage.content,
          conversationId: responseMessage.conversationId,
          member: {
            ...responseMessage.member,
            profile: {
              ...responseMessage.member.profile,
              imageUrl: responseMessage.member.profile.imageUrl || undefined
            }
          },
          role: MessageRole.system,
          createdAt: responseMessage.createdAt,
          updatedAt: responseMessage.updatedAt,
          fileUrl: responseMessage.fileUrl || undefined,
          _external: true,
          _sourceType: 'n8n-workflow',
          _forceUpdate: true
        });
      }

      // Emit workflow completion event
      externalSocketService.emitWorkflowExecution({
        workflowId: body.workflowId || 'unknown',
        executionId: body.executionId || randomUUID(),
        status: 'completed',
        externalMessageId: body.externalMessageId,
        responseMessageId: responseMessage.id,
        processingTime: body.processingTime
      });

      // Emit portfolio notification for AI response
      if (externalMessage.visitorData) {
        const visitorData = JSON.parse(externalMessage.visitorData);
        externalSocketService.emitPortfolioNotification({
          type: 'ai-response',
          title: 'AI Response Ready',
          message: body.agentResponse.content.slice(0, 100) + '...',
          sessionId: visitorData.sessionId,
          channelId: 'channelId' in responseMessage ? responseMessage.channelId : undefined,
          messageId: responseMessage.id,
          metadata: {
            workflowId: body.workflowId,
            executionId: body.executionId,
            processingTime: body.processingTime,
            conversationId: 'conversationId' in responseMessage ? responseMessage.conversationId : undefined
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      externalMessageId: body.externalMessageId,
      responseMessageId: responseMessage?.id,
      channelKey,
      workflowExecuted: true
    });

  } catch (error) {
    console.error("[EXTERNAL_MESSAGE_RESPONSE_ERROR]", error);
    return new NextResponse("Failed to process external message response", { status: 500 });
  }
}

async function handleDirectChannelMessage(
  body: N8nWebhookRequest,
  profileId: string
): Promise<NextResponse> {
  if (!body.channelId || !body.agentResponse) {
    return new NextResponse("channelId and agentResponse required", { status: 400 });
  }

  try {
    // Verify channel access
    const channel = await db.channel.findFirst({
      where: {
        id: body.channelId,
        server: {
          members: {
            some: {
              profileId: profileId
            }
          }
        }
      },
      include: { server: true }
    });

    if (!channel) {
      return new NextResponse("Channel not found or access denied", { status: 404 });
    }

    // Find member to send as
    const member = await db.member.findFirst({
      where: {
        profileId: profileId,
        serverId: channel.serverId
      }
    });

    if (!member) {
      return new NextResponse("Member not found in server", { status: 404 });
    }

    // Create message
    const message = await db.message.create({
      data: {
        id: randomUUID(),
        content: body.agentResponse.content,
        channelId: body.channelId,
        memberId: member.id,
        role: MessageRole.system,
        createdAt: new Date(),
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

    // Log workflow execution
    await logWorkflowExecution(body, undefined, message.id);

    // Emit to socket for real-time updates
    externalSocketService.emitChannelMessage(body.channelId, {
      id: message.id,
      content: message.content,
      channelId: body.channelId,
      member: {
        ...message.member,
        profile: {
          ...message.member.profile,
          imageUrl: message.member.profile.imageUrl || undefined
        }
      },
      role: message.role,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      fileUrl: message.fileUrl || undefined,
      _external: true,
      _sourceType: 'n8n-direct',
      _forceUpdate: true
    });

    // Emit workflow execution event
    externalSocketService.emitWorkflowExecution({
      workflowId: body.workflowId || 'unknown',
      executionId: body.executionId || randomUUID(),
      status: 'completed',
      responseMessageId: message.id,
      processingTime: body.processingTime
    });

    return NextResponse.json({
      success: true,
      messageId: message.id,
      channelId: body.channelId,
      workflowExecuted: true
    });

  } catch (error) {
    console.error("[DIRECT_CHANNEL_MESSAGE_ERROR]", error);
    return new NextResponse("Failed to send direct channel message", { status: 500 });
  }
}

async function handleWebhookCallback(
  body: N8nWebhookRequest
): Promise<NextResponse> {
  if (!body.callbackUrl) {
    return new NextResponse("callbackUrl required", { status: 400 });
  }

  try {
    // Send callback to external URL
    const response = await fetch(body.callbackUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Discordant-N8N-Webhook/1.0"
      },
      body: JSON.stringify({
        success: true,
        workflowId: body.workflowId,
        executionId: body.executionId,
        processingTime: body.processingTime,
        response: body.agentResponse,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      console.error("[WEBHOOK_CALLBACK_ERROR]", `Failed to send callback: ${response.status}`);
    }

    return NextResponse.json({
      success: true,
      callbackSent: response.ok,
      callbackStatus: response.status
    });

  } catch (error) {
    console.error("[WEBHOOK_CALLBACK_ERROR]", error);
    return NextResponse.json({
      success: true,
      callbackSent: false,
      error: "Failed to send callback"
    });
  }
}

async function logWorkflowExecution(
  body: N8nWebhookRequest,
  externalMessageId?: string,
  responseMessageId?: string
) {
  try {
    // This would integrate with a workflow execution log table
    // For now, just console log
    console.log("[N8N_WORKFLOW_EXECUTION]", {
      workflowId: body.workflowId,
      workflowName: body.workflowName,
      executionId: body.executionId,
      processingTime: body.processingTime,
      externalMessageId,
      responseMessageId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("[WORKFLOW_LOG_ERROR]", error);
  }
}

// GET endpoint for webhook status/health check
export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    webhook: "n8n-integration",
    version: "1.0",
    timestamp: new Date().toISOString(),
    capabilities: [
      "external-message-responses",
      "direct-channel-messages", 
      "webhook-callbacks",
      "agent-impersonation",
      "workflow-logging"
    ]
  });
} 