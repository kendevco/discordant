'use client';

import { createContext, useContext, useEffect, useState } from "react";

type SocketContextType = {
  isConnected: boolean;
  sendMessage: (message: any) => void;
};

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  sendMessage: () => { },
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export function SocketProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize connection
    setIsConnected(true);

    return () => {
      setIsConnected(false);
    };
  }, []);

  const sendMessage = (message: any) => {
    // Implement message sending logic
    console.log("Sending message:", message);
  };

  return (
    <SocketContext.Provider value={{ isConnected, sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
} 