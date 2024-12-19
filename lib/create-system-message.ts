import { db } from "@/lib/db";
import { analyzeMessage } from "./message-analysis";
import { Message } from "@prisma/client";
import { analyzeImage } from "./image-analysis";
import { track } from "@vercel/analytics/server";
import { v4 as uuidv4 } from "uuid";

const SYSTEM_USER_ID = "system-user-9000";

export async function createSystemMessage(
  channelId: string, 
  content: string, 
  fileUrl?: string | null,
) {
  try {
    let analyzedContent = content;
    let shouldAnalyze = true;

    // Check for /ask and /noask commands
    if (content.startsWith('/ask')) {
      analyzedContent = content.slice(5).trim();
      shouldAnalyze = true;
    } else if (content.startsWith('/noask')) {
      analyzedContent = content.slice(7).trim();
      shouldAnalyze = false;
    }

    // Get System User by ID
    const systemUser = await db.profile.upsert({
      where: { id: process.env.SYSTEM_USER_ID },
      update: {},
      create: {
        id: process.env.SYSTEM_USER_ID!,
        userId: process.env.SYSTEM_USER_ID!,
        name: process.env.SYSTEM_USER_NAME!,
        imageUrl: process.env.SYSTEM_USER_IMAGE,
        email: process.env.SYSTEM_USER_EMAIL!,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    if (!systemUser) {
      throw new Error("System user not found");
    }

    // Get the server ID from the channel ID
    const channel = await db.channel.findUnique({
      where: { id: channelId },
      select: { serverId: true },
    });

    if (!channel) {
      throw new Error("Channel not found");
    }

    // Find existing system member or create a new one
    let systemMember = await db.member.findFirst({
      where: {
        profileId: systemUser.id,
        serverId: channel.serverId,
      },
    });

    if (!systemMember) {
      systemMember = await db.member.create({
        data: {
          id: uuidv4(),
          profileId: systemUser.id,
          serverId: channel.serverId,
          role: "GUEST",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    // Analyze the message and create a system message if needed
    if (shouldAnalyze) {
      // Fetch the last 10 messages for context
      const previousMessages = await db.message.findMany({
        where: { channelId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { member: { include: { profile: true } } },
      });

      let analysisResult: string;

      if (fileUrl) {
        // If there's a file URL, analyze the image
        const instructions = "Describe the image in detail if possible include relevant tags for later retrieval";
        analysisResult = await analyzeImage(fileUrl, instructions);
      } else {
        // Otherwise, analyze the text message
        const currentMessage: Message = {
          id: 'temp-id',
          content: analyzedContent,
          fileUrl: null,
          memberId: SYSTEM_USER_ID,
          channelId,
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          role: "system",
        };

        analysisResult = await analyzeMessage(currentMessage, previousMessages);
      }

      // Create the system message
      const systemMessage = await db.message.create({
        data: {
          id: uuidv4(),
          content: analysisResult,
          channelId,
          memberId: SYSTEM_USER_ID,
          role: "system",
          createdAt: new Date(),
          updatedAt: new Date(),
          deleted: false,
        },
        include: {
          member: {
            include: {
              profile: true,
            }
          }
        },
      });

      // Broadcast the system message to all connected clients
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/messages/broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelId,
          message: systemMessage,
          type: 'system'
        }),
      });

      return systemMessage;
    }

    // If not analyzing, track the system message creation without analysis
    await track('System Message Created', {
      channelId,
      contentLength: analyzedContent.length,
      isAnalyzed: false,
    });
  } catch (error) {
    console.error("Error creating system message:", error);
    throw error;
  }
}
