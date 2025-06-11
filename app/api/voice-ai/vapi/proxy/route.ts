import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";
import { MessageRole } from "@prisma/client";

// System user ID for VAPI messages
const VAPI_SYSTEM_USER_ID = "vapi-assistant-system";

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

// Function to create VAPI response message in Discord
async function createVAPIResponseMessage(
  channelId: string,
  content: string,
  metadata: any
) {
  const channel = await db.channel.findUnique({
    where: { id: channelId },
    select: { serverId: true },
  });

  if (!channel) {
    throw new Error(`Channel not found: ${channelId}`);
  }

  const systemMember = await ensureVAPISystemMember(channel.serverId);

  const formattedContent = `🤖 **VAPI AI Response**

**Call ID:** ${metadata?.callId || 'Unknown'}
**Processing Time:** ${metadata?.processingTime || 'Unknown'}ms
**Workflow:** Discordant AI Bot v3.0

**AI Response:**
${content}

---
*Response sent back to VAPI agent*`;

  const message = await db.message.create({
    data: {
      id: randomUUID(),
      content: formattedContent,
      channelId,
      memberId: systemMember.id,
      role: MessageRole.system,
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

  return message;
}

// Function to emit socket message
function emitSocketMessage(message: any, channelId: string) {
  try {
    const io = (global as any).io;
    if (io) {
      const channelKey = `chat:${channelId}:messages`;
      io.emit(channelKey, {
        ...message,
        _external: true,
        _sourceType: 'vapi-response',
        _forceUpdate: true,
      });
      console.log(`[VAPI_PROXY] ✅ Socket message emitted: ${channelKey}`);
    } else {
      console.warn("[VAPI_PROXY] No socket server available");
    }
  } catch (error) {
    console.error("[VAPI_PROXY] Socket emission failed:", error);
  }
}

// Function to send response back to VAPI
async function sendToVAPI(callId: string, response: string, toolCallId?: string) {
  try {
    const vapiApiKey = process.env.VAPI_API_KEY;
    if (!vapiApiKey) {
      console.warn("[VAPI_PROXY] No VAPI API key configured");
      return false;
    }

    let endpoint = `https://api.vapi.ai/call/${callId}`;
    let payload: any = {};

    if (toolCallId) {
      // This is a tool call response
      payload = {
        toolCallId,
        result: response
      };
      endpoint = `https://api.vapi.ai/call/${callId}/tool-call`;
    } else {
      // This is a general message/response
      payload = {
        message: response
      };
    }

    const vapiResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${vapiApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!vapiResponse.ok) {
      const errorData = await vapiResponse.json().catch(() => ({}));
      console.error(`[VAPI_PROXY] VAPI API error: ${vapiResponse.status}`, errorData);
      return false;
    }

    console.log(`[VAPI_PROXY] ✅ Response sent to VAPI call: ${callId}`);
    return true;
  } catch (error) {
    console.error("[VAPI_PROXY] Failed to send to VAPI:", error);
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({ 
      status: "healthy", 
      message: "VAPI proxy endpoint is operational",
      timestamp: new Date().toISOString(),
      integration: "discordant-ai-bot",
      version: "3.0"
    }, { status: 200 });
  } catch (error) {
    console.error("[VAPI_PROXY] GET Error:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log("[VAPI_PROXY] Received response from n8n workflow:", {
      timestamp: new Date().toISOString(),
      body: JSON.stringify(body, null, 2)
    });

    const {
      callId,
      response,
      channelId,
      serverId,
      toolCallId,
      workflowId,
      processingTime,
      metadata
    } = body;

    // Validate required fields
    if (!callId) {
      return NextResponse.json(
        { error: "Call ID is required" },
        { status: 400 }
      );
    }

    if (!response) {
      return NextResponse.json(
        { error: "Response content is required" },
        { status: 400 }
      );
    }

    // Create Discord system message if channel is specified
    let discordMessage = null;
    if (channelId) {
      try {
        discordMessage = await createVAPIResponseMessage(
          channelId,
          response,
          {
            callId,
            processingTime,
            workflowId: workflowId || 'discordant-ai-bot-v3.0',
            ...metadata
          }
        );

        // Emit to socket
        emitSocketMessage(discordMessage, channelId);
      } catch (error) {
        console.error("[VAPI_PROXY] Failed to create Discord message:", error);
        // Continue processing even if Discord message creation fails
      }
    }

    // Send response back to VAPI
    const vapiSuccess = await sendToVAPI(callId, response, toolCallId);

    // Return success response
    return NextResponse.json({
      success: true,
      callId,
      vapiResponseSent: vapiSuccess,
      discordMessageId: discordMessage?.id,
      channelId,
      timestamp: new Date().toISOString(),
      workflow: "discordant-ai-bot-v3.0"
    });
    
  } catch (error: any) {
    console.error("[VAPI_PROXY] Error:", error);
    return NextResponse.json(
      { 
        error: "Proxy processing failed", 
        details: error.message 
      },
      { status: 500 }
    );
  }
} 