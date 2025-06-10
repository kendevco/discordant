import { Server as NetServer } from "http";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

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

export interface SocketIOResponse {
  socket: {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
}

/**
 * Socket service for external integrations
 */
export class ExternalSocketService {
  private static instance: ExternalSocketService;
  private io: SocketIOServer | null = null;

  private constructor() {}

  static getInstance(): ExternalSocketService {
    if (!ExternalSocketService.instance) {
      ExternalSocketService.instance = new ExternalSocketService();
    }
    return ExternalSocketService.instance;
  }

  /**
   * Initialize socket server reference
   */
  initializeSocket(io: SocketIOServer) {
    this.io = io;
    console.log("[EXTERNAL_SOCKET] Socket server initialized for external integrations");
  }

  /**
   * Emit message to channel
   */
  emitChannelMessage(channelId: string, message: SocketMessage, io?: SocketIOServer) {
    const socketIO = io || this.io;
    if (!socketIO) {
      console.warn("[EXTERNAL_SOCKET] No socket server available for channel message");
      return false;
    }

    const channelKey = `chat:${channelId}:messages`;
    
    try {
      socketIO.emit(channelKey, {
        ...message,
        _external: true,
        _forceUpdate: true
      });
      
      console.log(`[EXTERNAL_SOCKET] ✅ Channel message emitted: ${channelKey}`);
      
      // Also emit to external listeners
      this.emitExternalEvent('message-created', {
        type: 'channel',
        channelId,
        messageId: message.id,
        sourceType: message._sourceType,
        timestamp: new Date().toISOString()
      }, socketIO);
      
      return true;
    } catch (error) {
      console.error("[EXTERNAL_SOCKET] ❌ Failed to emit channel message:", error);
      return false;
    }
  }

  /**
   * Emit direct message to conversation
   */
  emitDirectMessage(conversationId: string, message: SocketMessage, io?: SocketIOServer) {
    const socketIO = io || this.io;
    if (!socketIO) {
      console.warn("[EXTERNAL_SOCKET] No socket server available for direct message");
      return false;
    }

    const conversationKey = `conversation:${conversationId}:messages`;
    
    try {
      socketIO.emit(conversationKey, {
        ...message,
        _external: true,
        _forceUpdate: true
      });
      
      console.log(`[EXTERNAL_SOCKET] ✅ Direct message emitted: ${conversationKey}`);
      
      // Also emit to external listeners
      this.emitExternalEvent('message-created', {
        type: 'conversation',
        conversationId,
        messageId: message.id,
        sourceType: message._sourceType,
        timestamp: new Date().toISOString()
      }, socketIO);
      
      return true;
    } catch (error) {
      console.error("[EXTERNAL_SOCKET] ❌ Failed to emit direct message:", error);
      return false;
    }
  }

  /**
   * Emit external integration events
   */
  emitExternalEvent(eventType: string, data: any, io?: SocketIOServer) {
    const socketIO = io || this.io;
    if (!socketIO) {
      console.warn("[EXTERNAL_SOCKET] No socket server available for external event");
      return false;
    }

    try {
      // Emit to external event channel
      socketIO.emit(`external:${eventType}`, data);
      
      // Emit to specific channels if applicable
      if (data.channelId) {
        socketIO.emit(`external:channel:${data.channelId}:${eventType}`, data);
      }
      
      if (data.conversationId) {
        socketIO.emit(`external:conversation:${data.conversationId}:${eventType}`, data);
      }
      
      console.log(`[EXTERNAL_SOCKET] ✅ External event emitted: ${eventType}`);
      return true;
    } catch (error) {
      console.error("[EXTERNAL_SOCKET] ❌ Failed to emit external event:", error);
      return false;
    }
  }

  /**
   * Emit agent status update
   */
  emitAgentStatusUpdate(agentId: string, status: {
    isOnline: boolean;
    lastActive: Date;
    messageCount: number;
    agentType: string;
    displayName: string;
  }, io?: SocketIOServer) {
    const socketIO = io || this.io;
    if (!socketIO) {
      console.warn("[EXTERNAL_SOCKET] No socket server available for agent status");
      return false;
    }

    try {
      socketIO.emit('agent-status-update', {
        agentId,
        ...status,
        timestamp: new Date().toISOString()
      });
      
      socketIO.emit(`agent:${agentId}:status-update`, {
        ...status,
        timestamp: new Date().toISOString()
      });
      
      console.log(`[EXTERNAL_SOCKET] ✅ Agent status update emitted: ${agentId}`);
      return true;
    } catch (error) {
      console.error("[EXTERNAL_SOCKET] ❌ Failed to emit agent status:", error);
      return false;
    }
  }

