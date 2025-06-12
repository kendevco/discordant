// src/components/providers/socket-provider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: "/api/socket/io",
      addTrailingSlash: false,
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      timeout: 30000,
      withCredentials: true,
      forceNew: false,
      upgrade: true,
    });

    socketInstance.on("connect", () => {
      console.log("[SOCKET] Connected", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("[SOCKET] Disconnected:", reason);
      setIsConnected(false);
      
      if (reason === "io server disconnect" || reason === "io client disconnect") {
        socketInstance.disconnect();
      }
    });

    socketInstance.on("connect_error", (error) => {
      console.log("[SOCKET] Connection error:", error.message);
      setIsConnected(false);
    });

    socketInstance.on("reconnect", (attemptNumber) => {
      console.log("[SOCKET] Reconnected after", attemptNumber, "attempts");
      setIsConnected(true);
    });

    socketInstance.on("reconnect_error", (error) => {
      console.log("[SOCKET] Reconnection error:", error.message);
    });

    socketInstance.on("reconnect_failed", () => {
      console.log("[SOCKET] Reconnection failed - giving up");
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
