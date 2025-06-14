import { MessageWithMember } from "./system-messages";

export interface WorkflowRoute {
  pattern: RegExp | string;
  keywords?: string[];
  priority: number;
  workflowId: string;
  webhookPath: string;
  description: string;
  mode: "sync" | "async";
}

export interface WorkflowPayload {
  message: string;
  userId: string;
  userName: string;
  channelId: string;
  serverId?: string;
  messageId?: string;
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
      description: "General AI assistant",
      mode: "sync"
    }
  ];

  /**
   * Determine if this message requires complex workflow processing
   * or can be handled with simple synchronous chat
   */
  static requiresAsyncWorkflow(message: string, hasFileUrl: boolean = false): boolean {
    // File uploads ALWAYS require async processing for analysis
    if (hasFileUrl) {
      console.log('[WORKFLOW_ROUTER] File detected - forcing async workflow processing');
      return true;
    }
    
    const lowerMessage = message.toLowerCase();
    
    // Complex operations that need async workflow processing
    const asyncKeywords = [
      // Calendar operations
      "schedule", "book", "create meeting", "set appointment", "calendar",
      // Research operations  
      "research", "analyze", "investigate", "find information about",
      // Document operations
      "create document", "generate report", "draft", "prepare",
      // Phone/communication operations
      "call", "phone", "contact", "send email",
      // Search operations (complex)
      "search for", "find all", "lookup", "query database"
    ];
    
    // Check for complex operation indicators
    const hasAsyncKeywords = asyncKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );
    
    // Check for time-based operations (usually complex)
    const hasTimeOperations = /\b(today|tomorrow|next week|schedule|book|meeting)\b/.test(lowerMessage);
    
    // Check for data operations (usually complex)
    const hasDataOperations = /\b(create|generate|analyze|research|find|search)\b/.test(lowerMessage);
    
    return hasAsyncKeywords || hasTimeOperations || hasDataOperations;
  }

  /**
   * Determine which workflow should handle this message
   */
  static getWorkflowRoute(message: string, hasFileUrl: boolean = false): WorkflowRoute {
    const intent = this.detectIntent(message);
    const requiresAsync = this.requiresAsyncWorkflow(message, hasFileUrl);
    
    const route = this.routes[0];
    return {
      ...route,
      workflowId: `${route.workflowId}:${intent}`,
      mode: requiresAsync ? "async" : "sync"
    };
  }

  /**
   * Detect the intent of the message (more specific now)
   */
  static detectIntent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Calendar intents (specific operations)
    if (/\b(schedule|book|create meeting|set appointment|calendar event)\b/.test(lowerMessage)) {
      return "calendar";
    }
    
    // Research intents (complex analysis)
    if (/\b(research|analyze|investigate|study|explore|find information)\b/.test(lowerMessage)) {
      return "research";
    }
    
    // Search intents (database/complex queries)
    if (/\b(search for|find all|lookup|query|locate)\b/.test(lowerMessage)) {
      return "search";
    }
    
    // Phone/call intents (external operations)
    if (/\b(call|phone|dial|contact|reach out)\b/.test(lowerMessage)) {
      return "phone";
    }
    
    // Document intents (creation/generation)
    if (/\b(document|file|report|prepare|draft|generate|create)\b/.test(lowerMessage)) {
      return "document";
    }
    
    // Status/info requests (simple)
    if (/\b(status|how are you|what's up|hello|hi|hey)\b/.test(lowerMessage)) {
      return "status";
    }
    
    // Default to general conversation
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
    serverId?: string,
    messageId?: string
  ): WorkflowPayload {
    const intent = this.detectIntent(message.content);
    
    return {
      message: message.content,
      userId: message.member.profile.id,
      userName: message.member.profile.name,
      channelId,
      serverId,
      messageId,
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