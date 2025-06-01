// /hooks/use-socket.ts

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socketHelper } from "@/lib/system/socket";
import { useParams } from "next/navigation";
import { MessageStatus } from "@/lib/system/types/messagestatus";
import { useUser } from "@clerk/nextjs";
import { PresenceUser } from "@/lib/system/presence-service";

export const useSocket = () => {
  const [status, setStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("connecting");
  const [messageStatuses] = useState<Map<string, MessageStatus>>(new Map());
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<PresenceUser[]>([]);
  const queryClient = useQueryClient();
  const params = useParams();
  const { user } = useUser();

  useEffect(() => {
    const socket = socketHelper.connect();

    socket.on("connect", () => {
      setStatus("connected");
      
      // Create session when connected
      if (user && params?.serverId) {
        socketHelper.emit("user:session:create", {
          profileId: user.id,
          serverId: params.serverId,
          channelId: params.channelId,
          metadata: {
            userAgent: navigator.userAgent,
          },
        });
      }
    });

    socket.on("disconnect", () => {
      setStatus("disconnected");
    });

    socket.on("connect_error", () => {
      setStatus("disconnected");
    });

    // Listen for presence updates
    socket.on("presence:users:update", (users: PresenceUser[]) => {
      setOnlineUsers(users);
    });

    // Listen for typing indicators
    socket.on("typing:users:update", (users: PresenceUser[]) => {
      setTypingUsers(users);
    });

    // Listen for activity updates
    socket.on("activity:update", (activity) => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    });

    // Update session activity periodically
    const heartbeatInterval = setInterval(() => {
      if (status === "connected" && user && params?.serverId) {
        socketHelper.emit("user:session:heartbeat", {
          serverId: params.serverId,
          channelId: params.channelId,
        });
      }
    }, 30000); // Every 30 seconds

    return () => {
      clearInterval(heartbeatInterval);
      
      // End session when disconnecting
      if (user) {
        socketHelper.emit("user:session:end", {
          profileId: user.id,
        });
      }
      
      socketHelper.disconnect();
    };
  }, [user, params?.serverId, params?.channelId, status, queryClient]);

  // Update channel context when navigating
  useEffect(() => {
    if (status === "connected" && user && params?.serverId) {
      socketHelper.emit("user:session:update", {
        serverId: params.serverId,
        channelId: params.channelId,
      });
    }
  }, [params?.serverId, params?.channelId, status, user]);

  const startTyping = (channelId: string) => {
    if (status === "connected" && user) {
      socketHelper.emit("typing:start", {
        channelId,
        profileId: user.id,
      });
    }
  };

  const stopTyping = (channelId: string) => {
    if (status === "connected" && user) {
      socketHelper.emit("typing:stop", {
        channelId,
        profileId: user.id,
      });
    }
  };

  const updateOnlineStatus = (newStatus: "ONLINE" | "AWAY" | "DO_NOT_DISTURB" | "OFFLINE") => {
    if (status === "connected" && user && params?.serverId) {
      socketHelper.emit("presence:status:update", {
        profileId: user.id,
        serverId: params.serverId,
        status: newStatus,
      });
    }
  };

  return {
    socket: socketHelper,
    status,
    messageStatuses,
    onlineUsers,
    typingUsers,
    getMessageStatus: (id: string) => messageStatuses.get(id),
    startTyping,
    stopTyping,
    updateOnlineStatus,
  };
};
