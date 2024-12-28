import { Message } from "@prisma/client";
import { MessageWithMemberWithProfile } from "./types";
import { analyzeLLM } from "../llm-provider";
import { format } from "date-fns";

// Message analysis configuration
const MESSAGE_ANALYSIS = {
  maxContextMessages: 25,
  maxMessageLength: 2000,
  roles: {
    system: "System Administrator",
    user: "Channel Member",
    moderator: "Channel Moderator",
    admin: "Server Admin",
    guest: "Guest User",
    automation: "Automation Workflow",
    workflow: "Workflow System",
    bot: "Bot User",
  },
  contextTypes: {
    direct: "Direct Message",
    channel: "Channel Message",
    thread: "Thread Message",
    system: "System Message",
    command: "System Command",
    notification: "System Notification",
    workflow: "Workflow Message",
    automation_result: "Automation Result",
    workflow_status: "Workflow Status",
    workflow_trigger: "Workflow Trigger",
    workflow_config: "Workflow Config",
    image_analysis: "Image Analysis",
    content_routing: "Content Routing",
  },
  // Administrative and automation patterns to recognize
  patterns: {
    // Content routing patterns
    imageContent: /\.(jpg|jpeg|png|gif|webp|bmp)$/i,
    furnitureContext:
      /\b(furniture|chair|table|desk|sofa|couch|cabinet|shelf|bed)\b/i,
    inventoryContext: /\b(inventory|stock|item|product|collection|catalog)\b/i,
    expenseContext: /\b(expense|cost|price|payment|receipt|bill)\b/i,
    mileageContext: /\b(mileage|distance|travel|trip|odometer|car|vehicle)\b/i,
    foodContext: /\b(food|meal|recipe|ingredient|calorie|nutrition)\b/i,
    collectionContext:
      /\b(collection|collectible|coin|stamp|beer|can|value|grade|condition)\b/i,

    // Administrative commands
    commands:
      /^[!/](help|info|status|config|settings|mod|admin|setup|invite|role|perms|ban|kick|mute|broadcast)/i,
    mentions: /@(everyone|here|admin|mod|system|workflow)/i,
    systemQueries:
      /\b(system|admin|settings|configuration|permissions|roles|status|health)\b/i,

    // Workflow and automation patterns
    workflowTriggers: /^(trigger|run|execute|start|automate|process)/i,
    workflowCommands: /^[!/](workflow|automation|flow|trigger|run|config)/i,
    workflowConfig:
      /\b(workflow|automation|trigger|action|condition|filter|channel|config)\b/i,
    workflowStatus:
      /\b(success|failed|completed|error|running|pending|processed)\b/i,
    workflowTest:
      /\b(test|testing|debug|verify)\b.*\b(workflow|automation|flow)\b/i,
    workflowChannel: /\b(channel|chat)\b.*\b(workflow|automation|config)\b/i,
    workflowResults: /\b(result|output|response)\b.*\b(workflow|automation)\b/i,
  },
  // Channel workflow configuration
  workflowTypes: {
    message_trigger: "Message Trigger",
    scheduled: "Scheduled Trigger",
    event_based: "Event Trigger",
    conditional: "Conditional Trigger",
    channel_based: "Channel Trigger",
    test: "Test Workflow",
  },
};

