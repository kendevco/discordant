import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";

interface VAPIWebhookEvent {
  message: {
    type: string;
    call?: {
      id: string;
      phoneNumber: string;
      assistantId: string;
      status: string;
    };
    toolCalls?: Array<{
      id: string;
      type: "function";
      function: {
        name: string;
        arguments: string;
      };
    }>;
    toolCallId?: string;
    tool_call_id?: string;
    transcript?: string;
    recordingUrl?: string;
    summary?: string;
  };
}

interface ContactData {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  projectType?: string;
  timeline?: string;
  budget?: string;
  notes?: string;
}

interface CalendarSlot {
  date: string;
  time: string;
  timezone?: string;
}

export async function POST(req: NextRequest) {
  try {
    const headersList = await headers();
    const body: VAPIWebhookEvent = await req.json();

    console.log("[VAPI_WEBHOOK]", "Received:", JSON.stringify(body, null, 2));

    const { message } = body;

    // Handle tool calls from VAPI
    if (message.toolCalls && message.toolCalls.length > 0) {
      return await handleToolCalls(message.toolCalls, message);
    }

    // Handle specific tool call response
    if (message.toolCallId || message.tool_call_id) {
      return await handleToolCallResponse(message);
    }

    // Default response for other events
    return NextResponse.json({
      status: "received",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("[VAPI_WEBHOOK_ERROR]", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleToolCalls(toolCalls: any[], message: any): Promise<NextResponse> {
  try {
    const results = [];

    for (const toolCall of toolCalls) {
      const { function: func } = toolCall;
      const functionName = func.name;
      
      let args: any = {};
      try {
        args = JSON.parse(func.arguments);
      } catch (e) {
        console.error("[VAPI_WEBHOOK]", "Invalid function arguments:", func.arguments);
        args = {};
      }

      console.log("[VAPI_WEBHOOK]", `Processing function: ${functionName}`, args);

      let result: any;

      switch (functionName) {
        case "capture_contact_info":
          result = await captureContactInfo(args, message);
          break;
        
        case "schedule_consultation":
          result = await scheduleConsultation(args, message);
          break;
        
        case "send_project_info":
          result = await sendProjectInfo(args, message);
          break;
        
        case "check_availability":
          result = await checkAvailability(args, message);
          break;
        
        case "create_lead":
          result = await createLead(args, message);
          break;
        
        case "send_follow_up_email":
          result = await sendFollowUpEmail(args, message);
          break;

        default:
          result = {
            success: false,
            message: `Unknown function: ${functionName}`
          };
      }

      results.push({
        toolCallId: toolCall.id,
        result: result.message || "Function executed successfully"
      });

      // Log the tool call execution
      await logToolCallExecution(toolCall, result, message);
    }

    // Return the first result (VAPI expects single response)
    return NextResponse.json(results[0] || {
      toolCallId: toolCalls[0]?.id || "unknown",
      result: "Functions processed successfully"
    });

  } catch (error) {
    console.error("[VAPI_WEBHOOK]", "Tool call processing error:", error);
    return NextResponse.json({
      toolCallId: toolCalls[0]?.id || "error",
      result: "I apologize, but I encountered an error processing your request. Let me connect you with someone who can help."
    });
  }
}

async function handleToolCallResponse(message: any): Promise<NextResponse> {
  // Handle general conversation analysis and cleanup
  await sendToDiscordChannel({
    content: `🎯 **VAPI Call Completed**\n\n**Call ID**: ${message.call?.id}\n**Status**: Call ended\n**Summary**: ${message.summary || 'Processing complete'}\n\n${message.transcript ? `**Transcript**: ${message.transcript.slice(0, 500)}...` : ''}`,
    channel: "system"
  });

  return NextResponse.json({
    toolCallId: message.toolCallId || message.tool_call_id || "conversation_processed",
    result: "Thank you for contacting KenDev.co! I've recorded all your information and you'll receive a follow-up shortly."
  });
}

// Tool function implementations
async function captureContactInfo(args: ContactData, message: any) {
  try {
    // Log the contact information (we'll skip database storage for now to avoid token issues)
    console.log("[CONTACT_CAPTURED]", {
      action: "contact_captured",
      contactData: args,
      source: "vapi_call",
      callId: message.call?.id,
      phoneNumber: message.call?.phoneNumber,
      timestamp: new Date().toISOString()
    });

    // Send notification to Discord
    await sendToDiscordChannel({
      content: `📞 **New Contact Captured via Voice Call**\n\n**Name**: ${args.name || 'Not provided'}\n**Email**: ${args.email || 'Not provided'}\n**Phone**: ${args.phone || message.call?.phoneNumber}\n**Company**: ${args.company || 'Not provided'}\n**Project**: ${args.projectType || 'Not specified'}\n**Timeline**: ${args.timeline || 'Not specified'}\n**Budget**: ${args.budget || 'Not specified'}\n**Notes**: ${args.notes || 'None'}\n\n**Call ID**: ${message.call?.id}`,
      channel: "folio-site-assistant"
    });

    // Trigger n8n workflow for lead processing
    await triggerN8nWorkflow("contact-captured", {
      contactData: args,
      callId: message.call?.id,
      source: "vapi_call"
    });

    return {
      success: true,
      message: `Perfect! I've captured your information${args.name ? `, ${args.name}` : ''}. You'll receive a detailed follow-up email shortly, and Kenneth will personally review your project requirements.`
    };

  } catch (error) {
    console.error("[CAPTURE_CONTACT_ERROR]", error);
    return {
      success: false,
      message: "I've noted your information. Someone from our team will follow up with you soon."
    };
  }
}

async function scheduleConsultation(args: CalendarSlot & ContactData, message: any) {
  try {
    // Create calendar event (integrate with your calendar system)
    const calendarEvent = {
      title: `KenDev.co Consultation - ${args.name || 'Prospect'}`,
      date: args.date,
      time: args.time,
      timezone: args.timezone || 'America/New_York',
      attendees: [args.email],
      description: `Project consultation call\n\nProject Type: ${args.projectType}\nTimeline: ${args.timeline}\nBudget: ${args.budget}\n\nCall initiated via VAPI: ${message.call?.id}`
    };

    // Send to Discord for tracking
    await sendToDiscordChannel({
      content: `📅 **Consultation Scheduled via Voice Call**\n\n**Name**: ${args.name}\n**Email**: ${args.email}\n**Date**: ${args.date}\n**Time**: ${args.time}\n**Project**: ${args.projectType}\n\n**Call ID**: ${message.call?.id}`,
      channel: "folio-site-assistant"
    });

    // Trigger calendar workflow
    await triggerN8nWorkflow("schedule-consultation", {
      calendarEvent,
      contactData: args,
      callId: message.call?.id
    });

    return {
      success: true,
      message: `Excellent! I've scheduled your consultation for ${args.date} at ${args.time}. You'll receive a calendar invitation at ${args.email} with all the details and meeting link.`
    };

  } catch (error) {
    console.error("[SCHEDULE_CONSULTATION_ERROR]", error);
    return {
      success: false,
      message: "I've noted your preferred time. You'll receive a calendar invitation shortly with the consultation details."
    };
  }
}

async function sendProjectInfo(args: ContactData, message: any) {
  try {
    await triggerN8nWorkflow("send-project-info", {
      contactData: args,
      projectType: args.projectType,
      callId: message.call?.id
    });

    await sendToDiscordChannel({
      content: `📧 **Project Info Requested via Voice Call**\n\n**Name**: ${args.name}\n**Email**: ${args.email}\n**Project Type**: ${args.projectType}\n**Call ID**: ${message.call?.id}`,
      channel: "folio-site-assistant"
    });

    return {
      success: true,
      message: `Perfect! I'm sending you detailed information about our ${args.projectType} services to ${args.email}. You'll also receive case studies and pricing information relevant to your project.`
    };

  } catch (error) {
    console.error("[SEND_PROJECT_INFO_ERROR]", error);
    return {
      success: false,
      message: "I'll send you detailed project information via email shortly."
    };
  }
}

async function checkAvailability(args: { timeframe?: string }, message: any) {
  // Kenneth's availability from the system prompt
  const availability = {
    "monday": "7:00 AM - 9:15 AM, after 6:30 PM Eastern",
    "tuesday": "7:00 AM - 9:15 AM, after 6:30 PM Eastern", 
    "wednesday": "7:00 AM - 9:15 AM, after 6:30 PM Eastern",
    "thursday": "7:00 AM - 9:15 AM, after 6:30 PM Eastern",
    "friday": "After 4:00 PM Eastern",
    "saturday": "Available all day Eastern",
    "sunday": "Limited availability"
  };

  return {
    success: true,
    message: `Kenneth's availability is Monday through Thursday: 7:00 AM to 9:15 AM and after 6:30 PM Eastern time. Friday after 4:00 PM, and Saturday is wide open. Would any of these times work for your consultation?`
  };
}

async function createLead(args: ContactData, message: any) {
  try {
    // Create lead record
    const leadData = {
      ...args,
      source: "vapi_voice_call",
      callId: message.call?.id,
      phoneNumber: args.phone || message.call?.phoneNumber,
      status: "new",
      priority: "high", // Voice calls are high priority
      timestamp: new Date().toISOString()
    };

    await triggerN8nWorkflow("create-lead", leadData);

    await sendToDiscordChannel({
      content: `🎯 **High Priority Lead Created via Voice Call**\n\n**Name**: ${args.name}\n**Company**: ${args.company}\n**Project**: ${args.projectType}\n**Timeline**: ${args.timeline}\n**Budget**: ${args.budget}\n\n**Call ID**: ${message.call?.id}\n\n*This lead was generated through direct voice contact and should be prioritized.*`,
      channel: "folio-site-assistant"
    });

    return {
      success: true,
      message: `I've created your lead profile in our system. Given that you took the time to call us directly, you'll be prioritized in Kenneth's follow-up queue. Expect contact within 24 hours.`
    };

  } catch (error) {
    console.error("[CREATE_LEAD_ERROR]", error);
    return {
      success: false,
      message: "I've noted your interest and you'll be contacted shortly for follow-up."
    };
  }
}

async function sendFollowUpEmail(args: ContactData & { emailType?: string }, message: any) {
  try {
    await triggerN8nWorkflow("send-follow-up-email", {
      contactData: args,
      emailType: args.emailType || "general_inquiry",
      callId: message.call?.id,
      urgency: "high" // Voice calls get high urgency
    });

    return {
      success: true,
      message: `I'm sending you a personalized follow-up email to ${args.email} right now. It will include next steps and Kenneth's direct contact information for your project.`
    };

  } catch (error) {
    console.error("[SEND_FOLLOW_UP_ERROR]", error);
    return {
      success: false,
      message: "You'll receive a follow-up email shortly with next steps."
    };
  }
}

// Helper functions
async function sendToDiscordChannel(data: { content: string; channel: string }) {
  try {
    // Send to external webhook for Discord integration
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(`${webhookUrl}/vapi-discord-notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: data.content,
          channel: data.channel,
          source: "vapi_webhook",
          timestamp: new Date().toISOString()
        })
      });
    }
  } catch (error) {
    console.error("[DISCORD_NOTIFICATION_ERROR]", error);
  }
}

async function triggerN8nWorkflow(workflowType: string, data: any) {
  try {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(`${webhookUrl}/vapi-${workflowType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowType,
          data,
          source: "vapi_webhook",
          timestamp: new Date().toISOString()
        })
      });
    }
  } catch (error) {
    console.error(`[N8N_WORKFLOW_ERROR] ${workflowType}:`, error);
  }
}

async function logToolCallExecution(toolCall: any, result: any, message: any) {
  try {
    console.log("[VAPI_TOOL_EXECUTION]", {
      function: toolCall.function.name,
      arguments: toolCall.function.arguments,
      result: result.success,
      callId: message.call?.id,
      timestamp: new Date().toISOString()
    });

    // Could store in database for analytics
    // await db.toolCallLog.create({ ... });

  } catch (error) {
    console.error("[LOG_TOOL_CALL_ERROR]", error);
  }
}

// GET endpoint for webhook verification/health check
export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    webhook: "vapi-discordant-integration",
    version: "1.0",
    timestamp: new Date().toISOString(),
    supportedFunctions: [
      "capture_contact_info",
      "schedule_consultation", 
      "send_project_info",
      "check_availability",
      "create_lead",
      "send_follow_up_email"
    ],
    capabilities: [
      "real-time-function-calls",
      "discord-notifications",
      "n8n-workflow-triggers",
      "contact-management",
      "calendar-integration",
      "lead-generation"
    ]
  });
} 