import { EnhancedMessage } from "./message-context";
import { contextTypes } from "./workflow-patterns";

export function buildConversationSummary(messages: EnhancedMessage[]): string {
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
      (m) => m.messageType === contextTypes.automation_result
    ).length,
    activeWorkflows: new Set(
      messages.filter((m) => m.workflowId).map((m) => m.workflowId)
    ).size,
  };

  // Build channel activity summary
  const channelSummary = Array.from(channels)
    .map((channel) => {
      const channelMessages = messages.filter((m) => m.channelName === channel);
      const channelWorkflows = new Set(
        channelMessages.filter((m) => m.workflowId).map((m) => m.workflowId)
      ).size;
      return `• ${channel}: ${channelMessages.length} messages, ${channelWorkflows} active workflows`;
    })
    .join("\n");

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
${channelSummary}
`;
}
