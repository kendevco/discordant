// /app/api/direct-messages/route.ts

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { DirectMessage } from "@prisma/client";
import { NextResponse } from "next/server";
const MESSAGES_BATCH = 50;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!conversationId) {
      return new NextResponse("Conversation ID missing", { status: 400 });
    }
    let messages: DirectMessage[] = [];
    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: { conversationId },
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
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: { conversationId },
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
    return NextResponse.json({ items: messages, nextCursor });
  } catch (error) {
    console.log("[DIRECT_MESSAGES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    console.log('[DIRECT_MESSAGES_POST] Request started:', {
      url: req.url,
      timestamp: new Date().toISOString()
    });

    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const body = await req.json();
    
    const conversationId = searchParams.get("conversationId");
    const { content, fileUrl } = body;

    console.log('[DIRECT_MESSAGES_POST] Request params:', {
      profileId: profile?.id,
      conversationId,
      hasContent: !!content,
      hasFileUrl: !!fileUrl
    });

    if (!profile) {
      console.error('[DIRECT_MESSAGES_POST] No profile found - user not authenticated');
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!conversationId) {
      console.error('[DIRECT_MESSAGES_POST] No conversationId provided in request');
      return new NextResponse("Conversation ID missing", { status: 400 });
    }

    if (!content && !fileUrl) {
      console.error('[DIRECT_MESSAGES_POST] No content or file provided');
      return new NextResponse("Content or file required", { status: 400 });
    }

    // Validate conversationId format (UUID format)
    if (!/^[a-f0-9-]{36}$/.test(conversationId)) {
      console.error('[DIRECT_MESSAGES_POST] Invalid conversationId format:', conversationId);
      return new NextResponse("Invalid conversation ID format", { status: 400 });
    }

    // Check if user is part of this conversation
    console.log('[DIRECT_MESSAGES_POST] Checking conversation access...');
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation) {
      console.error('[DIRECT_MESSAGES_POST] Conversation not found or user has no access:', {
        conversationId,
        profileId: profile.id
      });
      return new NextResponse("Conversation not found or access denied", { status: 404 });
    }

    // Determine which member is sending the message
    const member = conversation.memberOne.profileId === profile.id 
      ? conversation.memberOne 
      : conversation.memberTwo;

    console.log('[DIRECT_MESSAGES_POST] Access verified, creating direct message...');

    // Create the direct message
    const message = await db.directMessage.create({
      data: {
        id: require('crypto').randomUUID(),
        content: content || "",
        fileUrl: fileUrl || null,
        conversationId: conversationId,
        memberId: member.id,
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

    console.log('[DIRECT_MESSAGES_POST] Direct message created successfully:', {
      messageId: message.id,
      memberId: member.id,
      conversationId: conversationId
    });

    // Trigger system message processing for AI workflow (if applicable)
    try {
      console.log('[DIRECT_MESSAGES_POST] Checking if agent conversation...');
      
      // Check if this conversation involves an AI agent
      const { db } = await import('@/lib/db');
      const conversation = await db.conversation.findUnique({
        where: { id: conversationId },
        include: {
          memberOne: { 
            include: { 
              profile: { 
                include: { agentProfile: true } 
              } 
            } 
          },
          memberTwo: { 
            include: { 
              profile: { 
                include: { agentProfile: true } 
              } 
            } 
          }
        }
      });
      
      if (!conversation) {
        console.log('[DIRECT_MESSAGES_POST] ⚠️ Conversation not found for agent check');
        return NextResponse.json(message);
      }
      
      // Determine if either participant is an AI agent
      const memberOneIsAgent = !!conversation.memberOne.profile.agentProfile;
      const memberTwoIsAgent = !!conversation.memberTwo.profile.agentProfile;
      const isAgentConversation = memberOneIsAgent || memberTwoIsAgent;
      
      if (!isAgentConversation) {
        console.log('[DIRECT_MESSAGES_POST] ✅ Human-to-human conversation, skipping workflow processing');
        return NextResponse.json(message);
      }
      
      // This is an agent conversation - determine which agent and process accordingly
      const agentMember = memberOneIsAgent ? conversation.memberOne : conversation.memberTwo;
      const humanMember = memberOneIsAgent ? conversation.memberTwo : conversation.memberOne;
      
      console.log('[DIRECT_MESSAGES_POST] 🤖 Agent conversation detected:', {
        agentName: agentMember.profile.name,
        agentType: agentMember.profile.agentProfile?.agentType,
        humanName: humanMember.profile.name,
        messageFromHuman: member.id === humanMember.id
      });
      
      // Only process if the message is FROM the human TO the agent
      if (member.id !== humanMember.id) {
        console.log('[DIRECT_MESSAGES_POST] ✅ Message from agent, no processing needed');
        return NextResponse.json(message);
      }
      
      // Process agent conversation in background
      const { createAgentDirectMessage } = await import('@/lib/system/agent-conversations');
      
      setImmediate(async () => {
        try {
          await createAgentDirectMessage(conversationId, message, agentMember.profile.agentProfile, req);
          console.log('[DIRECT_MESSAGES_POST] ✅ Agent conversation processing completed');
        } catch (agentError) {
          console.error('[DIRECT_MESSAGES_POST] ❌ Agent conversation processing failed:', agentError);
        }
      });
      
      console.log('[DIRECT_MESSAGES_POST] ✅ Agent conversation processing initiated');
      
    } catch (importError) {
      console.error('[DIRECT_MESSAGES_POST] ❌ Failed to process agent conversation:', importError);
    }

    // Return the created message
    return NextResponse.json(message);

  } catch (error) {
    console.error("[DIRECT_MESSAGES_POST] Error details:", {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    return new NextResponse("Internal Error", { status: 500 });
  }
}
