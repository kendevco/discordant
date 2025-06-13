"use client";

import { Badge } from "@/components/ui/badge";
import { useSocket } from "@/components/providers/socket-provider";
import { Wifi, WifiOff, Loader2, AlertTriangle } from "lucide-react";

export const SocketIndicator = () => {
  const { isConnected, connectionStatus } = useSocket();

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: <Wifi className="h-3 w-3" />,
          label: "Live",
          variant: "default" as const,
          className: "bg-emerald-600 text-white border-emerald-600"
        };
      case 'connecting':
        return {
          icon: <Loader2 className="h-3 w-3 animate-spin" />,
          label: "Connecting",
          variant: "secondary" as const,
          className: "bg-yellow-600 text-white border-yellow-600"
        };
      case 'error':
        return {
          icon: <AlertTriangle className="h-3 w-3" />,
          label: "Error",
          variant: "destructive" as const,
          className: "bg-red-600 text-white border-red-600"
        };
      default:
        return {
          icon: <WifiOff className="h-3 w-3" />,
          label: "Offline",
          variant: "outline" as const,
          className: "bg-zinc-600 text-white border-zinc-600"
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge 
      variant={config.variant} 
      className={`${config.className} flex items-center gap-1.5 px-2 py-1 text-xs font-medium`}
      title={`Socket.IO Status: ${connectionStatus} | Real-time messaging ${isConnected ? 'active' : 'inactive'}`}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
};
