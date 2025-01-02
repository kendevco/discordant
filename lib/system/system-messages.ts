import { db } from "@/lib/db";
import { Message, Profile } from "@prisma/client";
import { analyzeImage } from "./image-analysis";
import { randomUUID } from "crypto";
import { getAIResponse } from "./ai-interface";
import { WorkflowContent } from "./types/message-content";
import { determineWorkflow } from "./workflow-utils";

const SYSTEM_USER_ID = process.env.SYSTEM_USER_ID || "system-user-9000";

interface MessageWithMember extends Message {
  member: {
    profile: Profile;
  };
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
  };
}

export async function createSystemMessage(
  channelId: string,
  message: MessageWithMember,
  socketIo?: any
) {
  try {
    const systemMember = await fetchSystemMember(message.channelId);
    const context = await getSystemContext(channelId);

    console.log("[SYSTEM_MESSAGE] Processing message:", {
      channelId,
      messageId: message.id,
      fileUrl: message.fileUrl,
    });

    if (message.fileUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      console.log("[SYSTEM_MESSAGE] Processing image");
      const analysis = await analyzeImage(
        message.fileUrl,
        message.content || ""
      );

      if (!analysis) {
        console.error("[SYSTEM_MESSAGE] Image analysis failed");
        throw new Error("Image analysis failed");
      }

      console.log("[SYSTEM_MESSAGE] Analysis result:", analysis);
      const parsedAnalysis = JSON.parse(analysis);

      const workflowContent: WorkflowContent = {
        type: "workflow",
        originalPrompt: message.content,
        analysis: parsedAnalysis,
        workflow: determineWorkflow(parsedAnalysis.categories, message.fileUrl),
      };

      const updatedMessage = await db.message.update({
        where: { id: message.id },
        data: {
          content: JSON.stringify(workflowContent),
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });

      // Emit the updated message to all clients
      const channelKey = `chat:${channelId}:messages`;
      socketIo?.emit(channelKey, {
        ...updatedMessage,
        action: "update", // Add action to help clients handle the update
      });

      console.log("[SYSTEM_MESSAGE] Updated message:", updatedMessage);
      return updatedMessage;
    }

    // Handle regular messages
    const response = await getAIResponse(message.content, context);

    const systemMessage = await db.message.create({
      data: {
        id: randomUUID(),
        content: response,
        channelId,
        memberId: systemMember.id,
        role: "system",
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

    const channelKey = `chat:${channelId}:messages`;
    socketIo?.emit(channelKey, systemMessage);

    return systemMessage;
  } catch (error) {
    console.error("[SYSTEM_MESSAGE_ERROR]", error);
    throw error;
  }
}
