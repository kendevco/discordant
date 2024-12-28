// Workflow and automation patterns
export const workflowPatterns = {
  // Command patterns
  triggers: /^(trigger|run|execute|start|automate|process)/i,
  commands: /^[!/](workflow|automation|flow|trigger|run|config)/i,
  config:
    /\b(workflow|automation|trigger|action|condition|filter|channel|config)\b/i,
  status: /\b(success|failed|completed|error|running|pending|processed)\b/i,
  test: /\b(test|testing|debug|verify)\b.*\b(workflow|automation|flow)\b/i,
  channel: /\b(channel|chat)\b.*\b(workflow|automation|config)\b/i,
  results: /\b(result|output|response)\b.*\b(workflow|automation)\b/i,

  // Administrative patterns
  adminCommands:
    /^[!/](help|info|status|config|settings|mod|admin|setup|invite|role|perms|ban|kick|mute|broadcast)/i,
  mentions: /@(everyone|here|admin|mod|system|workflow)/i,
  systemQueries:
    /\b(system|admin|settings|configuration|permissions|roles|status|health)\b/i,
};

export const workflowTypes = {
  message_trigger: "Message Trigger",
  scheduled: "Scheduled Trigger",
  event_based: "Event Trigger",
  conditional: "Conditional Trigger",
  channel_based: "Channel Trigger",
  test: "Test Workflow",
} as const;

export const contextTypes = {
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
} as const;

export const roles = {
  system: "System Administrator",
  user: "Channel Member",
  moderator: "Channel Moderator",
  admin: "Server Admin",
  guest: "Guest User",
  automation: "Automation Workflow",
  workflow: "Workflow System",
  bot: "Bot User",
} as const;

export interface WorkflowContext {
  workflowId?: string;
  workflowType?: keyof typeof workflowTypes;
}

export interface AutomationContext {
  triggerId?: string;
  triggerType?: string;
  workflowName?: string;
  status?: string;
  resultType?: string;
  channelId?: string;
  testMode?: boolean;
  metadata?: Record<string, any>;
}

export function extractWorkflowContext(message: {
  content?: string;
  workflowId?: string;
  workflowType?: string;
  metadata?: any;
}): WorkflowContext {
  try {
    // Extract workflow information from message metadata or content
    const workflowId = message.workflowId || message.metadata?.workflowId;
    const workflowType = message.workflowType || message.metadata?.workflowType;

    // Try to detect workflow context from message content
    if (!workflowId && message.content) {
      const content = message.content.toLowerCase();

      // Check for test workflows
      if (workflowPatterns.test.test(content)) {
        return { workflowType: "test" };
      }

      // Check for channel-based workflows
      if (workflowPatterns.channel.test(content)) {
        return { workflowType: "channel_based" };
      }

      // Check for workflow triggers
      if (workflowPatterns.triggers.test(content)) {
        return { workflowType: "message_trigger" };
      }

      // Check for workflow commands
      if (workflowPatterns.commands.test(content)) {
        return { workflowType: "event_based" };
      }
    }

    return {
      workflowId,
      workflowType: workflowType as keyof typeof workflowTypes,
    };
  } catch (error) {
    console.error(
      "[WORKFLOW_PATTERNS] Error extracting workflow context:",
      error
    );
    return {};
  }
}

export function extractAutomationContext(message: {
  content?: string;
  channelId?: string;
  metadata?: any;
}): AutomationContext | undefined {
  try {
    // Extract automation context from message metadata
    const automationContext = message.metadata?.automation;
    if (automationContext) {
      return automationContext;
    }

    // Try to detect automation context from message content
    const content = message.content || "";

    // Check for test mode
    const isTest = workflowPatterns.test.test(content);

    // Check for workflow status
    if (workflowPatterns.status.test(content)) {
      return {
        status: content.match(workflowPatterns.status)?.[0].toLowerCase(),
        resultType: "status_update",
        testMode: isTest,
      };
    }

    // Check for workflow results
    if (workflowPatterns.results.test(content)) {
      return {
        resultType: "workflow_result",
        testMode: isTest,
      };
    }

    // Check for channel configuration
    if (workflowPatterns.channel.test(content)) {
      return {
        resultType: "channel_config",
        channelId: message.channelId,
        testMode: isTest,
      };
    }

    return undefined;
  } catch (error) {
    console.error(
      "[WORKFLOW_PATTERNS] Error extracting automation context:",
      error
    );
    return undefined;
  }
}
