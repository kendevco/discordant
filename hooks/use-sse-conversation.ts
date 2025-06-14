import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface SSEConversationData {
  type: 'connected' | 'new_messages' | 'heartbeat' | 'error';
  conversationId?: string;
  count?: number;
  timestamp?: string;
  messages?: Array<{
    id: string;
    content: string;
    role: string;
    author: string;
    createdAt: string;
  }>;
  message?: string; // For error messages
}

interface UseSSEConversationOptions {
  onNewMessages?: (data: SSEConversationData) => void;
  autoRefresh?: boolean;
  refreshDelay?: number;
}

// Reuse the same activity tracker from channel hook
class ActivityTracker {
  private lastActivity: number = Date.now();
  private lastMessage: number = 0;
  private isUserActive: boolean = true;
  private activityListeners: (() => void)[] = [];

  constructor() {
    // Track user activity
    if (typeof window !== 'undefined') {
      const updateActivity = () => {
        this.lastActivity = Date.now();
        this.isUserActive = true;
        this.notifyListeners();
      };

      // Listen for user interactions
      window.addEventListener('mousemove', updateActivity, { passive: true });
      window.addEventListener('keydown', updateActivity, { passive: true });
      window.addEventListener('click', updateActivity, { passive: true });
      window.addEventListener('scroll', updateActivity, { passive: true });
      window.addEventListener('focus', updateActivity, { passive: true });

      // Check for inactivity every 30 seconds
      setInterval(() => {
        const now = Date.now();
        const timeSinceActivity = now - this.lastActivity;
        
        // Mark as inactive after 2 minutes of no interaction
        if (timeSinceActivity > 120000 && this.isUserActive) {
          this.isUserActive = false;
          this.notifyListeners();
        }
      }, 30000);
    }
  }

  onActivityChange(callback: () => void) {
    this.activityListeners.push(callback);
    return () => {
      this.activityListeners = this.activityListeners.filter(cb => cb !== callback);
    };
  }

  private notifyListeners() {
    this.activityListeners.forEach(callback => callback());
  }

  updateMessageActivity() {
    this.lastMessage = Date.now();
    this.lastActivity = Date.now();
    this.isUserActive = true;
    this.notifyListeners();
  }

  getPollingInterval(): number {
    const now = Date.now();
    const timeSinceActivity = now - this.lastActivity;
    const timeSinceMessage = now - this.lastMessage;

    // User is actively interacting
    if (this.isUserActive && timeSinceActivity < 30000) {
      return 2000; // 2 seconds
    }

    // Recent activity (last 5 minutes)
    if (timeSinceActivity < 300000) {
      return 5000; // 5 seconds
    }

    // Recent messages (last 10 minutes)
    if (timeSinceMessage < 600000) {
      return 10000; // 10 seconds
    }

    // Moderate activity (last 30 minutes)
    if (timeSinceActivity < 1800000) {
      return 30000; // 30 seconds
    }

    // Low activity (last hour)
    if (timeSinceActivity < 3600000) {
      return 60000; // 1 minute
    }

    // Idle state
    return 120000; // 2 minutes
  }

  getReconnectDelay(attempt: number): number {
    const baseDelay = Math.min(1000 * Math.pow(2, attempt), 30000);
    const activityMultiplier = this.isUserActive ? 1 : 2; // Slower reconnect when idle
    return baseDelay * activityMultiplier;
  }
}

// Global activity tracker instance (shared with channel hook)
const activityTracker = new ActivityTracker();

