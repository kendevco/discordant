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
import { ServerSearch } from "@/components/server/server-search";
import type { ServerWithMembersWithProfiles } from "@/types/server";

interface ChannelListProps {
  server: ServerWithMembersWithProfiles;
}

const iconMap: Record<ChannelType, LucideIcon> = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />
} as const;

export const ChannelList = ({
  server
}: ChannelListProps) => {
  const params = useParams();
  const router = useRouter();
  const { onOpen } = useModal();

  const textChannels = server.channels.filter((channel: Channel) => channel.type === ChannelType.TEXT);
  const audioChannels = server.channels.filter((channel: Channel) => channel.type === ChannelType.AUDIO);
  const videoChannels = server.channels.filter((channel: Channel) => channel.type === ChannelType.VIDEO);
  const members = server.members;

  const role = server.members.find((member) => member.profileId === params?.memberId)?.role;
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  const onChannelClick = (channelId: string) => {
    router.push(`/servers/${server.id}/channels/${channelId}`);
  };

  const onMemberClick = (memberId: string) => {
    router.push(`/servers/${server.id}/conversations/${memberId}`);
  };

  const renderChannel = (channel: Channel) => {
    const Icon = iconMap[channel.type];
    const isActive = params?.channelId === channel.id;

    return (
      <button
        key={channel.id}
        onClick={() => onChannelClick(channel.id)}
        className={cn(
          "group relative w-full flex items-center gap-x-2 px-2 py-2 rounded-md transition",
          isActive && "bg-zinc-700/20 dark:bg-zinc-700",
          !isActive && "hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
        )}
      >
        {isActive && (
          <div className="absolute left-0 bg-primary w-1 h-full rounded-r-full" />
        )}
        <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
        <p className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          isActive && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}>
          {channel.name}
        </p>
        {channel.name !== "general" && isModerator && (
          <div className="ml-auto flex items-center gap-x-2">
            <ActionTooltip label="Edit">
              <Settings
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen("editChannel", { server, channel });
                }}
                className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
            <ActionTooltip label="Delete">
              <Trash
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen("deleteChannel", { server, channel });
                }}
                className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full w-60 bg-[#2B2D31] text-[#96989D] fixed left-[72px] top-0">
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none" asChild>
          <button className="w-full h-12 px-4 flex items-center justify-between border-b border-neutral-800 hover:bg-zinc-700/10 transition">
            <p className="font-semibold text-md text-white truncate">{server.name}</p>
            <ChevronDown className="h-5 w-5 flex-shrink-0" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
          {isModerator && (
            <DropdownMenuItem
              onClick={() => onOpen("invite", { server })}
              className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
            >
              Invite People
              <UserPlus className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen("editServer", { server })}
              className="px-3 py-2 text-sm cursor-pointer"
            >
              Server Settings
              <Settings className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen("members", { server })}
              className="px-3 py-2 text-sm cursor-pointer"
            >
              Manage Members
              <Users className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isModerator && (
            <DropdownMenuItem
              onClick={() => onOpen("createChannel")}
              className="px-3 py-2 text-sm cursor-pointer"
            >
              Create Channel
              <PlusCircle className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isModerator && <DropdownMenuSeparator />}
          {isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen("deleteServer", { server })}
              className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
            >
              Delete Server
              <Trash className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {!isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen("leaveServer", { server })}
              className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
            >
              Leave Server
              <LogOut className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ScrollArea className="flex-1 px-2">
        <div className="mt-2">
          <ServerSearch serverId={server.id} />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />

        {!!textChannels?.length && (
          <div className="mb-2">
            <div className="flex items-center justify-between px-2">
              <button
                onClick={() => onOpen("createChannel", { channelType: ChannelType.TEXT })}
                className="group flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition rounded-md"
              >
                <p className="text-xs uppercase font-semibold text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition">
                  Text Channels
                </p>
                {isModerator && (
                  <PlusCircle className="w-4 h-4 text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition" />
                )}
              </button>
            </div>
            <div className="space-y-[2px] mt-2">
              {textChannels.map(renderChannel)}
            </div>
          </div>
        )}

        {!!audioChannels?.length && (
          <div className="mb-2">
            <div className="flex items-center justify-between px-2">
              <button
                onClick={() => onOpen("createChannel", { channelType: ChannelType.AUDIO })}
                className="group flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition rounded-md"
              >
                <p className="text-xs uppercase font-semibold text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition">
                  Voice Channels
                </p>
                {isModerator && (
                  <PlusCircle className="w-4 h-4 text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition" />
                )}
              </button>
            </div>
            <div className="space-y-[2px] mt-2">
              {audioChannels.map(renderChannel)}
            </div>
          </div>
        )}

        {!!videoChannels?.length && (
          <div className="mb-2">
            <div className="flex items-center justify-between px-2">
              <button
                onClick={() => onOpen("createChannel", { channelType: ChannelType.VIDEO })}
                className="group flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition rounded-md"
              >
                <p className="text-xs uppercase font-semibold text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition">
                  Video Channels
                </p>
                {isModerator && (
                  <PlusCircle className="w-4 h-4 text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition" />
                )}
              </button>
            </div>
            <div className="space-y-[2px] mt-2">
              {videoChannels.map(renderChannel)}
            </div>
          </div>
        )}

        {!!members?.length && (
          <div className="mb-2">
            <div className="flex items-center justify-between px-2">
              <p className="text-xs uppercase font-semibold text-zinc-500">
                Members - {members.length}
              </p>
            </div>
            <div className="space-y-[2px] mt-2">
              {members.map((member) => {
                const isActive = params?.memberId === member.id;

                return (
                  <button
                    key={member.id}
                    onClick={() => onMemberClick(member.id)}
                    className={cn(
                      "group relative w-full flex items-center gap-x-2 px-2 py-2 rounded-md transition",
                      isActive && "bg-zinc-700/20 dark:bg-zinc-700",
                      !isActive && "hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 bg-primary w-1 h-full rounded-r-full" />
                    )}
                    <div className="flex items-center gap-x-2 w-full">
                      <div className="relative w-8 h-8 rounded-full bg-zinc-700 flex-shrink-0">
                        {member.profile.imageUrl && (
                          <Image
                            src={member.profile.imageUrl}
                            alt={member.profile.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        )}
                      </div>
                      <p className={cn(
                        "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                        isActive && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                      )}>
                        {member.profile.name}
                      </p>
                      {roleIconMap[member.role]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}; 