"use client";

import { createContext, useContext, useEffect, useState } from "react";

type SocketContextType = {
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Since we're using SSE now, we'll simulate connection status
    // based on network connectivity
    const checkConnection = () => {
      setIsConnected(navigator.onLine);
    };

    // Initial check
    checkConnection();

    // Listen for online/offline events
    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);

    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}; 