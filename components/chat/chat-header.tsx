// path: components/chat/chat-header.tsx
"use client";

import { Hash } from "lucide-react";

import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { SocketIndicator } from "@/components/socket-indicator";
import { ChatVideoButton } from "@/components/chat/chat-video-button";
import { ServerWithMembersWithProfiles } from "@/types/server";
import { useProfile } from "@/hooks/use-profile";
import { useServers } from "@/hooks/use-servers";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
  server?: ServerWithMembersWithProfiles;
}

export const ChatHeader = ({
  serverId,
  name,
  type,
  imageUrl,
  server,
}: ChatHeaderProps) => {
  const profile = useProfile();
  const { servers, isLoading } = useServers();

  if (!profile || !server || isLoading) {
    return null;
  }

  return (
    <div className="flex items-center h-12 px-3 font-semibold border-b-2 text-md border-neutral-200 dark:border-neutral-800">
      <MobileToggle server={server} servers={servers} profile={profile} />
      {type === "channel" && (
        <Hash className="w-5 h-5 mr-2 text-zinc-500 dark:text-zinc-400" />
      )}
      {type === "conversation" && (
        <UserAvatar
          src={imageUrl}
          className="w-8 h-8 mr-2 md:h-8 md:w-8"
        />
      )}
      <p className="font-semibold text-black text-md dark:text-white">
        {name}
      </p>
      <div className="flex items-center ml-auto">
        {type === "conversation" && (
          <ChatVideoButton />
        )}
        <SocketIndicator />
      </div>
    </div>
  );
};