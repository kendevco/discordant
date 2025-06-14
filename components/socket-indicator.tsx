"use client";

import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";
import { useSocket } from "@/components/providers/socket-provider";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge 
        variant="outline" 
        className="bg-yellow-600 text-white border-none"
      >
        <WifiOff className="w-4 h-4 mr-2" />
        Fallback: Polling every 1s
      </Badge>
    );
  }

  return (
    <Badge 
      variant="outline" 
      className="bg-emerald-600 text-white border-none"
    >
      <Wifi className="w-4 h-4 mr-2" />
      Live: Real-time connection
    </Badge>
  );
}; 