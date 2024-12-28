import { db } from "@/lib/db";
import { Message, Profile } from "@prisma/client";
import { analyzeImage } from "./image-analysis";
import { socketHelper } from "@/lib/system/socket";
import { randomUUID } from "crypto";
import { getAIResponse } from "./ai-interface";
import { ImageAnalysis, AnalysisResult } from "./types/analysis";

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
            gte: new Date(Date.now() - 1000 * 60 * 60), // Last hour
          },
        },
      },
    },
    include: {
      _count: {
        select: { messages: true },
      },
    },
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
      platform: "Discord-like Chat Platform",
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
  message: MessageWithMember
) {
  try {
    const systemMember = await fetchSystemMember(message.channelId);

    // If it's an image, just store the analysis
    if (message.fileUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      const analysisResult = (await analyzeImage(
        message.fileUrl,
        message.content || "Analyze this image"
      )) as AnalysisResult;

      const content =
        typeof analysisResult === "string"
          ? { type: "image_analysis", summary: analysisResult }
          : {
              type: "image_analysis",
              ...analysisResult,
            };

      const systemMessage = await db.message.create({
        data: {
          id: randomUUID(),
          content: JSON.stringify(content),
          fileUrl: message.fileUrl,
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

      socketHelper.sendMessage(channelId, systemMessage);
      return systemMessage;
    }

    // For text messages, get context and generate LCARS response
    const context = await getSystemContext(channelId);
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

    socketHelper.sendMessage(channelId, systemMessage);
    return systemMessage;
  } catch (error) {
    console.error("[SYSTEM_MESSAGE_ERROR]", error);
    throw error;
  }
}

export async function analyzeAndUpdateMessage(messageId: string) {
  const message = await db.message.findUnique({
    where: { id: messageId },
    include: {
      member: {
        include: {
          profile: true,
        },
      },
    },
  });

  if (!message?.fileUrl) return null;

  const analysisResult = (await analyzeImage(
    message.fileUrl,
    message.content || "Analyze this image"
  )) as AnalysisResult;

  const content =
    typeof analysisResult === "string"
      ? { type: "image_analysis", summary: analysisResult }
      : { type: "image_analysis", ...analysisResult };

  return db.message.update({
    where: { id: messageId },
    data: { content: JSON.stringify(content) },
    include: {
      member: {
        include: {
          profile: true,
        },
      },
    },
  });
}
