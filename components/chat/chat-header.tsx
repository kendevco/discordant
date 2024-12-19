// path: components/chat/chat-header.tsx
"use client";

import { Hash } from "lucide-react";

import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { SocketIndicator } from "@/components/socket-indicator";
import { ChatVideoButton } from "@/components/chat/chat-video-button";
import { ServerWithMembersWithProfiles } from "@/components/server/server-sidebar";
import { useProfile } from "@/hooks/use-profile";

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
  server
}: ChatHeaderProps) => {
  const { profile } = useProfile();

  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 bg-white dark:bg-[#313338]">
      <MobileToggle serverId={serverId} initialProfile={profile} />
      {type === "channel" && (
        <div className="flex items-center">
          <Hash className="w-5 h-5 mr-2 text-zinc-500 dark:text-zinc-400" />
          <p className="font-semibold text-zinc-800 dark:text-zinc-200">
            {name}
          </p>
        </div>
      )}
      {type === "conversation" && (
        <div className="flex items-center">
          <UserAvatar
            src={imageUrl}
            className="w-8 h-8 mr-2 md:h-8 md:w-8"
          />
          <p className="font-semibold text-zinc-800 dark:text-zinc-200">
            {name}
          </p>
        </div>
      )}
      <div className="flex items-center ml-auto gap-x-2">
        {type === "conversation" && (
          <ChatVideoButton />
        )}
        <SocketIndicator />
      </div>
    </div>
  );
}