interface EnhancedMessage {
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

interface ContentRoutingRule {
  pattern: RegExp;
  targetChannel: string;
  priority: number;
  description: string;
}

const contentRoutingRules: ContentRoutingRule[] = [
  {
    pattern: MESSAGE_ANALYSIS.patterns.furnitureContext,
    targetChannel: "furniture",
    priority: 1,
    description: "Route furniture-related content",
  },
  {
    pattern: MESSAGE_ANALYSIS.patterns.inventoryContext,
    targetChannel: "inventory",
    priority: 2,
    description: "Route inventory-related content",
  },
  {
    pattern: MESSAGE_ANALYSIS.patterns.expenseContext,
    targetChannel: "expenses",
    priority: 1,
    description: "Route expense-related content",
  },
  {
    pattern: MESSAGE_ANALYSIS.patterns.mileageContext,
    targetChannel: "mileage",
    priority: 1,
    description: "Route mileage-related content",
  },
  {
    pattern: MESSAGE_ANALYSIS.patterns.foodContext,
    targetChannel: "food",
    priority: 1,
    description: "Route food and nutrition content",
  },
  {
    pattern: MESSAGE_ANALYSIS.patterns.collectionContext,
    targetChannel: "collections",
    priority: 1,
    description: "Route collectibles content",
  },
];

function determineContentType(
  message: any,
  previousMessages: any[]
): {
  contentType: string;
  targetChannel?: string;
  confidence: number;
} {
  // Check for image content
  if (
    message.fileUrl &&
    MESSAGE_ANALYSIS.patterns.imageContent.test(message.fileUrl)
  ) {
    // Look at previous messages for context
    const recentContext = previousMessages
      .slice(-5)
      .map((msg) => msg.content)
      .join(" ")
      .toLowerCase();

    // Check each routing rule
    for (const rule of contentRoutingRules) {
      if (rule.pattern.test(recentContext)) {
        return {
          contentType: "image_analysis",
          targetChannel: rule.targetChannel,
          confidence: 0.8,
        };
      }
    }

    // Default image handling
    return {
      contentType: "image_analysis",
      confidence: 0.5,
    };
  }

  // Check text content against routing rules
  const content = message.content?.toLowerCase() || "";
  for (const rule of contentRoutingRules) {
    if (rule.pattern.test(content)) {
      return {
        contentType: "content_routing",
        targetChannel: rule.targetChannel,
        confidence: 0.7,
      };
    }
  }

  return {
    contentType: "channel",
    confidence: 1.0,
  };
}

function analyzeMessageContext(
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
      console.error(
        "[MESSAGE_ANALYSIS] Missing or invalid createdAt:",
        message
      );
      timestamp = new Date(); // Fallback to current time
    }

