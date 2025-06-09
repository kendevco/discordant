import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { VAPICalendarService } from "@/lib/voice-ai/vapi-calendar-service";
import { VAPIEmailService } from "@/lib/voice-ai/vapi-email-service";

// VAPI webhook event types
interface VAPIWebhookEvent {
  message: {
    type: "webhook";
    call?: {
      id: string;
      orgId: string;
      createdAt: string;
      updatedAt: string;
      type: "inboundPhoneCall" | "outboundPhoneCall" | "webCall";
      phoneCallProvider: string;
      phoneCallProviderId: string;
      status: "queued" | "ringing" | "in-progress" | "forwarding" | "ended";
      endedReason?: string;
      cost?: number;
      costBreakdown?: any;
      messages: any[];
      artifact?: any;
    };
    phoneNumber?: {
      twilioPhoneNumber: string;
      twilioAccountSid: string;
      twilioAuthToken: string;
      name: string;
      assistantId: string;
      squadId?: string;
      serverUrl?: string;
      serverUrlSecret?: string;
    };
    customer?: {
      number: string;
    };
    artifact?: any;
    transcript?: string;
    recordingUrl?: string;
    summary?: string;
    tool_calls?: Array<{
      id: string;
      type: string;
      function: {
        name: string;
        arguments: string;
      };
    }>;
    // Tool call properties for function responses
    toolCallId?: string;
    tool_call_id?: string;
  };
}

interface VAPIToolCall {
  toolCallId: string;
  result: string;
}

// Response type for VAPI tool calls
interface VAPIResponse {
  toolCallId: string;
  result: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: VAPIWebhookEvent = await req.json();
    console.log("VAPI Webhook received:", JSON.stringify(body, null, 2));

    const { message } = body;

    // Handle different VAPI event types
    if (message.call) {
      // Call status update
      await handleCallStatusUpdate(message.call);
    }

    // Handle tool calls (function calls from VAPI assistant)
    if (message.tool_calls && message.tool_calls.length > 0) {
      const responses = await handleToolCalls(message.tool_calls, message);
      return NextResponse.json(responses[0]); // Return first response for VAPI
    }

    // Handle conversation analysis request
    if (message.toolCallId || message.tool_call_id) {
      const response = await handleConversationAnalysis(message);
      return NextResponse.json(response);
    }

