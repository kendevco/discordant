import { db } from "@/lib/db";
import { analyzeMessage } from "./message-analysis";
import { Message } from "@prisma/client";
import { analyzeImage } from "./image-analysis";
import { track } from "@vercel/analytics/server";
import { v4 as uuidv4 } from "uuid";

// Use environment variable for system user ID
const SYSTEM_USER_ID = process.env.SYSTEM_USER_ID || "system-user-9000";

export async function createSystemMessage(
  channelId: string,
  content: string,
  fileUrl?: string | null
) {
  console.log("Creating system message for channel:", channelId);
  console.log("Initial content:", content);
  console.log("File URL provided:", fileUrl);

  try {
    let analyzedContent = content;
    let shouldAnalyze = true;

    // Check for /ask and /noask commands
    if (content.startsWith("/ask")) {
      analyzedContent = content.slice(5).trim();
      shouldAnalyze = true;
      console.log("Command /ask detected. Analyzing content:", analyzedContent);
    } else if (content.startsWith("/noask")) {
      analyzedContent = content.slice(7).trim();
      shouldAnalyze = false;
      console.log(
        "Command /noask detected. Skipping analysis for content:",
        analyzedContent
      );
    }

    // Get System User by ID
    const systemUser = await db.profile.upsert({
      where: { id: SYSTEM_USER_ID },
      update: {},
      create: {
        id: SYSTEM_USER_ID,
        userId: SYSTEM_USER_ID,
        name: process.env.SYSTEM_USER_NAME || "System User",
        imageUrl: process.env.SYSTEM_USER_IMAGE || "/SystemAvatarNuke.png",
        email: process.env.SYSTEM_USER_EMAIL || "ai@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("System user retrieved or created:", systemUser);

    if (!systemUser) {
      throw new Error("System user not found");
    }

    // Get the server ID from the channel ID
    const channel = await db.channel.findUnique({
      where: { id: channelId },
      select: { serverId: true },
    });

    console.log("Channel retrieved:", channel);

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
      console.log("System member created:", systemMember);
    } else {
      console.log("System member found:", systemMember);
    }

    // Analyze the message and create a system message if needed
    if (shouldAnalyze) {
      // Fetch the last 10 messages for context
      const previousMessages = await db.message.findMany({
        where: { channelId },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { member: { include: { profile: true } } },
      });

      console.log("Previous messages fetched for context:", previousMessages);

      let analysisResult: string;

      if (fileUrl) {
        // If there's a file URL, analyze the image
        const instructions =
          "Describe the image in detail if possible include relevant tags for later retrieval";
        analysisResult = await analyzeImage(fileUrl, instructions);
        console.log("Image analysis result:", analysisResult);
      } else {
        // Otherwise, analyze the text message
        const currentMessage: Message = {
          id: "temp-id",
          content: analyzedContent,
          fileUrl: null,
          memberId: systemUser.id,
          channelId,
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          role: "system",
        };

        analysisResult = await analyzeMessage(currentMessage, previousMessages);
        console.log("Message analysis result:", analysisResult);
      }

      // Create the system message
      const systemMessage = await db.message.create({
        data: {
          id: uuidv4(),
          content: analysisResult,
          channelId,
          memberId: systemMember.id,
          role: "system",
          createdAt: new Date(),
          updatedAt: new Date(),
          deleted: false,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });

      console.log("System message created:", systemMessage);

      // Broadcast the system message to all connected clients
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/messages/broadcast`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              channelId,
              message: systemMessage,
              type: "system",
            }),
          }
        );
        console.log("System message broadcasted successfully.");
      } catch (error) {
        console.error("Error broadcasting system message:", error);
      }

      return systemMessage;
    }

    // If not analyzing, track the system message creation without analysis
    await track("System Message Created", {
      channelId,
      contentLength: analyzedContent.length,
      isAnalyzed: false,
    });
    console.log("System message creation tracked without analysis.");
  } catch (error) {
    console.error("Error creating system message:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    throw error;
  }
}
