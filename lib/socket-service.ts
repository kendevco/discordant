// Legacy Socket.IO service - now stubbed for SSE compatibility
// Real-time updates are now handled by the SSE system

export interface SocketMessage {
  id: string;
  content: string;
  channelId?: string;
  conversationId?: string;
  member: {
    id: string;
    profile: {
      id: string;
      name: string;
      imageUrl?: string;
    };
  };
  role: "user" | "system";
  createdAt: Date;
  updatedAt: Date;
  fileUrl?: string;
  _external?: boolean;
  _sourceType?: string;
  _forceUpdate?: boolean;
}

/**
 * External Socket Service - Stubbed for SSE compatibility
 * Real-time updates are now handled by Server-Sent Events (SSE)
 */
export class ExternalSocketService {
  private static instance: ExternalSocketService;

  private constructor() {}

  static getInstance(): ExternalSocketService {
    if (!ExternalSocketService.instance) {
      ExternalSocketService.instance = new ExternalSocketService();
    }
    return ExternalSocketService.instance;
  }

  /**
   * Initialize socket server reference - STUBBED
   */
  initializeSocket(io: any) {
    console.log("[EXTERNAL_SOCKET] Socket.IO removed - using SSE for real-time updates");
  }

  /**
   * Emit message to channel - STUBBED (SSE handles real-time updates)
   */
  emitChannelMessage(channelId: string, message: SocketMessage, io?: any) {
    console.log(`[EXTERNAL_SOCKET] Channel message logged (SSE handles real-time): ${channelId}`);
    // Note: Real-time updates are now handled by SSE system
    // The message is already saved to database and will be picked up by SSE polling
    return true;
  }

  /**
   * Emit direct message to conversation - STUBBED (SSE handles real-time updates)
   */
  emitDirectMessage(conversationId: string, message: SocketMessage, io?: any) {
    console.log(`[EXTERNAL_SOCKET] Direct message logged (SSE handles real-time): ${conversationId}`);
    // Note: Real-time updates are now handled by SSE system
    // The message is already saved to database and will be picked up by SSE polling
    return true;
  }

  /**
   * Emit external integration events - STUBBED
   */
  emitExternalEvent(eventType: string, data: any, io?: any) {
    console.log(`[EXTERNAL_SOCKET] External event logged: ${eventType}`);
    // Note: External events are now handled by SSE system or direct API calls
    return true;
  }

  /**
   * Emit agent status update - STUBBED
   */
  emitAgentStatusUpdate(agentId: string, status: {
    isOnline: boolean;
    lastActive: Date;
    messageCount: number;
    agentType: string;
    displayName: string;
  }, io?: any) {
    console.log(`[EXTERNAL_SOCKET] Agent status logged: ${agentId}`);
    // Note: Agent status updates are now handled by SSE system or direct API calls
    return true;
  }

  /**
   * Emit visitor activity - STUBBED
   */
  emitVisitorActivity(sessionId: string, activity: {
    type: string;
    data: any;
    channelId?: string;
    conversationId?: string;
  }, io?: any) {
    console.log(`[EXTERNAL_SOCKET] Visitor activity logged: ${sessionId}`);
    // Note: Visitor activity is now handled by SSE system or direct API calls
    return true;
  }

  /**
   * Emit workflow execution status - STUBBED
   */
  emitWorkflowExecution(workflowData: {
    workflowId: string;
    executionId: string;
    status: 'started' | 'completed' | 'failed';
    externalMessageId?: string;
    responseMessageId?: string;
    processingTime?: number;
    error?: string;
  }, io?: any) {
    console.log(`[EXTERNAL_SOCKET] Workflow execution logged: ${workflowData.workflowId}`);
    // Note: Workflow execution status is now handled by SSE system or direct API calls
    return true;
  }

  /**
   * Emit portfolio notification - STUBBED
   */
  emitPortfolioNotification(notification: {
    type: 'contact-form' | 'ai-response' | 'admin-action' | 'system-alert';
    title: string;
    message: string;
    sessionId?: string;
    channelId?: string;
    messageId?: string;
    metadata?: any;
  }, io?: any) {
    console.log(`[EXTERNAL_SOCKET] Portfolio notification logged: ${notification.type}`);
    // Note: Portfolio notifications are now handled by SSE system or direct API calls
    return true;
  }

  /**
   * Get socket server instance - STUBBED
   */
  getSocketServer(): any | null {
    return null; // Socket.IO removed - using SSE
  }

  /**
   * Check if socket server is available - STUBBED
   */
  isSocketAvailable(): boolean {
    return false; // Socket.IO removed - using SSE
  }
}

// Export singleton instance
export const externalSocketService = ExternalSocketService.getInstance(); 