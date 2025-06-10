import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticateApiRequest, validateChannelAccess, getOrCreateAgentProfile } from "@/lib/api-auth";
import { MessageRole } from "@prisma/client";
import { randomUUID } from "crypto";
import { externalSocketService } from "@/lib/socket-service";

interface ExternalMessageRequest {
  channelId?: string;
  conversationId?: string;
  content: string;
  sourceType: string;
  sourceId?: string;
  visitorData?: {
    sessionId?: string;
    email?: string;
    name?: string;
    metadata?: Record<string, any>;
  };
  agentData?: {
    displayName?: string;
    avatarUrl?: string;
    description?: string;
  };
  impersonateUser?: string; // Profile ID to send message as
}

export async function POST(req: NextRequest) {
  try {
    // Authenticate API request
    const authResult = await authenticateApiRequest(req);
    if (!authResult.success || !authResult.token) {
      return new NextResponse(authResult.error, { 
        status: authResult.statusCode || 401 
      });
    }

    const token = authResult.token;
    const body: ExternalMessageRequest = await req.json();

    // Validate required fields
    if (!body.content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    if (!body.channelId && !body.conversationId) {
      return new NextResponse("Either channelId or conversationId is required", { status: 400 });
    }

    if (!body.sourceType) {
      return new NextResponse("sourceType is required", { status: 400 });
    }

    // Store the external message for processing
    const externalMessage = await db.externalMessage.create({
      data: {
        id: randomUUID(),
        apiTokenId: token.id,
        content: body.content,
        channelId: body.channelId,
        conversationId: body.conversationId,
        sourceType: body.sourceType,
        sourceId: body.sourceId,
        visitorData: body.visitorData ? JSON.stringify(body.visitorData) : null,
        ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
        userAgent: req.headers.get("user-agent"),
        referrer: req.headers.get("referer"),
        sessionData: JSON.stringify({
          timestamp: new Date().toISOString(),
          headers: Object.fromEntries(req.headers.entries())
        }),
        processed: false
      }
    });

    // Process the message immediately
    const result = await processExternalMessage(externalMessage.id, token, body);

    if (result.success) {
      return NextResponse.json({
        success: true,
        externalMessageId: externalMessage.id,
        messageId: result.messageId,
        directMessageId: result.directMessageId,
        channelId: body.channelId,
        conversationId: body.conversationId
      });
    } else {
      return new NextResponse(result.error || "Failed to process message", { 
        status: 500 
      });
    }

  } catch (error) {
    console.error("[EXTERNAL_MESSAGES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

async function processExternalMessage(
  externalMessageId: string,
  token: any,
  body: ExternalMessageRequest
): Promise<{
  success: boolean;
  messageId?: string;
  directMessageId?: string;
  error?: string;
}> {
  try {
    const externalMessage = await db.externalMessage.findUnique({
      where: { id: externalMessageId }
    });

    if (!externalMessage) {
      return { success: false, error: "External message not found" };
    }

    // Determine which profile to send message as
    let senderProfileId = token.profileId;
    
    if (body.impersonateUser && token.agentProfile?.canImpersonate) {
      // Validate impersonation target exists
      const targetProfile = await db.profile.findUnique({
        where: { id: body.impersonateUser }
      });
      if (targetProfile) {
        senderProfileId = body.impersonateUser;
      }
    }

    // Handle visitor sessions for anonymous users
    if (body.visitorData?.sessionId && body.visitorData?.email) {
      await createOrUpdateVisitorSession(body.visitorData, body.channelId, body.conversationId);
    }

    if (body.channelId) {
      // Channel message
      const channelAccess = await validateChannelAccess(token, body.channelId);
      if (!channelAccess) {
        await markExternalMessageError(externalMessageId, "No access to channel");
        return { success: false, error: "No access to channel" };
      }

      // Find member for this profile in the channel's server
      const channel = await db.channel.findUnique({
        where: { id: body.channelId },
        include: { server: true }
      });

      if (!channel) {
        await markExternalMessageError(externalMessageId, "Channel not found");
        return { success: false, error: "Channel not found" };
      }

      const member = await db.member.findFirst({
        where: {
          profileId: senderProfileId,
          serverId: channel.serverId
        }
      });

      if (!member) {
        await markExternalMessageError(externalMessageId, "Not a member of this server");
        return { success: false, error: "Not a member of this server" };
      }

      // Create message
      const message = await db.message.create({
        data: {
          id: randomUUID(),
          content: body.content,
          channelId: body.channelId,
          memberId: member.id,
          role: MessageRole.user,
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

      // Mark external message as processed
      await db.externalMessage.update({
        where: { id: externalMessageId },
        data: {
          processed: true,
          messageId: message.id,
          processedAt: new Date()
        }
      });

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
        _sourceType: body.sourceType,
        _forceUpdate: true
      });

      // Emit visitor activity if applicable
      if (body.visitorData?.sessionId) {
        externalSocketService.emitVisitorActivity(body.visitorData.sessionId, {
          type: 'message-sent',
          data: {
            messageId: message.id,
            content: body.content.slice(0, 100),
            sourceType: body.sourceType
          },
          channelId: body.channelId
        });
      }

      // Emit portfolio notification
      externalSocketService.emitPortfolioNotification({
        type: 'contact-form',
        title: 'New External Message',
        message: `Message from ${body.sourceType}`,
        sessionId: body.visitorData?.sessionId,
        channelId: body.channelId,
        messageId: message.id,
        metadata: {
          sourceType: body.sourceType,
          visitorData: body.visitorData
        }
      });

      return { success: true, messageId: message.id };

    } else if (body.conversationId) {
      // Direct message
      const conversation = await db.conversation.findUnique({
        where: { id: body.conversationId },
        include: {
          memberOne: true,
          memberTwo: true
        }
      });

      if (!conversation) {
        await markExternalMessageError(externalMessageId, "Conversation not found");
        return { success: false, error: "Conversation not found" };
      }

      // Verify sender is part of conversation
      const senderMember = await db.member.findFirst({
        where: {
          profileId: senderProfileId,
          OR: [
            { id: conversation.memberOneId },
            { id: conversation.memberTwoId }
          ]
        }
      });

      if (!senderMember) {
        await markExternalMessageError(externalMessageId, "Not part of this conversation");
        return { success: false, error: "Not part of this conversation" };
      }

      // Create direct message
      const directMessage = await db.directMessage.create({
        data: {
          id: randomUUID(),
          content: body.content,
          conversationId: body.conversationId,
          memberId: senderMember.id,
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

      // Mark external message as processed
      await db.externalMessage.update({
        where: { id: externalMessageId },
        data: {
          processed: true,
          directMessageId: directMessage.id,
          processedAt: new Date()
        }
      });

      // Emit to socket for real-time updates
      externalSocketService.emitDirectMessage(body.conversationId, {
        id: directMessage.id,
        content: directMessage.content,
        conversationId: body.conversationId,
        member: {
          ...directMessage.member,
          profile: {
            ...directMessage.member.profile,
            imageUrl: directMessage.member.profile.imageUrl || undefined
          }
        },
        role: MessageRole.user,
        createdAt: directMessage.createdAt,
        updatedAt: directMessage.updatedAt,
        fileUrl: directMessage.fileUrl || undefined,
        _external: true,
        _sourceType: body.sourceType,
        _forceUpdate: true
      });

      // Emit visitor activity if applicable
      if (body.visitorData?.sessionId) {
        externalSocketService.emitVisitorActivity(body.visitorData.sessionId, {
          type: 'direct-message-sent',
          data: {
            messageId: directMessage.id,
            content: body.content.slice(0, 100),
            sourceType: body.sourceType
          },
          conversationId: body.conversationId
        });
      }

      return { success: true, directMessageId: directMessage.id };
    }

    return { success: false, error: "Invalid target" };

  } catch (error) {
    console.error("[PROCESS_EXTERNAL_MESSAGE_ERROR]", error);
    await markExternalMessageError(externalMessageId, error instanceof Error ? error.message : "Unknown error");
    return { success: false, error: "Processing failed" };
  }
}

async function markExternalMessageError(externalMessageId: string, error: string) {
  await db.externalMessage.update({
    where: { id: externalMessageId },
    data: {
      processed: true,
      error: error,
      processedAt: new Date()
    }
  });
}

async function createOrUpdateVisitorSession(
  visitorData: NonNullable<ExternalMessageRequest['visitorData']>,
  channelId?: string,
  conversationId?: string
) {
  if (!visitorData.sessionId) return;

  await db.visitorSession.upsert({
    where: { sessionId: visitorData.sessionId },
    update: {
      lastActivity: new Date(),
      messagesCount: { increment: 1 },
      email: visitorData.email || undefined,
      name: visitorData.name || undefined,
      customData: visitorData.metadata ? JSON.stringify(visitorData.metadata) : undefined,
      channelId: channelId,
      conversationId: conversationId
    },
    create: {
      sessionId: visitorData.sessionId,
      email: visitorData.email,
      name: visitorData.name,
      origin: visitorData.metadata?.origin || "unknown",
      messagesCount: 1,
      customData: visitorData.metadata ? JSON.stringify(visitorData.metadata) : undefined,
      channelId: channelId,
      conversationId: conversationId,
      isActive: true
    }
  });
}

// GET endpoint for checking API status
export async function GET(req: NextRequest) {
  const authResult = await authenticateApiRequest(req);
  
  if (!authResult.success) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  return NextResponse.json({
    success: true,
    tokenType: authResult.token?.type,
    tokenName: authResult.token?.name,
    hasAgentProfile: !!authResult.token?.agentProfile,
    permissions: authResult.token?.permissions ? JSON.parse(authResult.token.permissions) : {},
    rateLimit: {
      limit: authResult.token?.rateLimit,
      window: authResult.token?.rateLimitWindow
    }
  });
} 