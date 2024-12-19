"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

type MessageEvent = {
  type: string;
  data: any;
};

type MessageHandler = (event: MessageEvent) => void;

interface MessageContextType {
  isConnected: boolean;
  sendMessage: (channelId: string, message: any) => Promise<any>;
  connectToChannel: (channelId: string) => () => void;
  subscribe: (handler: MessageHandler) => () => void;
}

const MessageContext = createContext<MessageContextType>({
  isConnected: false,
  sendMessage: () => Promise.resolve(),
  connectToChannel: () => () => {},
  subscribe: () => () => {},
});

export const useMessages = () => {
  return useContext(MessageContext);
};

interface MessageProviderProps {
  children: React.ReactNode;
}

export const MessageProvider = ({ children }: MessageProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const handlersRef = useRef<Set<MessageHandler>>(new Set());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const subscribe = useCallback((handler: MessageHandler) => {
    handlersRef.current.add(handler);
    return () => {
      handlersRef.current.delete(handler);
    };
  }, []);

  const broadcast = useCallback((event: MessageEvent) => {
    handlersRef.current.forEach((handler) => {
      try {
        handler(event);
      } catch (error) {
        console.error("Error in message handler:", error);
      }
    });
  }, []);

  const connectToChannel = useCallback((channelId: string) => {
    if (eventSource) {
      eventSource.close();
    }

    const newEventSource = new EventSource(`/api/messages/stream?channelId=${channelId}`);

    newEventSource.onopen = () => {
      setIsConnected(true);
      console.log("SSE Connected");
      
      // Clear any pending reconnection attempts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = undefined;
      }

      // Broadcast initial connection status
      broadcast({
        type: "connection",
        data: { status: "connected" }
      });
    };

    newEventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "ping") return;
        
        // Handle presence updates
        if (data.type === "presence") {
          broadcast({
            type: "presence",
            data: {
              userId: data.userId,
              status: data.status
            }
          });
          return;
        }

        broadcast(data);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    newEventSource.onerror = (error) => {
      console.error("SSE Connection error:", error);
      setIsConnected(false);
      newEventSource.close();

      // Broadcast connection error
      broadcast({
        type: "connection",
        data: { status: "error", error }
      });

      // Attempt to reconnect after 5 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log("Attempting to reconnect...");
        connectToChannel(channelId);
      }, 5000);
    };

    setEventSource(newEventSource);

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      newEventSource.close();
      setIsConnected(false);
    };
  }, [broadcast, eventSource]);

  const sendMessage = async (channelId: string, message: any) => {
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...message, channelId }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      broadcast({
        type: `chat:${channelId}:messages`,
        data,
      });

      return data;
    } catch (error) {
      console.error("Error sending message:", error);
      broadcast({
        type: "error",
        data: { error: "Failed to send message" }
      });
      throw error;
    }
  };

  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [eventSource]);

  return (
    <MessageContext.Provider 
      value={{ 
        isConnected,
        sendMessage,
        connectToChannel,
        subscribe,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}; 