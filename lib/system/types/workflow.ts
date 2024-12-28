export interface WorkflowContext {
  workflowId?: string;
  workflowType?: string;
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
