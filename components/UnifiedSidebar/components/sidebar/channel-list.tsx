'use client';

import { Channel, ChannelType, MemberRole } from "@prisma/client";
import { Hash, Mic, Video, ChevronDown, Settings, UserPlus, PlusCircle, Users, LogOut, Trash, ShieldAlert, ShieldCheck, LucideIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ServerSearch } from "@/components/UnifiedSidebar/components/sidebar/server/server-search";
import type { ServerWithMembersWithProfiles } from "@/types/server";
import { ServerHeader } from "@/components/UnifiedSidebar/components/sidebar/server/server-header";
import { useProfile } from "@/hooks/use-profile";
import { ServerSection } from "@/components/UnifiedSidebar/components/sidebar/server/server-section";
import { ServerChannel } from "@/components/UnifiedSidebar/components/sidebar/server/server-channel";
import { ServerMember } from "@/components/UnifiedSidebar/components/sidebar/server/server-member";

interface ChannelListProps {
  server: ServerWithMembersWithProfiles;
}

const iconMap: Record<ChannelType, LucideIcon> = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

const roleIconMap = {
  [MemberRole.GUEST]: <Users className="w-4 h-4 ml-2 text-indigo-300" />,
  [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-400" />,
  [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 ml-2 text-indigo-200" />
} as const;

export const ChannelList = ({
  server
}: ChannelListProps) => {
  const params = useParams();
  const router = useRouter();
  const { onOpen } = useModal();
  const profile = useProfile();

  const textChannels = server?.channels.filter((channel: Channel) => channel.type === ChannelType.TEXT);
  const audioChannels = server?.channels.filter((channel: Channel) => channel.type === ChannelType.AUDIO);
  const videoChannels = server?.channels.filter((channel: Channel) => channel.type === ChannelType.VIDEO);
  const members = server?.members;

  // Get the current member's role
  const currentMember = server?.members.find((member) => member.profileId === profile?.id);
  const role = currentMember?.role;
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  const onChannelClick = (channelId: string) => {
    router.push(`/servers/${server.id}/channels/${channelId}`);
  };

  const onMemberClick = (memberId: string) => {
    router.push(`/servers/${server.id}/conversations/${memberId}`);
  };

  return (
    <div className="flex flex-col h-full text-primary w-full bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900">
      <ServerHeader
        server={server}
        role={role}
        serverId={server?.id}
      />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSection
            sectionType="channels"
            channelType={ChannelType.TEXT}
            role={role}
            label="Text Channels"
          >
            <div className="space-y-[2px]">
              {textChannels?.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </ServerSection>
          <ServerSection
            sectionType="channels"
            channelType={ChannelType.AUDIO}
            role={role}
            label="Voice Channels"
          >
            <div className="space-y-[2px]">
              {audioChannels?.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </ServerSection>
          <ServerSection
            sectionType="channels"
            channelType={ChannelType.VIDEO}
            role={role}
            label="Video Channels"
          >
            <div className="space-y-[2px]">
              {videoChannels?.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </ServerSection>
          <ServerSection
            sectionType="members"
            role={role}
            label="Members"
            server={server}
          >
            <div className="space-y-[2px]">
              {members?.map((member) => (
                <ServerMember
                  key={member.id}
                  member={member}
                  server={server}
                />
              ))}
            </div>
          </ServerSection>
        </div>
      </ScrollArea>
    </div>
  );
}; 