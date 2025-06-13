import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface SSEConversationData {
  type: 'connected' | 'new_direct_messages' | 'heartbeat' | 'error';
  conversationId?: string;
  count?: number;
  timestamp?: string;
  messages?: Array<{
    id: string;
    content: string;
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
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const router = useRouter();

  const connect = useCallback(() => {
    if (!conversationId) return;

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
        setIsConnected(true);
        setConnectionState('connected');
        setError(null);
        reconnectAttemptsRef.current = 0;
        console.log(`[SSE_CONVERSATION] Connected to conversation: ${conversationId}`);
      };

      eventSource.onmessage = (event) => {
        try {
          const data: SSEConversationData = JSON.parse(event.data);
          
          switch (data.type) {
            case 'connected':
              console.log(`[SSE_CONVERSATION] Initial connection confirmed for conversation: ${conversationId}`);
              break;
              
            case 'new_direct_messages':
              setLastMessageTime(new Date());
              setMessageCount(prev => prev + (data.count || 0));
              
              console.log(`[SSE_CONVERSATION] New direct messages received:`, {
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
                  console.log(`[SSE_CONVERSATION] Auto-refreshing page for new direct messages`);
                  window.location.reload();
                }, refreshDelay);
              }
              break;
              
            case 'heartbeat':
              // Keep connection alive
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
        setIsConnected(false);
        setConnectionState('error');
        console.error(`[SSE_CONVERSATION] Connection error for conversation: ${conversationId}`, event);
        
        // Attempt reconnection with exponential backoff
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.pow(2, reconnectAttemptsRef.current) * 1000; // Exponential backoff
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
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
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

  // Effect to handle connection lifecycle
  useEffect(() => {
    if (conversationId) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [conversationId, connect, disconnect]);

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
    forceReconnect,
    disconnect
  };
} 