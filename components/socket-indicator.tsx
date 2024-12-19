"use client";

import { useMessages } from "@/components/providers/message-provider";
import { Badge } from "@/components/ui/badge";

export const SocketIndicator = () => {
  const { isConnected } = useMessages();

  if (!isConnected) {
    return (
      <Badge 
        variant="outline" 
        className="text-white transition bg-yellow-600 border-none hover:bg-yellow-700"
      >
        Polling: Every 1s
      </Badge>
    )
  }

  return (
    <Badge 
      variant="outline" 
      className="text-white transition border-none bg-emerald-600 hover:bg-emerald-700"
    >
      Live: Connected
    </Badge>
  )
}