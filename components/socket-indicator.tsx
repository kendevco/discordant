"use client";

import { useSocket } from "@/components/providers/socket-provider";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [connectionState, setConnectionState] = useState<"connected" | "disconnected" | "connecting">("connecting");

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);

    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  useEffect(() => {
    if (isConnected) {
      setConnectionState("connected");
    } else {
      setConnectionState("disconnected");
    }
  }, [isConnected]);

  if (!isLargeScreen) {
    return (
      <div className="flex items-center justify-center h-6 w-6">
        {connectionState === "connected" ? (
          <Wifi className="h-4 w-4 text-emerald-500" />
        ) : connectionState === "connecting" ? (
          <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />
        ) : (
          <WifiOff className="h-4 w-4 text-yellow-500 animate-pulse" />
        )}
      </div>
    );
  }

  if (connectionState === "disconnected") {
    return (
      <Badge
        variant="outline"
        className="bg-yellow-600 text-white border-none animate-pulse"
      >
        Fallback: Polling every 1s
      </Badge>
    );
  }

  if (connectionState === "connecting") {
    return (
      <Badge
        variant="outline"
        className="bg-yellow-600 text-white border-none"
      >
        Connecting...
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="bg-emerald-600 text-white border-none"
    >
      Live: Real-time updates
    </Badge>
  );
};