    // Default response for other webhook events
    return NextResponse.json({ 
      status: "received",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("VAPI webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleCallStatusUpdate(call: any) {
  try {
    // Store call information in database
    // You can extend this based on your database schema
    console.log(`Call ${call.id} status: ${call.status}`);
    
    // If call ended, process final transcript and summary
    if (call.status === "ended" && call.messages) {
      await processCallCompletion(call);
    }
  } catch (error) {
    console.error("Error handling call status update:", error);
  }
}

async function handleToolCalls(toolCalls: any[], message: any): Promise<VAPIResponse[]> {
  const responses: VAPIResponse[] = [];

  for (const toolCall of toolCalls) {
    try {
      const { function: func } = toolCall;
      const args = JSON.parse(func.arguments);

      let result = "";

      switch (func.name) {
        case "schedule_consultation":
          result = await handleScheduleConsultation(args);
          break;
        case "send_information":
          result = await handleSendInformation(args);
          break;
        case "request_callback":
          result = await handleRequestCallback(args);
          break;
        case "transfer_to_support":
          result = await handleTransferToSupport(args);
          break;
        default:
          result = "I understand your request. Let me get back to you with more information.";
      }

      responses.push({
        toolCallId: toolCall.id,
        result: result
      });

    } catch (error) {
      console.error("Error processing tool call:", error);
      responses.push({
        toolCallId: toolCall.id,
        result: "I apologize, but I encountered an issue processing your request. Please let me know how else I can help you."
      });
    }
  }

  return responses;
}

async function handleConversationAnalysis(message: any): Promise<VAPIResponse> {
  try {
    // Analyze the conversation transcript
    const transcript = message.transcript || "";
    const analysis = await analyzeConversation(transcript);

    let responseText = "";

    switch (analysis.action) {
      case "SCHEDULE":
        responseText = await handleScheduleConsultation(analysis.userDetails);
        break;
      case "EMAIL":
        responseText = await handleSendInformation(analysis.userDetails);
        break;
      case "FOLLOWUP":
        responseText = await handleRequestCallback(analysis.userDetails);
        break;
      case "SUPPORT":
        responseText = await handleTransferToSupport(analysis.userDetails);
        break;
      default:
        responseText = "Thank you for your interest! I've saved your inquiry and will follow up with relevant information via email.";
    }

    return {
      toolCallId: message.toolCallId || message.tool_call_id || "conversation_processed",
      result: responseText
    };

  } catch (error) {
    console.error("Error analyzing conversation:", error);
    return {
      toolCallId: message.toolCallId || message.tool_call_id || "conversation_error",
      result: "Thank you for your call. I'll make sure someone from our team follows up with you soon."
    };
  }
}

async function analyzeConversation(transcript: string) {
  // Simple conversation analysis - you can enhance this with AI
  const lowerTranscript = transcript.toLowerCase();
  
  // Determine action based on keywords
  let action = "INFO";
  if (lowerTranscript.includes("schedule") || lowerTranscript.includes("appointment") || lowerTranscript.includes("meeting")) {
    action = "SCHEDULE";
  } else if (lowerTranscript.includes("email") || lowerTranscript.includes("send information")) {
    action = "EMAIL";
  } else if (lowerTranscript.includes("call back") || lowerTranscript.includes("follow up")) {
    action = "FOLLOWUP";
  } else if (lowerTranscript.includes("support") || lowerTranscript.includes("technical") || lowerTranscript.includes("help")) {
    action = "SUPPORT";
  }

  return {
    action,
    summary: transcript.substring(0, 200) + "...",
    userDetails: {
      name: null,
      email: null,
      phone: null,
      preferredTime: null
    },
    priority: "MEDIUM",
    nextSteps: `Process ${action.toLowerCase()} request`
  };
}

async function handleScheduleConsultation(details: any): Promise<string> {
  try {
    // Initialize calendar service
    const calendarService = new VAPICalendarService();

    // Extract scheduling information from details or conversation
    const callData = {
      callId: details.callId || `call-${Date.now()}`,
      customerPhone: details.customerPhone || details.phone || "Unknown",
      customerEmail: details.customerEmail || details.email,
      customerName: details.customerName || details.name,
      requestedDate: details.requestedDate,
      requestedTime: details.requestedTime,
      serviceType: details.serviceType || "General Development Consultation",
      notes: details.notes || details.summary || "Scheduled via VAPI voice interaction"
    };

    // Schedule the consultation
    const result = await calendarService.scheduleConsultationFromVAPI(callData);

    if (result.success) {
      // Send to n8n workflow for calendar scheduling
      const webhookUrl = process.env.N8N_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(`${webhookUrl}/vapi-schedule`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "SCHEDULE",
            details: {
              ...details,
              eventId: result.eventId,
              meetLink: result.meetLink
            },
            timestamp: new Date().toISOString()
          })
        });
      }

      return `Perfect! I've scheduled your consultation for ${callData.requestedDate || 'the next available time'}. You'll receive a calendar invitation with a Google Meet link at ${callData.customerEmail || 'your email'}. Looking forward to speaking with you!`;
    } else {
      console.error("Calendar scheduling failed:", result.error);
      return "I've noted your request for a consultation. Someone from our team will reach out within 24 hours to schedule a convenient time.";
    }
    
  } catch (error) {
    console.error("Error scheduling consultation:", error);
    return "I'll have someone from our team reach out to schedule your consultation.";
  }
}

async function handleSendInformation(details: any): Promise<string> {
  try {
    // Send information via email
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(`${webhookUrl}/vapi-information`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "EMAIL",
          details,
          timestamp: new Date().toISOString()
        })
      });
    }
    
    return "I've sent you detailed information via email. Check your inbox!";
  } catch (error) {
    console.error("Error sending information:", error);
    return "I'll make sure you receive the information via email shortly.";
  }
}

