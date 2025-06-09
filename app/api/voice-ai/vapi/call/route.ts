import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

interface VAPICallRequest {
  phoneNumber: string;
  assistantId?: string;
  purpose?: "verification" | "gatekeeper" | "outbound_sales" | "follow_up";
  customMessage?: string;
  contactData?: {
    name?: string;
    email?: string;
    company?: string;
    notes?: string;
  };
}

interface VAPICallResponse {
  id: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  status: string;
  phoneNumber: string;
  assistantId: string;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: VAPICallRequest = await req.json();
    const { phoneNumber, assistantId, purpose, customMessage, contactData } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Validate phone number format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber.replace(/[^\d+]/g, ""))) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Determine assistant ID based on purpose
    const selectedAssistantId = assistantId || getAssistantIdByPurpose(purpose);

    // Prepare VAPI call configuration
    const callConfig = {
      phoneNumber,
      assistantId: selectedAssistantId,
      metadata: {
        purpose: purpose || "general",
        contactData: contactData || {},
        customMessage,
        initiatedBy: userId,
        timestamp: new Date().toISOString()
      }
    };

    // Make call to VAPI API
    const vapiResponse = await fetch("https://api.vapi.ai/call", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.VAPI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(callConfig)
    });

    if (!vapiResponse.ok) {
      const errorData = await vapiResponse.json().catch(() => ({}));
      console.error("VAPI API error:", errorData);
      return NextResponse.json(
        { error: "Failed to initiate call", details: errorData },
        { status: vapiResponse.status }
      );
    }

    const callData: VAPICallResponse = await vapiResponse.json();

    // Send notification to n8n workflow
    await notifyCallInitiated(callData, contactData);

    return NextResponse.json({
      success: true,
      callId: callData.id,
      status: callData.status,
      phoneNumber: callData.phoneNumber,
      assistantId: callData.assistantId,
      createdAt: callData.createdAt
    });

  } catch (error) {
    console.error("Call initiation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate call" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const callId = searchParams.get("callId");

    if (!callId) {
      return NextResponse.json(
        { error: "Call ID is required" },
        { status: 400 }
      );
    }

    // Get call status from VAPI
    const vapiResponse = await fetch(`https://api.vapi.ai/call/${callId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.VAPI_API_KEY}`
      }
    });

    if (!vapiResponse.ok) {
      return NextResponse.json(
        { error: "Failed to get call status" },
        { status: vapiResponse.status }
      );
    }

    const callData = await vapiResponse.json();

    return NextResponse.json({
      callId: callData.id,
      status: callData.status,
      phoneNumber: callData.phoneNumber,
      duration: callData.duration,
      endedReason: callData.endedReason,
      cost: callData.cost,
      transcript: callData.transcript,
      summary: callData.summary,
      createdAt: callData.createdAt,
      updatedAt: callData.updatedAt
    });

  } catch (error) {
    console.error("Get call status error:", error);
    return NextResponse.json(
      { error: "Failed to get call status" },
      { status: 500 }
    );
  }
}

function getAssistantIdByPurpose(purpose?: string): string {
  switch (purpose) {
    case "gatekeeper":
      return process.env.VAPI_GATEKEEPER_ASSISTANT_ID || process.env.VAPI_ASSISTANT_ID || "";
    case "outbound_sales":
      return process.env.VAPI_SALES_ASSISTANT_ID || process.env.VAPI_ASSISTANT_ID || "";
    case "verification":
      return process.env.VAPI_VERIFICATION_ASSISTANT_ID || process.env.VAPI_ASSISTANT_ID || "";
    case "follow_up":
      return process.env.VAPI_FOLLOWUP_ASSISTANT_ID || process.env.VAPI_ASSISTANT_ID || "";
    default:
      return process.env.VAPI_ASSISTANT_ID || "";
  }
}

async function notifyCallInitiated(callData: VAPICallResponse, contactData?: any) {
  try {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) return;

    await fetch(`${webhookUrl}/vapi-call-initiated`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "call_initiated",
        callId: callData.id,
        phoneNumber: callData.phoneNumber,
        assistantId: callData.assistantId,
        status: callData.status,
        contactData,
        timestamp: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error("Failed to notify call initiation:", error);
  }
} 