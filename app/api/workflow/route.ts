import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const workflowId = request.headers.get("X-Workflow-Id");
    const webhookPath = request.headers.get("X-Webhook-Path");
    
    if (!webhookPath) {
      return NextResponse.json(
        { error: "Missing webhook path" },
        { status: 400 }
      );
    }

    // Construct n8n webhook URL
    const n8nBaseUrl = process.env.N8N_WEBHOOK_URL || "https://n8n.kendev.co/webhook";
    const webhookUrl = `${n8nBaseUrl}/${webhookPath}`;
    
    console.log(`📤 Routing to n8n workflow: ${workflowId}`);
    console.log(`📍 Webhook URL: ${webhookUrl}`);
    console.log(`📦 Payload:`, JSON.stringify(body, null, 2));

    // Forward request to n8n
    const n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Discordant-Workflow-Router/1.0",
      },
      body: JSON.stringify(body),
    });

    console.log(`📥 N8N Response status: ${n8nResponse.status}`);

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error(`❌ N8N Error: ${errorText}`);
      
      // Return a user-friendly error
      return NextResponse.json({
        message: "Workflow service temporarily unavailable. Please try again.",
        type: "workflow_error",
        timestamp: new Date().toISOString(),
        metadata: {
          workflowId,
          error: "n8n_error",
          statusCode: n8nResponse.status,
        }
      });
    }

    // Enhanced JSON parsing with fallback handling
    let responseData;
    const responseText = await n8nResponse.text();
    
    console.log(`📝 N8N Raw Response:`, responseText);
    console.log(`📏 N8N Response Length:`, responseText.length);

    if (!responseText || responseText.trim() === '') {
      console.log(`⚠️ N8N returned empty response`);
      responseData = {
        message: "Workflow completed but returned no data.",
        type: "empty_response",
        timestamp: new Date().toISOString(),
        metadata: {
          workflowId,
          status: "completed_empty"
        }
      };
    } else {
      try {
        responseData = JSON.parse(responseText);
        console.log(`✅ N8N JSON Parsed Successfully:`, JSON.stringify(responseData, null, 2));
      } catch (parseError) {
        console.error(`❌ N8N JSON Parse Error:`, parseError);
        console.log(`📄 Problematic response text:`, responseText.substring(0, 500));
        
        // If it's not valid JSON, treat the text as the message
        responseData = {
          message: responseText,
          type: "text_response",
          timestamp: new Date().toISOString(),
          metadata: {
            workflowId,
            originalLength: responseText.length,
            parseError: parseError instanceof Error ? parseError.message : "JSON parse failed"
          }
        };
      }
    }
    
    return NextResponse.json(responseData);

  } catch (error) {
    console.error("Workflow proxy error:", error);
    
    return NextResponse.json({
      message: "Failed to connect to workflow service",
      type: "proxy_error",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
} 