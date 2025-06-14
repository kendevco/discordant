import { useEffect, useState } from "react";
import { MessageStatus } from "@/lib/system/types/messagestatus";

// Simple in-memory store for message statuses
const messageStatuses = new Map<string, MessageStatus>();

export const useSocket = () => {
  const [, setRerender] = useState(0);

  const getMessageStatus = (messageId: string): MessageStatus | undefined => {
    return messageStatuses.get(messageId);
  };

  const setMessageStatus = (messageId: string, status: MessageStatus) => {
    messageStatuses.set(messageId, status);
    setRerender(prev => prev + 1);
  };

  const updateMessageStatus = (
    messageId: string, 
    status: "sending" | "sent" | "delivered" | "failed",
    error?: string
  ) => {
    const messageStatus: MessageStatus = {
      id: messageId,
      status,
      error,
      timestamp: Date.now()
    };
    setMessageStatus(messageId, messageStatus);
  };

  // Clean up old statuses periodically
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      const maxAge = 5 * 60 * 1000; // 5 minutes
      
      for (const [messageId, status] of messageStatuses.entries()) {
        if (now - status.timestamp > maxAge) {
          messageStatuses.delete(messageId);
        }
      }
    }, 60000); // Clean up every minute

    return () => clearInterval(cleanup);
  }, []);

  return {
    getMessageStatus,
    setMessageStatus,
    updateMessageStatus
  };
}; 