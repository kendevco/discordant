import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socketHelper } from "@/lib/system/socket";
import { useParams } from "next/navigation";
import { MessageStatus } from "@/lib/system/types/messagestatus";

export const useSocket = () => {
  const [status, setStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("connecting");
  const [messageStatuses] = useState<Map<string, MessageStatus>>(new Map());
  const queryClient = useQueryClient();
  const params = useParams();

  useEffect(() => {
    const socket = socketHelper.connect();

    socket.on("connect", () => {
      setStatus("connected");
    });

    socket.on("disconnect", () => {
      setStatus("disconnected");
    });

    socket.on("connect_error", () => {
      setStatus("disconnected");
    });

    return () => {
      socketHelper.disconnect();
    };
  }, []);

  return {
    socket: socketHelper,
    status,
    messageStatuses,
    getMessageStatus: (id: string) => messageStatuses.get(id),
  };
};
