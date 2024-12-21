import { db } from "@/lib/db";
import { analyzeMessage } from "./message-analysis";
import { Message } from "@prisma/client";
import { analyzeImage } from "./image-analysis";
import { track } from "@vercel/analytics/server";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";

const SYSTEM_USER_ID = process.env.SYSTEM_USER_ID || "system-user-9000";
const SYSTEM_USER_NAME = process.env.SYSTEM_USER_NAME || "System User";
const SYSTEM_USER_IMAGE =
  process.env.SYSTEM_USER_IMAGE || "/SystemAvatarNuke.png";
const SYSTEM_USER_EMAIL = process.env.SYSTEM_USER_EMAIL || "ai@example.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SYSTEM_OWNERS = ["Kenneth Courtney", "Tyler Suzanne"];

interface MessageContext {
  content: string;
  timestamp: string;
  channelName?: string;
  author: string;
  isCurrentThread: boolean;
}

async function fetchSystemUser() {
  return db.profile.upsert({
    where: { id: SYSTEM_USER_ID },
    update: {},
    create: {
      id: SYSTEM_USER_ID,
      userId: SYSTEM_USER_ID,
      name: SYSTEM_USER_NAME,
      imageUrl: SYSTEM_USER_IMAGE,
      email: SYSTEM_USER_EMAIL,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

async function fetchOrCreateSystemMember(
  systemUserId: string,
  serverId: string
) {
  const member = await db.member.findFirst({
    where: { profileId: systemUserId, serverId },
  });

  if (member) return member;

  return db.member.create({
    data: {
      id: uuidv4(),
      profileId: systemUserId,
      serverId,
      role: "GUEST",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

async function fetchPreviousMessages(channelId: string) {
  try {
    const currentChannel = await db.channel.findUnique({
      where: { id: channelId },
      select: { name: true },
    });

    // Reduce the number of messages fetched to prevent context overflow
    const otherChannelsMessages = await db.message.findMany({
      where: {
        channelId: { not: channelId },
        NOT: { content: { startsWith: "/noask" } },
      },
      orderBy: { createdAt: "desc" },
      take: 5, // Reduced from 10
      include: {
        member: {
          include: { profile: true },
        },
        channel: {
          select: { name: true },
        },
      },
    });

    const currentChannelMessages = await db.message.findMany({
      where: {
        channelId,
        NOT: { content: { startsWith: "/noask" } },
      },
      orderBy: { createdAt: "desc" },
      take: 10, // Reduced from 20
      include: {
        member: {
          include: { profile: true },
        },
      },
    });

    // Format messages with context and limit content size
    const formatMessage = (
      msg: any,
      isCurrentThread: boolean,
      channelName?: string
    ): MessageContext => ({
      content: msg.content.slice(0, 500), // Limit content size
      timestamp: format(new Date(msg.createdAt), "PPpp"),
      channelName: channelName || currentChannel?.name,
      author: msg.member.profile.name,
      isCurrentThread,
    });

    const otherChannelsFormatted = otherChannelsMessages
      .map((msg) => formatMessage(msg, false, msg.channel.name))
      .reverse();

    const currentChannelFormatted = currentChannelMessages
      .map((msg) => formatMessage(msg, true))
      .reverse();

    return {
      allMessages: [...otherChannelsFormatted, ...currentChannelFormatted],
      currentThreadMessages: currentChannelFormatted,
      systemOwners: SYSTEM_OWNERS,
    };
  } catch (error) {
    console.error("Error fetching previous messages:", error);
    return {
      allMessages: [],
      currentThreadMessages: [],
      systemOwners: SYSTEM_OWNERS,
    };
  }
}

async function broadcastSystemMessage(channelId: string, message: any) {
  try {
    await fetch(`${SITE_URL}/api/messages/broadcast`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelId, message, type: "system" }),
    });
  } catch (error) {
    console.error("Error broadcasting system message:", error);
    // Don't throw - broadcasting failure shouldn't fail the whole operation
  }
}

export async function createSystemMessage(
  channelId: string,
  content: string,
  fileUrl?: string | null
) {
  console.log("Creating system message for channel:", channelId);
  console.log("Initial content:", content);
  console.log("File URL provided:", fileUrl);

  try {
    const analyzedContent = content.startsWith("/ask")
      ? content.slice(5).trim()
      : content;

    // Limit content size
    const truncatedContent = analyzedContent.slice(0, 2000);
    const shouldAnalyze = !content.startsWith("/noask");

    // Fetch system user and related data
    const systemUser = await fetchSystemUser();
    console.log("System user retrieved or created:", systemUser);

    const channel = await db.channel.findUnique({
      where: { id: channelId },
      select: { serverId: true, name: true },
    });

    if (!channel) {
      throw new Error("Channel not found");
    }
    console.log("Channel retrieved:", channel);

    const systemMember = await fetchOrCreateSystemMember(
      systemUser.id,
      channel.serverId
    );
    console.log("System member:", systemMember);

    // Analyze and create system message
    if (shouldAnalyze) {
      let analysisResult = truncatedContent;

      if (fileUrl) {
        console.log("Analyzing image:", fileUrl);
        analysisResult = await analyzeImage(
          fileUrl,
          "Describe the image in detail with relevant tags."
        );
        console.log("Image analysis result:", analysisResult);
      } else {
        console.log("Analyzing text message");
        const messageContext = await fetchPreviousMessages(channelId);
        console.log("Message context fetched:", {
          totalMessages: messageContext.allMessages.length,
          currentThreadMessages: messageContext.currentThreadMessages.length,
        });

        const currentMessage: Message = {
          id: uuidv4(),
          content: truncatedContent,
          fileUrl: null,
          memberId: systemUser.id,
          channelId,
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          role: "system",
        };

        // Limit context size
        const contextMessages = messageContext.allMessages
          .map(
            (msg) =>
              `[${msg.isCurrentThread ? "Current Thread" : msg.channelName}] ${
                msg.timestamp
              } - ${msg.author}: ${msg.content}`
          )
          .slice(0, 10) // Only take last 10 messages for context
          .join("\n");

        const contextualPrompt = `
          System Owners: ${SYSTEM_OWNERS.join(", ")}
          Current Channel: ${channel.name}
          Current Time: ${format(new Date(), "PPpp")}
          
          Question/Request: ${truncatedContent}
          
          Context from other channels and current thread:
          ${contextMessages}
        `.slice(0, 4000); // Limit total context size

        analysisResult = await analyzeMessage(
          currentMessage,
          messageContext.allMessages,
          contextualPrompt
        );
        console.log("Message analysis result:", analysisResult);
      }

      // Ensure the final message content is not too large
      const finalContent = analysisResult.slice(0, 2000);

      const systemMessage = await db.message.create({
        data: {
          id: uuidv4(),
          content: finalContent,
          channelId,
          memberId: systemMember.id,
          role: "system",
          createdAt: new Date(),
          updatedAt: new Date(),
          deleted: false,
        },
        include: { member: { include: { profile: true } } },
      });
      console.log("System message created:", systemMessage);

      await broadcastSystemMessage(channelId, systemMessage);
      console.log("System message broadcasted");

      return systemMessage;
    }

    // Track un-analyzed message creation
    await track("System Message Created", {
      channelId,
      contentLength: analyzedContent.length,
      isAnalyzed: false,
    });
    console.log("System message creation tracked without analysis");
  } catch (error) {
    console.error("Error creating system message:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw error;
  }
}
