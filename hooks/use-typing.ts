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
    const socketInstance = socket.socket;
    if (!socketInstance) return;

    const handleTyping = ({
      userId,
      name,
    }: {
      userId: string;
      name: string;
    }) => {
      if (userId === currentUserId) return;

      setTypingUsers((prev) => {
        const next = new Map(prev);
        next.set(userId, {
          userId,
          name,
          timestamp: Date.now(),
        });
        return next;
      });
    };

    const handleStopTyping = ({ userId }: { userId: string }) => {
      setTypingUsers((prev) => {
        const next = new Map(prev);
        next.delete(userId);
        return next;
      });
    };

    socketInstance.on("chat:typing", handleTyping);
    socketInstance.on("chat:stop_typing", handleStopTyping);

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
      socketInstance.off("chat:typing", handleTyping);
      socketInstance.off("chat:stop_typing", handleStopTyping);
      clearInterval(interval);
    };
  }, [socket, channelId, currentUserId]);

  const sendTyping = (name: string) => {
    socket.socket?.emit(`chat:${channelId}:typing`, {
      userId: currentUserId,
      name,
    });
  };

  const sendStopTyping = () => {
    socket.socket?.emit(`chat:${channelId}:stop_typing`, {
      userId: currentUserId,
    });
  };

  const getTypingUsers = () => Array.from(typingUsers.values());

  return {
    typingUsers: getTypingUsers(),
    sendTyping,
    sendStopTyping,
  };
};