async function handleRequestCallback(details: any): Promise<string> {
  try {
    // Schedule callback
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(`${webhookUrl}/vapi-callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "FOLLOWUP",
          details,
          timestamp: new Date().toISOString()
        })
      });
    }
    
    return "I've noted your callback request. Someone will reach out within 24 hours!";
  } catch (error) {
    console.error("Error requesting callback:", error);
    return "I'll make sure someone from our team calls you back soon.";
  }
}

async function handleTransferToSupport(details: any): Promise<string> {
  try {
    // Transfer to support team
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(`${webhookUrl}/vapi-support`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SUPPORT",
          details,
          timestamp: new Date().toISOString()
        })
      });
    }
    
    return "I've connected you with our technical support team. They'll assist you shortly!";
  } catch (error) {
    console.error("Error transferring to support:", error);
    return "Let me get you connected with our support team right away.";
  }
}

async function processCallCompletion(call: any) {
  try {
    // Process completed call
    console.log("Processing completed call:", call.id);
    
    // Extract transcript
    const transcript = call.messages
      .filter((msg: any) => msg.role === "user" || msg.role === "assistant")
      .map((msg: any) => `${msg.role}: ${msg.content}`)
      .join("\n");

    // Send to n8n for processing
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(`${webhookUrl}/vapi-conversation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callId: call.id,
          status: call.status,
          transcript,
          duration: call.duration,
          endedReason: call.endedReason,
          timestamp: new Date().toISOString()
        })
      });
    }

    // Send system message to Discord #system channel
    await sendVAPISystemMessage(call, transcript);

  } catch (error) {
    console.error("Error processing call completion:", error);
  }
}

// Enhanced function to send VAPI interaction summaries to Discord system channel
async function sendVAPISystemMessage(call: any, transcript: string) {
  try {
    // Find the "Code with KenDev" server and its system channel
    const defaultServer = await db.server.findFirst({
      where: { name: "Code with KenDev" },
      include: {
        channels: {
          where: { name: "system" }
        }
      },
    });

    if (!defaultServer || !defaultServer.channels[0]) {
      console.error("Could not find Code with KenDev server or system channel");
      return;
    }

    const systemChannel = defaultServer.channels[0];

    // Analyze the conversation for key insights
    const analysis = await analyzeConversationForSystem(transcript, call);

    // Create comprehensive system message
    const systemMessage = createVAPISystemMessage(call, transcript, analysis);

    // Send to Discord system channel using existing system message infrastructure
    const { createSystemMessage } = await import("@/lib/system/system-messages");
    const { randomUUID } = await import("crypto");

    await createSystemMessage(systemChannel.id, {
      id: randomUUID(),
      content: systemMessage,
      channelId: systemChannel.id,
      memberId: "system-user-9000", // System user ID
      fileUrl: null,
      deleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: "system",
      member: {
        profile: {
          id: "system-user-9000",
          userId: "system-user-9000",
          name: "VAPI System",
          imageUrl: "/SystemAvatarNuke.png",
          email: "vapi@kendev.co",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      asIs: false, // Let it go through n8n workflow for processing
    });

    // Send comprehensive email report to Kenneth
    await sendEmailReport(call, transcript, analysis);

    console.log(`[VAPI_SYSTEM] ✅ System message sent to #system channel for call ${call.id}`);

  } catch (error) {
    console.error("Error sending VAPI system message:", error);
  }
}

// New function to send email reports
async function sendEmailReport(call: any, transcript: string, analysis: any) {
  try {
    const emailService = new VAPIEmailService();

    const emailData = {
      callId: call.id,
      customerInfo: {
        name: analysis.contactInfo.name,
        email: analysis.contactInfo.email,
        phone: analysis.customerNumber,
        company: analysis.contactInfo.company
      },
      callSummary: {
        duration: analysis.callDuration,
        transcript: transcript,
        leadQuality: analysis.leadQuality,
        interestedServices: analysis.interestedServices,
        urgency: analysis.urgency,
        sentimentScore: analysis.sentimentScore,
        nextActions: analysis.nextActions
      },
      scheduledMeeting: undefined // Will be populated if meeting was scheduled
    };

    // Send interaction report to Kenneth
    await emailService.sendInteractionReport(emailData);

    // Send follow-up email to customer if email is available
    if (analysis.contactInfo.email && analysis.contactInfo.name) {
      const serviceType = analysis.interestedServices.length > 0 
        ? analysis.interestedServices[0] 
        : "Development Services";
      
      await emailService.sendCustomerFollowupEmail(
        analysis.contactInfo.email,
        analysis.contactInfo.name,
        serviceType
      );
    }

    console.log(`[VAPI_EMAIL] ✅ Email reports sent for call ${call.id}`);

  } catch (error) {
    console.error("Error sending email report:", error);
  }
}

async function analyzeConversationForSystem(transcript: string, call: any) {
  const lowerTranscript = transcript.toLowerCase();
  
  // Extract key information
  const leadQuality = determineLeadQuality(lowerTranscript);
  const interestedServices = extractInterestedServices(lowerTranscript);
  const contactInfo = extractContactInfo(transcript);
  const nextActions = determineNextActions(lowerTranscript);
  const urgency = determineUrgency(lowerTranscript);
  const sentimentScore = analyzeSentiment(lowerTranscript);

  return {
    leadQuality,
    interestedServices,
    contactInfo,
    nextActions,
    urgency,
    sentimentScore,
    callDuration: call.duration || "Unknown",
    endReason: call.endedReason || "Normal completion",
    customerNumber: call.customer?.number || "Unknown",
    timestamp: new Date().toISOString(),
  };
}

function createVAPISystemMessage(call: any, transcript: string, analysis: any) {
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    dateStyle: 'full',
    timeStyle: 'long'
  });

  return `🤖 **VAPI Sales Interaction Report**

**📞 Call Information**
• **Call ID:** \`${call.id}\`
• **Date & Time:** ${timestamp}
• **Duration:** ${analysis.callDuration}
• **Customer Number:** ${analysis.customerNumber}
• **End Reason:** ${analysis.endReason}

**📊 Lead Assessment**
• **Lead Quality:** ${getLeadQualityEmoji(analysis.leadQuality)} ${analysis.leadQuality}
• **Interest Level:** ${getSentimentEmoji(analysis.sentimentScore)} ${analysis.sentimentScore}/10
• **Urgency:** ${getUrgencyEmoji(analysis.urgency)} ${analysis.urgency}

**💼 Services Discussed**
${analysis.interestedServices.length > 0 
  ? analysis.interestedServices.map((service: string) => `• ${service}`).join('\n')
  : '• General inquiry about KenDev.co services'
}

**📋 Next Actions Required**
${analysis.nextActions.map((action: string) => `• ${action}`).join('\n')}

**📞 Contact Information**
${analysis.contactInfo.name ? `• **Name:** ${analysis.contactInfo.name}` : ''}
${analysis.contactInfo.email ? `• **Email:** ${analysis.contactInfo.email}` : ''}
${analysis.contactInfo.phone ? `• **Phone:** ${analysis.contactInfo.phone}` : ''}
${analysis.contactInfo.company ? `• **Company:** ${analysis.contactInfo.company}` : ''}

**📝 Conversation Summary**
${createConversationSummary(transcript)}

**💬 Full Transcript**
\`\`\`
${transcript.substring(0, 1500)}${transcript.length > 1500 ? '\n... (truncated)' : ''}
\`\`\`

**🎯 Recommended Follow-up**
${generateFollowupRecommendations(analysis)}

---
*🔄 This interaction has been logged and will be processed for CRM integration and follow-up scheduling.*`;
}

