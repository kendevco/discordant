import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";
import { MessageRole, ChannelType } from "@prisma/client";

// System user ID for VAPI messages
const VAPI_SYSTEM_USER_ID = "vapi-assistant-system";

// Default Front Desk server ID
const FRONT_DESK_SERVER_ID = "a90f1d41-12a9-4586-b9a4-a513d3bd01d9";

// Function to ensure VAPI system user exists
async function ensureVAPISystemUser() {
  return await db.profile.upsert({
    where: { id: VAPI_SYSTEM_USER_ID },
    update: {},
    create: {
      id: VAPI_SYSTEM_USER_ID,
      userId: "vapi_system_user",
      name: "VAPI Voice Assistant",
      email: "vapi@kendev.co",
      imageUrl: "https://img.icons8.com/color/48/microphone.png",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

// Function to ensure VAPI system member in server
async function ensureVAPISystemMember(serverId: string) {
  let member = await db.member.findFirst({
    where: {
      profileId: VAPI_SYSTEM_USER_ID,
      serverId: serverId,
    },
  });

  if (!member) {
    member = await db.member.create({
      data: {
        id: randomUUID(),
        profileId: VAPI_SYSTEM_USER_ID,
        serverId: serverId,
        role: "GUEST",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  return member;
}

// Function to ensure VAPI channel exists
async function ensureVAPIChannel(serverId: string = FRONT_DESK_SERVER_ID) {
  try {
    // First check if server exists
    const server = await db.server.findUnique({
      where: { id: serverId },
    });

    if (!server) {
      console.error(`[VAPI_WEBHOOK] Server not found: ${serverId}`);
      throw new Error(`Server not found: ${serverId}`);
    }

    // Look for existing VAPI channel
    let channel = await db.channel.findFirst({
      where: {
        serverId: serverId,
        name: "vapi",
      },
    });

    if (!channel) {
      // Create VAPI channel if it doesn't exist
      console.log(`[VAPI_WEBHOOK] Creating VAPI channel in server ${serverId}`);
      channel = await db.channel.create({
        data: {
          id: randomUUID(),
          name: "vapi",
          type: ChannelType.TEXT,
          serverId: serverId,
          profileId: server.profileId, // Use server owner's profile
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      console.log(`[VAPI_WEBHOOK] VAPI channel created: ${channel.id}`);
    }

    return channel;
  } catch (error) {
    console.error("[VAPI_WEBHOOK] Error ensuring VAPI channel:", error);
    throw error;
  }
}

// Function to create VAPI message in Discord
async function createVAPIMessage(
  content: string,
  channelId: string,
  memberId: string,
  role: MessageRole = MessageRole.user,
  metadata?: any
) {
  const message = await db.message.create({
    data: {
      id: randomUUID(),
      content: content,
      channelId: channelId,
      memberId: memberId,
      role: role,
      fileUrl: null,
      deleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    include: {
      member: {
        include: {
          profile: true,
        },
      },
      channel: true,
    },
  });

  return message;
}

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({ 
      status: "ok", 
      message: "VAPI webhook endpoint is active",
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error) {
    console.error("[VAPI_WEBHOOK] GET Error:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log("[VAPI_WEBHOOK] Received webhook:", {
      timestamp: new Date().toISOString(),
      body: JSON.stringify(body, null, 2)
    });

    // Extract basic information
    const message = body.message || body;
    const transcript = message.transcript || body.transcript || "";
    const call = message.call || body.call || {};
    const callId = call.id || body.callId || `vapi-${Date.now()}`;
    
    console.log("[VAPI_WEBHOOK] Processing transcript:", transcript);
    
    // For now, just forward to the n8n workflow
    const discordantPayload = {
      message: transcript,
      content: transcript,
      userId: `vapi-${callId}`,
      userName: `VAPI Caller`,
      channelId: "vapi",
      serverId: "a90f1d41-12a9-4586-b9a4-a513d3bd01d9",
      platform: "vapi",
      isVoiceCall: true,
      metadata: {
        callId: callId,
        timestamp: new Date().toISOString()
      }
    };
    
    console.log("[VAPI_WEBHOOK] Calling n8n workflow...");
    
    try {
      const workflowResponse = await fetch("https://n8n.kendev.co/webhook/discordant-ai-services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Source": "vapi-integration"
        },
        body: JSON.stringify({ body: discordantPayload })
      });
      
      console.log("[VAPI_WEBHOOK] Workflow response status:", workflowResponse.status);
      
      let aiResponse = "I understand your request. Let me help you with that.";
      
      if (workflowResponse.ok) {
        const workflowData = await workflowResponse.json();
        console.log("[VAPI_WEBHOOK] Workflow data:", JSON.stringify(workflowData, null, 2));
        aiResponse = workflowData.response || workflowData.output || workflowData.message || aiResponse;
      } else {
        console.error("[VAPI_WEBHOOK] Workflow error:", await workflowResponse.text());
      }
      
      // Return simple response
      return NextResponse.json({
        success: true,
        callId: callId,
        response: aiResponse,
        timestamp: new Date().toISOString()
      });
      
    } catch (workflowError) {
      console.error("[VAPI_WEBHOOK] Workflow error:", workflowError);
      
      // Return fallback response
      return NextResponse.json({
        success: true,
        callId: callId,
        response: "I'm currently experiencing technical difficulties. Please try again later.",
        error: workflowError instanceof Error ? workflowError.message : "Unknown workflow error",
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error("[VAPI_WEBHOOK] Error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 