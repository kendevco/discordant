import { Hash } from "lucide-react";
import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { ChatVideoButton } from "@/components/chat-video-button";
import { ChatHeaderClient } from "@/components/chat/chat-header-client";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
  channelId?: string;
  conversationId?: string;
  serverImageUrl?: string | null;
  serverName?: string;
}

export const ChatHeader = ({ 
  serverId, 
  name, 
  type, 
  imageUrl, 
  channelId, 
  conversationId,
  serverImageUrl,
  serverName
}: ChatHeaderProps) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666]">
      <MobileToggle serverId={serverId} />
      
      {/* Server Icon - Mobile Only */}
      {serverImageUrl && (
        <UserAvatar 
          src={serverImageUrl} 
          className="h-6 w-6 mr-2 ring-2 ring-white/20 md:hidden" 
        />
      )}
      
      {type === "channel" && (
        <Hash className="mr-2 w-5 h-5 text-white dark:text-zinc-400" />
      )}
      {type === "conversation" && (
        <UserAvatar src={imageUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2" />
      )}
      <p className="font-semibold text-md text-white">{name}</p>
      <div className="ml-auto flex items-center gap-x-2">
        {type === "conversation" && <ChatVideoButton />}
        
        {/* SSE Status - shows real-time connection status */}
        <ChatHeaderClient 
          type={type}
          channelId={channelId}
          conversationId={conversationId}
        />
      </div>
    </div>
  );
}; 