function determineLeadQuality(transcript: string): string {
  const highQualityKeywords = ['budget', 'timeline', 'project', 'hire', 'contract', 'deadline', 'launch'];
  const mediumQualityKeywords = ['interested', 'tell me more', 'pricing', 'cost', 'quote'];
  const lowQualityKeywords = ['just browsing', 'maybe', 'thinking about', 'someday'];

  const highScore = highQualityKeywords.filter(keyword => transcript.includes(keyword)).length;
  const mediumScore = mediumQualityKeywords.filter(keyword => transcript.includes(keyword)).length;
  const lowScore = lowQualityKeywords.filter(keyword => transcript.includes(keyword)).length;

  if (highScore >= 2) return "🔥 HOT LEAD";
  if (highScore >= 1 || mediumScore >= 2) return "🌡️ WARM LEAD";
  if (mediumScore >= 1) return "❄️ COLD LEAD";
  return "👀 PROSPECT";
}

function extractInterestedServices(transcript: string): string[] {
  const services: string[] = [];
  const serviceKeywords = {
    'Full-Stack Development': ['fullstack', 'full stack', 'web development', 'website', 'web app'],
    'AI Integration': ['ai', 'artificial intelligence', 'chatbot', 'automation'],
    'Mobile Development': ['mobile', 'app', 'ios', 'android'],
    'E-commerce': ['ecommerce', 'e-commerce', 'online store', 'shopify'],
    'Consulting': ['consulting', 'consultation', 'advice', 'strategy'],
    'Custom Software': ['custom', 'bespoke', 'tailored', 'specific needs']
  };

  Object.entries(serviceKeywords).forEach(([service, keywords]) => {
    if (keywords.some(keyword => transcript.includes(keyword))) {
      services.push(service);
    }
  });

  return services.length > 0 ? services : ['General Development Services'];
}

