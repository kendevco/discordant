'use client';

import { Channel, ChannelType, Member, MemberRole, Profile, Server } from "@prisma/client";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video, ChevronDown, UserPlus, Settings, Users, PlusCircle, Trash, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useModal } from "@/hooks/use-modal-store";
import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface ChannelListProps {
  serverId: string;
  server?: Server & {
    channels: Channel[];
    members: (Member & {
      profile: Profile;
    })[];
  };
  initialProfile?: Profile;
}

export const ChannelList = ({
  serverId,
  server,
  initialProfile
}: ChannelListProps) => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { onOpen } = useModal();
  const { onClose } = useMobileSidebar();

  const role = server?.members.find((member) => member.profileId === initialProfile?.id)?.role;

  const iconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video,
  };

  const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />
  };

  const onClick = (channelId: string) => {
    router.push(`/servers/${serverId}/channels/${channelId}`);
  };

  if (!server) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <div className="flex flex-col w-full">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="focus:outline-none"
              asChild
            >
              <button
                className="flex items-center w-full h-12 px-3 py-2 transition border-b-2 border-neutral-200 dark:border-neutral-800 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
              >
                <p className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                  {server.name}
                </p>
                <ChevronDown
                  className="w-5 h-5 ml-auto transition text-zinc-500 dark:text-zinc-400"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"
            >
              {(role === MemberRole.ADMIN || role === MemberRole.MODERATOR) && (
                <DropdownMenuItem
                  onClick={() => onOpen("invite", { server })}
                  className="px-3 py-2 text-sm text-indigo-600 cursor-pointer dark:text-indigo-400"
                >
                  Invite People
                  <UserPlus className="w-4 h-4 ml-auto" />
                </DropdownMenuItem>
              )}
              {role === MemberRole.ADMIN && (
                <DropdownMenuItem
                  onClick={() => onOpen("editServer", { server })}
                  className="px-3 py-2 text-sm cursor-pointer"
                >
                  Server Settings
                  <Settings className="w-4 h-4 ml-auto" />
                </DropdownMenuItem>
              )}
              {role === MemberRole.ADMIN && (
                <DropdownMenuItem
                  onClick={() => onOpen("members", { server })}
                  className="px-3 py-2 text-sm cursor-pointer"
                >
                  Manage Members
                  <Users className="w-4 h-4 ml-auto" />
                </DropdownMenuItem>
              )}
              {role === MemberRole.ADMIN && (
                <DropdownMenuItem
                  onClick={() => onOpen("createChannel", { server })}
                  className="px-3 py-2 text-sm cursor-pointer"
                >
                  Create Channel
                  <PlusCircle className="w-4 h-4 ml-auto" />
                </DropdownMenuItem>
              )}
              {role === MemberRole.ADMIN && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onOpen("deleteServer", { server })}
                    className="px-3 py-2 text-sm cursor-pointer text-rose-500"
                  >
                    Delete Server
                    <Trash className="w-4 h-4 ml-auto" />
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {Object.keys(ChannelType).map((type) => {
            const channelType = type as keyof typeof ChannelType;
            const channels = server.channels
              .filter((channel) => channel.type === channelType);

            if (!channels.length) return null;

            return (
              <div key={type} className="mb-2">
                <div className="px-2">
                  <div className={cn(
                    "flex items-center gap-x-2 px-2 py-2 rounded-md transition-all",
                    theme === "dark" ? "hover:bg-zinc-700/50" : "hover:bg-zinc-300/50"
                  )}>
                    <p className={cn(
                      "text-xs uppercase font-semibold tracking-wide",
                      theme === "dark" ? "text-zinc-400" : "text-zinc-500"
                    )}>
                      {type.toLowerCase()} Channels
                    </p>
                    {role && role !== MemberRole.GUEST && (
                      <button
                        onClick={() => onOpen("createChannel", {
                          server,
                          channelType: ChannelType[channelType]
                        })}
                        className={cn(
                          "text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition",
                        )}
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-[2px]">
                  {channels.map((channel) => {
                    const Icon = iconMap[channel.type];
                    const isActive = channel.id === params?.channelId;

                    return (
                      <button
                        key={channel.id}
                        onClick={() => onClick(channel.id)}
                        className={cn(
                          "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                          isActive && "bg-zinc-700/20 dark:bg-zinc-700"
                        )}
                      >
                        <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                        <p className={cn(
                          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                          isActive && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                        )}>
                          {channel.name}
                        </p>
                        {channel.name !== "general" && role && role !== MemberRole.GUEST && (
                          <div className="flex items-center ml-auto gap-x-2">
                            {roleIconMap[role]}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-end p-2">
        <button
          onClick={onClose}
          className="transition text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};