  /**
   * Emit visitor activity
   */
  emitVisitorActivity(sessionId: string, activity: {
    type: string;
    data: any;
    channelId?: string;
    conversationId?: string;
  }, io?: SocketIOServer) {
    const socketIO = io || this.io;
    if (!socketIO) {
      console.warn("[EXTERNAL_SOCKET] No socket server available for visitor activity");
      return false;
    }

    try {
      socketIO.emit('visitor-activity', {
        sessionId,
        ...activity,
        timestamp: new Date().toISOString()
      });
      
      socketIO.emit(`visitor:${sessionId}:activity`, {
        ...activity,
        timestamp: new Date().toISOString()
      });
      
      if (activity.channelId) {
        socketIO.emit(`visitor:channel:${activity.channelId}:activity`, {
          sessionId,
          ...activity,
          timestamp: new Date().toISOString()
        });
      }
      
      console.log(`[EXTERNAL_SOCKET] ✅ Visitor activity emitted: ${sessionId}`);
      return true;
    } catch (error) {
      console.error("[EXTERNAL_SOCKET] ❌ Failed to emit visitor activity:", error);
      return false;
    }
  }

  /**
   * Emit workflow execution status
   */
  emitWorkflowExecution(workflowData: {
    workflowId: string;
    executionId: string;
    status: 'started' | 'completed' | 'failed';
    externalMessageId?: string;
    responseMessageId?: string;
    processingTime?: number;
    error?: string;
  }, io?: SocketIOServer) {
    const socketIO = io || this.io;
    if (!socketIO) {
      console.warn("[EXTERNAL_SOCKET] No socket server available for workflow execution");
      return false;
    }

    try {
      socketIO.emit('workflow-execution', {
        ...workflowData,
        timestamp: new Date().toISOString()
      });
      
      socketIO.emit(`workflow:${workflowData.workflowId}:execution`, {
        ...workflowData,
        timestamp: new Date().toISOString()
      });
      
      if (workflowData.externalMessageId) {
        socketIO.emit(`external-message:${workflowData.externalMessageId}:workflow`, {
          ...workflowData,
          timestamp: new Date().toISOString()
        });
      }
      
      console.log(`[EXTERNAL_SOCKET] ✅ Workflow execution emitted: ${workflowData.workflowId}`);
      return true;
    } catch (error) {
      console.error("[EXTERNAL_SOCKET] ❌ Failed to emit workflow execution:", error);
      return false;
    }
  }

  /**
   * Emit portfolio notification
   */
  emitPortfolioNotification(notification: {
    type: 'contact-form' | 'ai-response' | 'admin-action' | 'system-alert';
    title: string;
    message: string;
    sessionId?: string;
    channelId?: string;
    messageId?: string;
    metadata?: any;
  }, io?: SocketIOServer) {
    const socketIO = io || this.io;
    if (!socketIO) {
      console.warn("[EXTERNAL_SOCKET] No socket server available for portfolio notification");
      return false;
    }

    try {
      // Emit to general portfolio listeners
      socketIO.emit('portfolio-notification', {
        ...notification,
        timestamp: new Date().toISOString()
      });
      
      // Emit to specific session if available
      if (notification.sessionId) {
        socketIO.emit(`portfolio:session:${notification.sessionId}:notification`, {
          ...notification,
          timestamp: new Date().toISOString()
        });
      }
      
      // Emit to specific channel listeners
      if (notification.channelId) {
        socketIO.emit(`portfolio:channel:${notification.channelId}:notification`, {
          ...notification,
          timestamp: new Date().toISOString()
        });
      }
      
      console.log(`[EXTERNAL_SOCKET] ✅ Portfolio notification emitted: ${notification.type}`);
      return true;
    } catch (error) {
      console.error("[EXTERNAL_SOCKET] ❌ Failed to emit portfolio notification:", error);
      return false;
    }
  }

  /**
   * Get socket server instance
   */
  getSocketServer(): SocketIOServer | null {
    return this.io;
  }

  /**
   * Check if socket server is available
   */
  isSocketAvailable(): boolean {
    return this.io !== null;
  }
}

// Export singleton instance
export const externalSocketService = ExternalSocketService.getInstance(); 