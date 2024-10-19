import { NextResponse } from "next/server";
import { Message, Role } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { analyzeImage } from "@/lib/image-analysis";
import { createSystemMessage } from "@/lib/create-system-message";
import { Server as SocketIOServer } from "socket.io";
import { v4 as uuidv4 } from 'uuid';

const MESSAGES_BATCH = 10;

export async function GET(
  req: Request
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  
    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            }
          }
        },
        orderBy: {
          createdAt: "desc",
        }
      })
    } else {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            }
          }
        },
        orderBy: {
          createdAt: "desc",
        }
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor
    });
  } catch (error) {
    console.log("[MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { content, fileUrl, channelId, messageId = uuidv4() } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    if (!content && !fileUrl) {
      return new NextResponse("Content or file URL missing", { status: 400 });
    }

    // Check for existing message
    const existingMessage = await db.message.findUnique({
      where: { id: messageId }
    });

    if (existingMessage) {
      return NextResponse.json(existingMessage);
    }

    let analyzedContent = content;
    if (fileUrl) {
      try {
        const analysisPrompt = content || "Describe the image in detail if possible include relevant tags for later retrieval";
        analyzedContent = await analyzeImage(fileUrl, analysisPrompt);
      } catch (error) {
        console.error("Image analysis failed:", error);
        analyzedContent = `${content} [Image analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}]`;
      }
    }

    // Create the user message
    const message = await db.message.create({
      data: {
        id: messageId,
        content: analyzedContent,
        fileUrl: fileUrl || null,
        channelId,
        memberId: profile.id,
        role: Role.user,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    // Get the SocketIO server instance
    const io = (req as any).socket.server as SocketIOServer;

    // Emit the user message immediately
    io.to(channelId).emit("message", message);

    // Create a system message based on the analysis asynchronously
    createSystemMessage(channelId, content).then((systemMessage) => {
      if (systemMessage) {
        io.to(channelId).emit("message", systemMessage);
      }
    }).catch((error) => {
      console.error("Error creating system message:", error);
    });

    return NextResponse.json(message);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
