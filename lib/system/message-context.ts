import { Message } from "@prisma/client";
import { MessageWithMemberWithProfile } from "./types";
import { format } from "date-fns";
import { roles, contextTypes } from "./workflow-patterns";
import {
  extractWorkflowContext,
  extractAutomationContext,
} from "./workflow-patterns";
import { analyzeSentiment } from "./sentiment-analysis";
import { determineContentType } from "./content-routing";

export interface EnhancedMessage {
  role: string;
  content: string;
  author: string;
  timestamp: Date;
  channelName?: string;
  messageType: string;
  isThread: boolean;
  hasAttachments: boolean;
  sentiment?: string;
  workflowId?: string;
  workflowType?: string;
  automationContext?: {
    triggerId?: string;
    triggerType?: string;
    workflowName?: string;
    status?: string;
    resultType?: string;
    channelId?: string;
    testMode?: boolean;
    metadata?: Record<string, any>;
  };
}

export function analyzeMessageContext(
  message: MessageWithMemberWithProfile | Message,
  isCurrentMessage: boolean = false
): EnhancedMessage {
  try {
    // Ensure we have a valid date
    let timestamp: Date;

    if (message.createdAt instanceof Date) {
      timestamp = message.createdAt;
    } else if (typeof message.createdAt === "string") {
      timestamp = new Date(message.createdAt);
    } else {
      console.error("[MESSAGE_CONTEXT] Missing or invalid createdAt:", message);
      timestamp = new Date();
    }

    if (isNaN(timestamp.getTime())) {
      console.error("[MESSAGE_CONTEXT] Invalid timestamp, using current time");
      timestamp = new Date();
    }

    // Extract member and profile information safely
    const member = (message as MessageWithMemberWithProfile).member;
    const profile = member?.profile;
    const author = profile?.name || "Unknown User";

    // Extract channel information safely
    const messageWithChannel = message as any;
    const channelName = messageWithChannel.channel?.name;

    // Extract workflow and automation context
    const workflowContext = extractWorkflowContext(message);
    const automationContext = extractAutomationContext(message);

    // Determine message type with workflow awareness
    const messageType = determineMessageType(message, workflowContext);

    return {
      role: message.role || "user",
      content: message.content || "",
      author,
      timestamp,
      channelName,
      messageType,
      isThread: false,
      hasAttachments: !!message.fileUrl,
      sentiment: isCurrentMessage
        ? analyzeSentiment(message.content || "")
        : undefined,
      workflowId: workflowContext?.workflowId,
      workflowType: workflowContext?.workflowType,
      automationContext: automationContext,
    };
  } catch (error) {
    console.error("[MESSAGE_CONTEXT] Error analyzing message context:", error);
    return {
      role: message.role || "user",
      content: message.content || "",
      author: "Unknown User",
      timestamp: new Date(),
      messageType: "Unknown Message",
      isThread: false,
      hasAttachments: false,
      sentiment: undefined,
    };
  }
}

export function formatMessageForContext(msg: EnhancedMessage): string {
  try {
    // Ensure we have a valid date
    const timestamp =
      msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp);
    if (isNaN(timestamp.getTime())) {
      console.error("[MESSAGE_CONTEXT] Invalid timestamp:", msg.timestamp);
      return `[Invalid Date] ${msg.author}: ${msg.content}`;
    }

    const timeStr = format(timestamp, "PPpp");
    const channelContext = msg.channelName ? `[${msg.channelName}] ` : "";
    const attachmentInfo = msg.hasAttachments ? " [has attachment]" : "";
    const roleInfo = msg.role !== "user" ? ` [${msg.role}]` : "";

    return `${channelContext}${timeStr} - ${msg.author}${roleInfo}: ${msg.content}${attachmentInfo}`;
  } catch (error) {
    console.error("[MESSAGE_CONTEXT] Error formatting message context:", error);
    return `[Format Error] ${msg.author}: ${msg.content}`;
  }
}

export function determineMessageType(
  message: any,
  workflowContext?: { workflowId?: string; workflowType?: string }
): string {
  if (message.role === "system") return contextTypes.system;
  if (message.role === "workflow") return contextTypes.workflow;
  if (message.role === "automation") return contextTypes.automation_result;

  if (workflowContext?.workflowType === "test") {
    return contextTypes.workflow_status;
  }

  if (workflowContext?.workflowId) return contextTypes.workflow;
  if (message.metadata?.automationResult) return contextTypes.automation_result;

  const content = message.content?.toLowerCase() || "";
  const { workflowPatterns } = require("./workflow-patterns");

  if (workflowPatterns.config.test(content))
    return contextTypes.workflow_config;
  if (workflowPatterns.triggers.test(content))
    return contextTypes.workflow_trigger;
  if (workflowPatterns.status.test(content))
    return contextTypes.workflow_status;

  return contextTypes.channel;
}
