// src/components/providers/socket-provider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { socketHelper } from "@/lib/system/socket";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connectionStatus: 'disconnected',
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');

  useEffect(() => {
    console.log('[SOCKET_PROVIDER] 🚀 Initializing Socket.IO connection...');
    setConnectionStatus('connecting');

    // Connect using the socket helper
    const socketInstance = socketHelper.connect();
    setSocket(socketInstance);

    if (socketInstance) {
      const handleConnect = () => {
        console.log("[SOCKET_PROVIDER] ✅ Connected successfully");
        setIsConnected(true);
        setConnectionStatus('connected');
      };

      const handleDisconnect = (reason: string) => {
        console.log(`[SOCKET_PROVIDER] ❌ Disconnected: ${reason}`);
        setIsConnected(false);
        setConnectionStatus('disconnected');
      };

      const handleConnectError = (error: Error) => {
        console.error("[SOCKET_PROVIDER] ❌ Connection error:", error.message);
        setIsConnected(false);
        setConnectionStatus('error');
      };

      const handleReconnect = (attemptNumber: number) => {
        console.log(`[SOCKET_PROVIDER] ✅ Reconnected after ${attemptNumber} attempts`);
        setIsConnected(true);
        setConnectionStatus('connected');
      };

      const handleReconnectAttempt = (attemptNumber: number) => {
        console.log(`[SOCKET_PROVIDER] 🔄 Reconnection attempt ${attemptNumber}`);
        setConnectionStatus('connecting');
      };

      const handleReconnectError = (error: Error) => {
        console.error("[SOCKET_PROVIDER] ❌ Reconnection error:", error.message);
        setConnectionStatus('error');
      };

      const handleReconnectFailed = () => {
        console.error("[SOCKET_PROVIDER] ❌ Reconnection failed completely");
        setIsConnected(false);
        setConnectionStatus('error');
      };

      // Attach event listeners
      socketInstance.on("connect", handleConnect);
      socketInstance.on("disconnect", handleDisconnect);
      socketInstance.on("connect_error", handleConnectError);
      socketInstance.on("reconnect", handleReconnect);
      socketInstance.on("reconnect_attempt", handleReconnectAttempt);
      socketInstance.on("reconnect_error", handleReconnectError);
      socketInstance.on("reconnect_failed", handleReconnectFailed);

      // Check initial connection state
      if (socketInstance.connected) {
        handleConnect();
      }

      // Cleanup function
      return () => {
        console.log('[SOCKET_PROVIDER] 🧹 Cleaning up socket connection...');
        
        socketInstance.off("connect", handleConnect);
        socketInstance.off("disconnect", handleDisconnect);
        socketInstance.off("connect_error", handleConnectError);
        socketInstance.off("reconnect", handleReconnect);
        socketInstance.off("reconnect_attempt", handleReconnectAttempt);
        socketInstance.off("reconnect_error", handleReconnectError);
        socketInstance.off("reconnect_failed", handleReconnectFailed);
        
        socketHelper.disconnect();
        setSocket(null);
        setIsConnected(false);
        setConnectionStatus('disconnected');
      };
    }
  }, []);

  // Periodic connection health check
  useEffect(() => {
    const healthCheck = setInterval(() => {
      if (socket) {
        const actuallyConnected = socketHelper.isConnected();
        if (isConnected !== actuallyConnected) {
          console.log(`[SOCKET_PROVIDER] 🔄 Connection state mismatch, correcting: ${actuallyConnected}`);
          setIsConnected(actuallyConnected);
          setConnectionStatus(actuallyConnected ? 'connected' : 'disconnected');
        }
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(healthCheck);
  }, [socket, isConnected]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, connectionStatus }}>
      {children}
    </SocketContext.Provider>
  );
};
