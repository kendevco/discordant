"use client";

import { SSEStatus } from "@/components/chat/sse-status";
import { useSSEChannel } from "@/hooks/use-sse-channel";
import { useSSEConversation } from "@/hooks/use-sse-conversation";

interface ChatHeaderClientProps {
  type: "channel" | "conversation";
  channelId?: string;
  conversationId?: string;
}

export function ChatHeaderClient({ 
  type, 
  channelId, 
  conversationId 
}: ChatHeaderClientProps) {
  // Hook for SSE connections
  const channelSSE = useSSEChannel(
    type === "channel" ? channelId || null : null,
    {
      autoRefresh: false, // NEVER auto-refresh from header
      refreshDelay: 1000
    }
  );
  
  const conversationSSE = useSSEConversation(
    type === "conversation" ? conversationId || null : null,
    {
      autoRefresh: false, // NEVER auto-refresh from header
      refreshDelay: 1000
    }
  );

  if (type === "channel") {
    return (
      <SSEStatus
        isConnected={channelSSE.isConnected}
        connectionState={channelSSE.connectionState}
        error={channelSSE.error}
        messageCount={channelSSE.messageCount}
        lastMessageTime={channelSSE.lastMessageTime}
        onReconnect={channelSSE.forceReconnect}
        compact={true}
      />
    );
  }

  if (type === "conversation") {
    return (
      <SSEStatus
        isConnected={conversationSSE.isConnected}
        connectionState={conversationSSE.connectionState}
        error={conversationSSE.error}
        messageCount={conversationSSE.messageCount}
        lastMessageTime={conversationSSE.lastMessageTime}
        onReconnect={conversationSSE.forceReconnect}
        compact={true}
      />
    );
  }

  return null;
} 