    if (isNaN(timestamp.getTime())) {
      console.error("[MESSAGE_ANALYSIS] Invalid timestamp, using current time");
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
    console.error("[MESSAGE_ANALYSIS] Error analyzing message context:", error);
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

function extractWorkflowContext(message: any): {
  workflowId?: string;
  workflowType?: string;
} {
  try {
    // Extract workflow information from message metadata or content
    const workflowId = message.workflowId || message.metadata?.workflowId;
    const workflowType = message.workflowType || message.metadata?.workflowType;

    // Try to detect workflow context from message content
    if (!workflowId && message.content) {
      const patterns = MESSAGE_ANALYSIS.patterns;
      const content = message.content.toLowerCase();

      // Check for test workflows
      if (patterns.workflowTest.test(content)) {
        return { workflowType: MESSAGE_ANALYSIS.workflowTypes.test };
      }

      // Check for channel-based workflows
      if (patterns.workflowChannel.test(content)) {
        return { workflowType: MESSAGE_ANALYSIS.workflowTypes.channel_based };
      }

      // Check for workflow triggers
      if (patterns.workflowTriggers.test(content)) {
        return { workflowType: MESSAGE_ANALYSIS.workflowTypes.message_trigger };
      }

      // Check for workflow commands
      if (patterns.workflowCommands.test(content)) {
        return { workflowType: MESSAGE_ANALYSIS.workflowTypes.event_based };
      }
    }

    return { workflowId, workflowType };
  } catch (error) {
    console.error(
      "[MESSAGE_ANALYSIS] Error extracting workflow context:",
      error
    );
    return {};
  }
}

function extractAutomationContext(
  message: any
): EnhancedMessage["automationContext"] {
  try {
    // Extract automation context from message metadata
    const automationContext =
      message.automationContext || message.metadata?.automation;
    if (automationContext) {
      return automationContext;
    }

    // Try to detect automation context from message content
    const content = message.content || "";
    const patterns = MESSAGE_ANALYSIS.patterns;

    // Check for test mode
    const isTest = patterns.workflowTest.test(content);

    // Check for workflow status
    if (patterns.workflowStatus.test(content)) {
      return {
        status: content.match(patterns.workflowStatus)[0].toLowerCase(),
        resultType: "status_update",
        testMode: isTest,
      };
    }

    // Check for workflow results
    if (patterns.workflowResults.test(content)) {
      return {
        resultType: "workflow_result",
        testMode: isTest,
      };
    }

    // Check for channel configuration
    if (patterns.workflowChannel.test(content)) {
      return {
        resultType: "channel_config",
        channelId: message.channelId,
        testMode: isTest,
      };
    }

    return undefined;
  } catch (error) {
    console.error(
      "[MESSAGE_ANALYSIS] Error extracting automation context:",
      error
    );
    return undefined;
  }
}

function determineMessageType(
  message: any,
  workflowContext?: { workflowId?: string; workflowType?: string }
): string {
  if (message.role === "system") return MESSAGE_ANALYSIS.contextTypes.system;
  if (message.role === "workflow")
    return MESSAGE_ANALYSIS.contextTypes.workflow;
  if (message.role === "automation")
    return MESSAGE_ANALYSIS.contextTypes.automation_result;

  if (workflowContext?.workflowType === MESSAGE_ANALYSIS.workflowTypes.test) {
    return MESSAGE_ANALYSIS.contextTypes.workflow_status;
  }

  if (workflowContext?.workflowId)
    return MESSAGE_ANALYSIS.contextTypes.workflow;
  if (message.metadata?.automationResult)
    return MESSAGE_ANALYSIS.contextTypes.automation_result;

  const content = message.content?.toLowerCase() || "";
  const patterns = MESSAGE_ANALYSIS.patterns;

  if (patterns.workflowConfig.test(content))
    return MESSAGE_ANALYSIS.contextTypes.workflow_config;
  if (patterns.workflowTriggers.test(content))
    return MESSAGE_ANALYSIS.contextTypes.workflow_trigger;
  if (patterns.workflowStatus.test(content))
    return MESSAGE_ANALYSIS.contextTypes.workflow_status;

  return MESSAGE_ANALYSIS.contextTypes.channel;
}

function analyzeSentiment(content: string): string {
  // Enhanced sentiment analysis with workflow awareness
  const patterns = MESSAGE_ANALYSIS.patterns;

  // Check for workflow and automation patterns first
  if (patterns.workflowTriggers.test(content)) return "workflow_trigger";
  if (patterns.workflowCommands.test(content)) return "workflow_command";
  if (patterns.workflowConfig.test(content)) return "workflow_config";
  if (patterns.workflowStatus.test(content)) return "workflow_status";
  if (patterns.workflowTest.test(content)) return "workflow_test";
  if (patterns.workflowResults.test(content)) return "workflow_result";
  if (patterns.workflowChannel.test(content)) return "workflow_channel";

  // Check administrative patterns
  if (patterns.commands.test(content)) return "command";
  if (patterns.mentions.test(content)) return "mention";
  if (patterns.systemQueries.test(content)) return "system_query";

  // Then check for general sentiment
  const urgent = /\b(urgent|asap|emergency|critical|important)\b/i;
  const request = /\b(please|could you|would you|can you|help|assist)\b/i;
  const feedback =
    /\b(thanks|thank you|great|good|awesome|nice|perfect|excellent)\b/i;
  const issue = /\b(error|issue|problem|bug|fail|crash|broken|not working)\b/i;
  const question =
    /\b(what|how|why|when|where|who|can|could|would|will|should)\b.*\?/i;

  if (urgent.test(content)) return "urgent";
  if (question.test(content)) return "question";
  if (issue.test(content)) return "issue";
  if (feedback.test(content)) return "feedback";
  if (request.test(content)) return "request";

  return "general";
}

function formatMessageForContext(msg: EnhancedMessage): string {
  try {
    // Ensure we have a valid date
    const timestamp =
      msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp);
    if (isNaN(timestamp.getTime())) {
      console.error("[MESSAGE_ANALYSIS] Invalid timestamp:", msg.timestamp);
      return `[Invalid Date] ${msg.author}: ${msg.content}`;
    }

    const timeStr = format(timestamp, "PPpp");
    const channelContext = msg.channelName ? `[${msg.channelName}] ` : "";
    const attachmentInfo = msg.hasAttachments ? " [has attachment]" : "";
    const roleInfo = msg.role !== "user" ? ` [${msg.role}]` : "";

    return `${channelContext}${timeStr} - ${msg.author}${roleInfo}: ${msg.content}${attachmentInfo}`;
  } catch (error) {
    console.error(
      "[MESSAGE_ANALYSIS] Error formatting message context:",
      error
    );
    return `[Format Error] ${msg.author}: ${msg.content}`;
  }
}

function buildConversationSummary(messages: EnhancedMessage[]): string {
  const totalMessages = messages.length;
  const uniqueAuthors = new Set(messages.map((m) => m.author));
  const uniqueRoles = new Set(messages.map((m) => m.role));
  const hasSystemMessages = messages.some((m) => m.role === "system");
  const hasAttachments = messages.some((m) => m.hasAttachments);
  const channels = new Set(
    messages.filter((m) => m.channelName).map((m) => m.channelName)
  );

  // Analyze workflow patterns
  const workflowPatterns = {
    triggers: messages.filter((m) => m.sentiment === "workflow_trigger").length,
    commands: messages.filter((m) => m.sentiment === "workflow_command").length,
    configs: messages.filter((m) => m.sentiment === "workflow_config").length,
    statuses: messages.filter((m) => m.sentiment === "workflow_status").length,
  };

  // Calculate automation metrics
  const automationMetrics = {
    workflowMessages: messages.filter((m) => m.workflowId).length,
    automationResults: messages.filter(
      (m) => m.messageType === MESSAGE_ANALYSIS.contextTypes.automation_result
    ).length,
    activeWorkflows: new Set(
      messages.filter((m) => m.workflowId).map((m) => m.workflowId)
    ).size,
  };

  return `
=== Administrative Overview ===
• Active Channels: ${
    channels.size > 0 ? Array.from(channels).join(", ") : "Direct Message"
  }
• Participants: ${uniqueAuthors.size} (Roles: ${Array.from(uniqueRoles).join(
    ", "
  )})
• Message Volume: ${totalMessages} messages
• System Activity: ${hasSystemMessages ? "Active" : "Inactive"}
• Attachments: ${hasAttachments ? "Present" : "None"}

=== Workflow Activity ===
• Active Workflows: ${automationMetrics.activeWorkflows}
• Workflow Messages: ${automationMetrics.workflowMessages}
• Automation Results: ${automationMetrics.automationResults}
• Workflow Triggers: ${workflowPatterns.triggers}
• Workflow Commands: ${workflowPatterns.commands}
• Configuration Updates: ${workflowPatterns.configs}
• Status Updates: ${workflowPatterns.statuses}

=== Channel Context ===
${Array.from(channels)
  .map((channel) => {
    const channelMessages = messages.filter((m) => m.channelName === channel);
    const channelWorkflows = new Set(
      channelMessages.filter((m) => m.workflowId).map((m) => m.workflowId)
    ).size;
    return `• ${channel}: ${channelMessages.length} messages, ${channelWorkflows} active workflows`;
  })
  .join("\n")}
`;
}

export async function analyzeMessage(
  currentMessage: Message,
  previousMessages: MessageWithMemberWithProfile[] | any[],
  contextualPrompt?: string
): Promise<string> {
  try {
    console.log("[MESSAGE_ANALYSIS] Starting message analysis");

    // Process current message
    const enhancedCurrentMessage = analyzeMessageContext(currentMessage, true);

    // Determine content type and routing
    const contentAnalysis = determineContentType(
      currentMessage,
      previousMessages
    );

    // Filter and process previous messages
    const validPreviousMessages = previousMessages
      .filter((msg) => msg && msg.content && msg.createdAt)
      .map((msg) => analyzeMessageContext(msg))
      .filter((msg): msg is EnhancedMessage => msg !== null)
      .slice(-MESSAGE_ANALYSIS.maxContextMessages);

    // Build conversation summary with routing info
    const conversationSummary = buildConversationSummary([
      ...validPreviousMessages,
      enhancedCurrentMessage,
    ]);

    // Format messages for context
    const formattedMessages = validPreviousMessages
      .map((msg) => formatMessageForContext(msg))
      .join("\n");

    // Create enhanced analysis prompt
    const analysisPrompt = `
${conversationSummary}

=== Current Message Analysis ===
Time: ${format(enhancedCurrentMessage.timestamp, "PPpp")}
Author: ${enhancedCurrentMessage.author}
Type: ${enhancedCurrentMessage.messageType}
Content Type: ${contentAnalysis.contentType}${
      contentAnalysis.targetChannel
        ? ` (Target: ${contentAnalysis.targetChannel})`
        : ""
    }
Confidence: ${contentAnalysis.confidence}
Content: ${enhancedCurrentMessage.content}
${enhancedCurrentMessage.hasAttachments ? "Has Attachments: Yes" : ""}

=== Conversation History ===
${formattedMessages}

=== Additional Context ===
${contextualPrompt || "No additional context provided"}
`;

    // Get LLM response
    const response = await analyzeLLM(analysisPrompt, contextualPrompt);
    return response;
  } catch (error) {
    console.error("[MESSAGE_ANALYSIS_ERROR]", error);
    return `I'll continue our conversation: ${currentMessage.content}`;
  }
}
