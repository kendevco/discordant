"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useSocket } from "./socket-provider";

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const { isConnected } = useSocket();
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
        // Only poll if socket is disconnected
        refetchInterval: isConnected ? false : 1000,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
