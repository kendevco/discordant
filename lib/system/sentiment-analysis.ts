import { workflowPatterns } from "./workflow-patterns";

// Sentiment patterns
const sentimentPatterns = {
  urgent: /\b(urgent|asap|emergency|critical|important)\b/i,
  request: /\b(please|could you|would you|can you|help|assist)\b/i,
  feedback: /\b(thanks|thank you|great|good|awesome|nice|perfect|excellent)\b/i,
  issue: /\b(error|issue|problem|bug|fail|crash|broken|not working)\b/i,
  question:
    /\b(what|how|why|when|where|who|can|could|would|will|should)\b.*\?/i,
};

export type SentimentType =
  | "workflow_trigger"
  | "workflow_command"
  | "workflow_config"
  | "workflow_status"
  | "workflow_test"
  | "workflow_result"
  | "workflow_channel"
  | "command"
  | "mention"
  | "system_query"
  | "urgent"
  | "question"
  | "issue"
  | "feedback"
  | "request"
  | "general";

export function analyzeSentiment(content: string): SentimentType {
  // Check for workflow and automation patterns first
  if (workflowPatterns.triggers.test(content)) return "workflow_trigger";
  if (workflowPatterns.commands.test(content)) return "workflow_command";
  if (workflowPatterns.config.test(content)) return "workflow_config";
  if (workflowPatterns.status.test(content)) return "workflow_status";
  if (workflowPatterns.test.test(content)) return "workflow_test";
  if (workflowPatterns.results.test(content)) return "workflow_result";
  if (workflowPatterns.channel.test(content)) return "workflow_channel";

  // Check administrative patterns
  if (workflowPatterns.adminCommands.test(content)) return "command";
  if (workflowPatterns.mentions.test(content)) return "mention";
  if (workflowPatterns.systemQueries.test(content)) return "system_query";

  // Check general sentiment patterns
  if (sentimentPatterns.urgent.test(content)) return "urgent";
  if (sentimentPatterns.question.test(content)) return "question";
  if (sentimentPatterns.issue.test(content)) return "issue";
  if (sentimentPatterns.feedback.test(content)) return "feedback";
  if (sentimentPatterns.request.test(content)) return "request";

  return "general";
}
