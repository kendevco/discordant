"use client";

import { Server, Channel, Member, Profile } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerWithMembersAndChannels extends Server {
  channels: Channel[];
  members: (Member & {
    profile: Profile;
  })[];
}

interface ServerListClientProps {
  servers: ServerWithMembersAndChannels[];
}

export const ServerListClient = ({
  servers
}: ServerListClientProps) => {
  const params = useParams();
  const router = useRouter();
  const { onOpen } = useModal();

  const currentServer = servers.find(s => s.id === params?.serverId);

  return (
    <div className="space-y-4">
      {currentServer && (
        <div className="mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="focus:outline-none"
              asChild
            >
              <button
                className="flex items-center w-full h-12 px-3 font-semibold transition border-b-2 text-md border-neutral-200 dark:border-neutral-800 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
              >
                {currentServer.name}
                <ChevronDown className="w-5 h-5 ml-auto" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"
            >
              <DropdownMenuItem
                onClick={() => onOpen("invite", { server: currentServer })}
                className="px-3 py-2 text-sm text-indigo-600 cursor-pointer dark:text-indigo-400"
              >
                Invite People
                <UserPlus className="w-4 h-4 ml-auto" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onOpen("editServer", { server: currentServer })}
                className="px-3 py-2 text-sm cursor-pointer"
              >
                Server Settings
                <Settings className="w-4 h-4 ml-auto" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onOpen("members", { server: currentServer })}
                className="px-3 py-2 text-sm cursor-pointer"
              >
                Manage Members
                <Users className="w-4 h-4 ml-auto" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onOpen("createChannel", { server: currentServer })}
                className="px-3 py-2 text-sm cursor-pointer"
              >
                Create Channel
                <PlusCircle className="w-4 h-4 ml-auto" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onOpen("deleteServer", { server: currentServer })}
                className="px-3 py-2 text-sm cursor-pointer text-rose-500"
              >
                Delete Server
                <Trash className="w-4 h-4 ml-auto" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      {servers.map((server) => (
        <div key={server.id}>
          <ActionTooltip
            side="right"
            align="center"
            label={server.name}
          >
            <button
              onClick={() => router.push(`/servers/${server.id}`)}
              className={cn(
                "group relative flex items-center justify-center",
                "w-full h-12",
                "rounded-[24px] overflow-hidden",
                "bg-zinc-700/10 dark:bg-zinc-700/50",
                "hover:rounded-[16px] hover:bg-emerald-500",
                "transition-all",
                params?.serverId === server.id && "bg-emerald-500 rounded-[16px]"
              )}
            >
              <Image
                src={server.imageUrl || "/images/placeholder.png"}
                alt={server.name}
                width={48}
                height={48}
                className="object-cover"
              />
            </button>
          </ActionTooltip>
        </div>
      ))}
    </div>
  );
}; 