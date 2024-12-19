'use client';

import { Channel, ChannelType, MemberRole, Profile, Server } from "@prisma/client";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { ServerHeader } from "./server-header";
import { ServerSearch } from "./server-search";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";

interface ServerSidebarClientProps {
  serverId: string;
  profile: Profile;
}

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />
}

export const ServerSidebarClient = ({
  serverId,
  profile
}: ServerSidebarClientProps) => {
  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader serverId={serverId} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch serverId={serverId} />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
      </ScrollArea>
    </div>
  );
}; 