import { MessageWithMember } from "./system-messages";

export interface WorkflowRoute {
  pattern: RegExp | string;
  keywords?: string[];
  priority: number;
  workflowId: string;
  webhookPath: string;
  description: string;
}

export interface WorkflowPayload {
  message: string;
  userId: string;
  userName: string;
  channelId: string;
  serverId?: string;
  timestamp: string;
  metadata: {
    platform: string;
    messageType: string;
    hasAttachment: boolean;
    attachmentUrl?: string;
    priority: string;
    sessionId: string;
    routedBy: string;
    workflowId: string;
    intent?: string;
  };
}

export class WorkflowRouter {
  private static routes: WorkflowRoute[] = [
    {
      pattern: /.*/,
      keywords: [],
      priority: 1,
      workflowId: "general-assistant",
      webhookPath: "discordant-ai-services",
      description: "General AI assistant"
    }
  ];

  /**
   * Determine which workflow should handle this message
   * For now, everything goes to the general assistant
   */
  static getWorkflowRoute(message: string): WorkflowRoute {
    const intent = this.detectIntent(message);
    
    const route = this.routes[0];
    return {
      ...route,
      workflowId: `${route.workflowId}:${intent}`
    };
  }

  /**
   * Detect the intent of the message
   */
  static detectIntent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Search intents - check first as they might overlap with others
    if (/search|find|look for|looking for|locate|where|query/.test(lowerMessage)) {
      return "search";
    }
    
    // Calendar intents
    if (/calendar|schedule|meeting|appointment|event|booking/.test(lowerMessage)) {
      return "calendar";
    }
    
    // Research intents
    if (/research|analyze|investigate|study|explore|find out/.test(lowerMessage)) {
      return "research";
    }
    
    // Phone/call intents
    if (/call|phone|dial|contact|reach out/.test(lowerMessage)) {
      return "phone";
    }
    
    // Document intents
    if (/document|file|report|prepare|draft/.test(lowerMessage)) {
      return "document";
    }
    
    // Default
    return "general";
  }

  /**
   * Build the webhook URL for the determined workflow
   */
  static getWebhookUrl(route: WorkflowRoute): string {
    const rawN8nUrl = process.env.N8N_WEBHOOK_URL || "https://n8n.kendev.co/webhook";
    // Sanitize the URL by removing quotes and semicolons
    const n8nBaseUrl = rawN8nUrl.replace(/[";]/g, '').trim();
    return `${n8nBaseUrl}/${route.webhookPath}`;
  }

  /**
   * Create a standardized payload for n8n workflows
   */
  static createWorkflowPayload(
    message: MessageWithMember,
    route: WorkflowRoute,
    channelId: string,
    serverId?: string
  ): WorkflowPayload {
    const intent = this.detectIntent(message.content);
    
    return {
      message: message.content,
      userId: message.member.profile.id,
      userName: message.member.profile.name,
      channelId,
      serverId,
      timestamp: new Date().toISOString(),
      metadata: {
        platform: "discordant-chat",
        messageType: message.fileUrl ? "file" : "text",
        hasAttachment: !!message.fileUrl,
        attachmentUrl: message.fileUrl || undefined,
        priority: this.getMessagePriority(message.content),
        sessionId: `${message.member.profile.id}-${channelId}`,
        routedBy: "workflow-router",
        workflowId: route.workflowId,
        intent: intent
      }
    };
  }

  /**
   * Determine message priority based on content
   */
  private static getMessagePriority(content: string): string {
    const urgentKeywords = ["urgent", "asap", "emergency", "critical", "immediately"];
    const highKeywords = ["important", "priority", "soon", "today"];
    
    const contentLower = content.toLowerCase();
    
    if (urgentKeywords.some(keyword => contentLower.includes(keyword))) {
      return "urgent";
    }
    if (highKeywords.some(keyword => contentLower.includes(keyword))) {
      return "high";
    }
    return "normal";
  }

  /**
   * Get tenant-specific webhook path
   */
  static getTenantWebhookPath(tenantId: string): string {
    const tenantPaths: Record<string, string> = {
      'kendev': 'assistant',
      'nrg': 'nrg-assistant',
    };
    
    return tenantPaths[tenantId] || 'assistant';
  }
} 