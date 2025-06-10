import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createLeoAssistant, updateLeoAssistant, getLeoAssistantConfig } from "@/lib/voice-ai/vapi-assistant-config";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, assistantId } = await req.json();

    let result;
    
    switch (action) {
      case "create":
        result = await createLeoAssistant();
        break;
      
      case "update":
        if (!assistantId) {
          return NextResponse.json(
            { error: "Assistant ID required for update" },
            { status: 400 }
          );
        }
        result = await updateLeoAssistant(assistantId);
        break;
      
      case "config":
        result = getLeoAssistantConfig();
        break;
      
      default:
        return NextResponse.json(
          { error: "Invalid action. Use 'create', 'update', or 'config'" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      action,
      data: result
    });

  } catch (error) {
    console.error("Assistant management error:", error);
    return NextResponse.json(
      { 
        error: "Failed to manage assistant",
        details: error instanceof Error ? error.message : "Unknown error"
      },
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
    const assistantId = searchParams.get("assistantId");

    if (assistantId) {
      // Get specific assistant from VAPI
      const vapiResponse = await fetch(`https://api.vapi.ai/assistant/${assistantId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${process.env.VAPI_API_KEY}`
        }
      });

      if (!vapiResponse.ok) {
        return NextResponse.json(
          { error: "Failed to get assistant from VAPI" },
          { status: vapiResponse.status }
        );
      }

      const assistantData = await vapiResponse.json();
      return NextResponse.json({
        success: true,
        assistant: assistantData
      });
    }

    // List all assistants
    const vapiResponse = await fetch("https://api.vapi.ai/assistant", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.VAPI_API_KEY}`
      }
    });

    if (!vapiResponse.ok) {
      return NextResponse.json(
        { error: "Failed to list assistants from VAPI" },
        { status: vapiResponse.status }
      );
    }

    const assistants = await vapiResponse.json();
    
    // Also return our configuration for comparison
    const leoConfig = getLeoAssistantConfig();

    return NextResponse.json({
      success: true,
      assistants,
      leoConfig,
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://discordant.kendev.co'}/api/voice-ai/vapi/webhook`
    });

  } catch (error) {
    console.error("Get assistant error:", error);
    return NextResponse.json(
      { error: "Failed to get assistant data" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const assistantId = searchParams.get("assistantId");

    if (!assistantId) {
      return NextResponse.json(
        { error: "Assistant ID required" },
        { status: 400 }
      );
    }

    // Delete assistant from VAPI
    const vapiResponse = await fetch(`https://api.vapi.ai/assistant/${assistantId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${process.env.VAPI_API_KEY}`
      }
    });

    if (!vapiResponse.ok) {
      return NextResponse.json(
        { error: "Failed to delete assistant from VAPI" },
        { status: vapiResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Assistant deleted successfully"
    });

  } catch (error) {
    console.error("Delete assistant error:", error);
    return NextResponse.json(
      { error: "Failed to delete assistant" },
      { status: 500 }
    );
  }
} 