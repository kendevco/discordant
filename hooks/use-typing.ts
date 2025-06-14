import { useEffect, useState } from "react";
import { useSocket } from "./use-socket";

interface TypingUser {
  userId: string;
  name: string;
  timestamp: number;
}

const TYPING_TIMEOUT = 3000; // 3 seconds

export const useTyping = (channelId: string, currentUserId: string) => {
  const socket = useSocket();
  const [typingUsers, setTypingUsers] = useState<Map<string, TypingUser>>(
    new Map()
  );

  useEffect(() => {
    // Socket functionality temporarily disabled - using SSE for real-time updates
    // TODO: Implement typing indicators via SSE or external socket service
    
    // Cleanup old typing indicators
    const interval = setInterval(() => {
      setTypingUsers((prev) => {
        const now = Date.now();
        const next = new Map(prev);
        for (const [userId, user] of next) {
          if (now - user.timestamp > TYPING_TIMEOUT) {
            next.delete(userId);
          }
        }
        return next;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [channelId, currentUserId]);

  const sendTyping = (name: string) => {
    // TODO: Implement typing via SSE or external socket service
    console.log('Typing indicator disabled - using SSE for real-time updates');
  };

  const sendStopTyping = () => {
    // TODO: Implement stop typing via SSE or external socket service
    console.log('Stop typing indicator disabled - using SSE for real-time updates');
  };

  const getTypingUsers = () => Array.from(typingUsers.values());

  return {
    typingUsers: getTypingUsers(),
    sendTyping,
    sendStopTyping,
  };
};
