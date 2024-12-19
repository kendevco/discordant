import { NextResponse } from "next/server";
import { Message } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { analyzeImage } from "@/lib/image-analysis";
import { createSystemMessage } from "@/lib/create-system-message";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
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
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
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
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log("[MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const body = await req.json();
    const { content, fileUrl, channelId } = body;
    const messageId = uuidv4();

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
    
  
    const member = await db.member.findFirst({
      where: {
        profileId: profile.id,
        server: {
          channels: {
            some: {
              id: channelId,
            },
          },
        },
      },
    });

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    // Create the user message first
    const message = await db.message.create({
      data: {
        id: messageId,
        content,
        fileUrl: fileUrl || null,
        channelId,
        memberId: member.id,
        role: "user",
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

    // Handle image analysis and system message asynchronously
    if (fileUrl) {
      analyzeImage(fileUrl, content || "Describe the image")
        .then(analyzedContent => {
          createSystemMessage(channelId, analyzedContent)
            .catch(error => console.error("Error creating system message:", error));
        })
        .catch(error => console.error("Image analysis failed:", error));
    }

    return NextResponse.json(message);
  } catch (error) {
    console.log("[MESSAGES_POST] Error details:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return new NextResponse("Internal Error", { status: 500 });
  }
}