function extractContactInfo(transcript: string): any {
  const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/;
  const phoneRegex = /(\+?1?[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/;
  
  return {
    email: transcript.match(emailRegex)?.[0] || null,
    phone: transcript.match(phoneRegex)?.[0] || null,
    name: extractName(transcript),
    company: extractCompany(transcript)
  };
}

function extractName(transcript: string): string | null {
  const namePatterns = [
    /my name is (\w+\s?\w*)/i,
    /i'm (\w+\s?\w*)/i,
    /this is (\w+\s?\w*)/i
  ];

  for (const pattern of namePatterns) {
    const match = transcript.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function extractCompany(transcript: string): string | null {
  const companyPatterns = [
    /i work for (\w+\s?\w*)/i,
    /from (\w+\s?\w*) company/i,
    /at (\w+\s?\w*) corp/i,
    /(\w+\s?\w*) inc/i
  ];

  for (const pattern of companyPatterns) {
    const match = transcript.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function determineNextActions(transcript: string): string[] {
  const actions = [];
  
  if (transcript.includes('schedule') || transcript.includes('meeting')) {
    actions.push('📅 Schedule consultation call');
  }
  if (transcript.includes('email') || transcript.includes('send')) {
    actions.push('📧 Send detailed proposal');
  }
  if (transcript.includes('quote') || transcript.includes('pricing')) {
    actions.push('💰 Prepare project estimate');
  }
  if (transcript.includes('portfolio') || transcript.includes('examples')) {
    actions.push('💼 Send portfolio examples');
  }
  
  if (actions.length === 0) {
    actions.push('📞 Follow up within 24 hours');
  }
  
  return actions;
}

function determineUrgency(transcript: string): string {
  const urgentKeywords = ['asap', 'urgent', 'rush', 'immediately', 'deadline'];
  const soonKeywords = ['soon', 'quickly', 'fast', 'this week'];
  
  if (urgentKeywords.some(keyword => transcript.includes(keyword))) return 'HIGH';
  if (soonKeywords.some(keyword => transcript.includes(keyword))) return 'MEDIUM';
  return 'LOW';
}

function analyzeSentiment(transcript: string): number {
  const positiveWords = ['great', 'excellent', 'perfect', 'love', 'amazing', 'fantastic'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'disappointing'];
  
  const positiveScore = positiveWords.filter(word => transcript.includes(word)).length;
  const negativeScore = negativeWords.filter(word => transcript.includes(word)).length;
  
  return Math.max(1, Math.min(10, 5 + positiveScore - negativeScore));
}

function createConversationSummary(transcript: string): string {
  const sentences = transcript.split('.').slice(0, 3);
  return sentences.join('.') + (sentences.length === 3 ? '...' : '');
}

function generateFollowupRecommendations(analysis: any): string {
  const recommendations = [];
  
  if (analysis.leadQuality.includes('HOT')) {
    recommendations.push('🔥 Priority follow-up within 2 hours');
    recommendations.push('📞 Direct call from Kenneth recommended');
  } else if (analysis.leadQuality.includes('WARM')) {
    recommendations.push('⏰ Follow-up within 24 hours');
    recommendations.push('📧 Send personalized email with relevant case studies');
  } else {
    recommendations.push('📅 Schedule for weekly follow-up sequence');
    recommendations.push('📚 Add to educational email drip campaign');
  }
  
  if (analysis.urgency === 'HIGH') {
    recommendations.push('🚨 Expedite all follow-up actions');
  }
  
  return recommendations.join('\n');
}

function getLeadQualityEmoji(quality: string): string {
  if (quality.includes('HOT')) return '🔥';
  if (quality.includes('WARM')) return '🌡️';
  if (quality.includes('COLD')) return '❄️';
  return '👀';
}

function getSentimentEmoji(score: number): string {
  if (score >= 8) return '😍';
  if (score >= 6) return '😊';
  if (score >= 4) return '😊';
  return '😞';
}

function getUrgencyEmoji(urgency: string): string {
  if (urgency === 'HIGH') return '🚨';
  if (urgency === 'MEDIUM') return '⚡';
  return '⏰';
}

// GET method for testing
export async function GET() {
  return NextResponse.json({ 
    message: "VAPI webhook endpoint active",
    timestamp: new Date().toISOString()
  });
} 