export function useSSEConversation(
  conversationId: string | null,
  options: UseSSEConversationOptions = {}
) {
  const {
    onNewMessages,
    autoRefresh = true,
    refreshDelay = 1000
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState(2000);
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const pollingTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const connectionIdRef = useRef<string>('');
  const router = useRouter();

  // Update polling interval based on activity
  const updatePollingInterval = useCallback(() => {
    const newInterval = activityTracker.getPollingInterval();
    if (newInterval !== pollingInterval) {
      setPollingInterval(newInterval);
      console.log(`[SSE_CONVERSATION] Polling interval updated to ${newInterval}ms`);
    }
  }, [pollingInterval]);

  // Listen for activity changes
  useEffect(() => {
    const unsubscribe = activityTracker.onActivityChange(updatePollingInterval);
    return unsubscribe;
  }, [updatePollingInterval]);

  const connect = useCallback(() => {
    if (!conversationId) return;

    // Generate unique connection ID to prevent duplicate connections
    const connectionId = `${conversationId}-${Date.now()}`;
    connectionIdRef.current = connectionId;

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setConnectionState('connecting');
    setError(null);

    try {
      const eventSource = new EventSource(`/api/sse/conversation/${conversationId}`);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        // Only update state if this is still the current connection
        if (connectionIdRef.current === connectionId) {
          setIsConnected(true);
          setConnectionState('connected');
          setError(null);
          reconnectAttemptsRef.current = 0;
          console.log(`[SSE_CONVERSATION] Connected to conversation: ${conversationId} (${connectionId})`);
        }
      };

      eventSource.onmessage = (event) => {
        // Only process if this is still the current connection
        if (connectionIdRef.current !== connectionId) return;

        try {
          const data: SSEConversationData = JSON.parse(event.data);
          
          switch (data.type) {
            case 'connected':
              console.log(`[SSE_CONVERSATION] Initial connection confirmed for conversation: ${conversationId}`);
              break;
              
            case 'new_messages':
              setLastMessageTime(new Date());
              setMessageCount(prev => prev + (data.count || 0));
              
              // Update activity tracker
              activityTracker.updateMessageActivity();
              
              console.log(`[SSE_CONVERSATION] New messages received:`, {
                conversationId: data.conversationId,
                count: data.count,
                autoRefresh
              });

              // Call custom handler if provided
              if (onNewMessages) {
                onNewMessages(data);
              }

              // Auto-refresh the page if enabled
              if (autoRefresh) {
                setTimeout(() => {
                  console.log(`[SSE_CONVERSATION] Auto-refreshing page for new messages`);
                  window.location.reload();
                }, refreshDelay);
              }
              break;
              
            case 'heartbeat':
              // Keep connection alive - no action needed
              break;
              
            case 'error':
              setError(data.message || 'Unknown SSE error');
              console.error(`[SSE_CONVERSATION] Server error:`, data.message);
              break;
              
            default:
              console.log(`[SSE_CONVERSATION] Unknown event type:`, data.type);
          }
        } catch (err) {
          console.error('[SSE_CONVERSATION] Failed to parse message:', err);
          setError('Failed to parse server message');
        }
      };

      eventSource.onerror = (event) => {
        // Only handle error if this is still the current connection
        if (connectionIdRef.current !== connectionId) return;

        setIsConnected(false);
        setConnectionState('error');
        console.error(`[SSE_CONVERSATION] Connection error for conversation: ${conversationId}`, event);
        
        // Attempt reconnection with intelligent backoff
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = activityTracker.getReconnectDelay(reconnectAttemptsRef.current);
          setError(`Connection lost. Reconnecting in ${delay/1000}s... (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, delay);
        } else {
          setError('Maximum reconnection attempts reached. Please refresh the page.');
        }
      };

    } catch (err) {
      console.error('[SSE_CONVERSATION] Failed to create EventSource:', err);
      setConnectionState('error');
      setError('Failed to establish connection');
    }
  }, [conversationId, onNewMessages, autoRefresh, refreshDelay]);

  const disconnect = useCallback(() => {
    // Clear connection ID to prevent stale updates
    connectionIdRef.current = '';
    
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
    }
    setIsConnected(false);
    setConnectionState('disconnected');
    setError(null);
  }, []);

  const forceReconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    disconnect();
    setTimeout(connect, 1000);
  }, [connect, disconnect]);

  // Effect to handle connection lifecycle with stability
  useEffect(() => {
    if (conversationId) {
      // Debounce connection attempts to prevent rapid reconnections
      const timeoutId = setTimeout(() => {
        connect();
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        disconnect();
      };
    } else {
      disconnect();
    }
  }, [conversationId]); // Only depend on conversationId

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    connectionState,
    lastMessageTime,
    messageCount,
    error,
    pollingInterval,
    forceReconnect,
    disconnect
  };
} 