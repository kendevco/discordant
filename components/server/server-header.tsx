// src/components/server/server-header.tsx
"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Edit,
  LogOut,
  PlusCircle,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const { onOpen } = useModal();
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-zinc-200 font-semibold flex items-center h-12 px-3 
          border-b-2 border-zinc-800 
          bg-gradient-to-br from-[#7364c0]/10 to-[#02264a]/10 
          dark:from-[#000C2F]/10 dark:to-[#003666]/10
          hover:from-[#7364c0]/20 hover:to-[#02264a]/20 
          dark:hover:from-[#000C2F]/20 dark:hover:to-[#003666]/20 
          transition">
          {server.imageUrl && (
            <img 
              src={server.imageUrl} 
              alt={server.name}
              className="h-6 w-6 rounded-full mr-2 object-cover ring-2 ring-white/20"
            />
          )}
          {server.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666] border-none">
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("invite", { server })}
            className="text-zinc-200 hover:bg-zinc-700/50 text-sm cursor-pointer px-3 py-2 transition"
          >
            Invite People
            <UserPlus className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className="text-zinc-200 hover:bg-zinc-700/50 text-sm cursor-pointer px-3 py-2 transition"
            onClick={() => onOpen("editServer", { server })}
          >
            Server Settings
            <Edit className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            className="text-zinc-200 hover:bg-zinc-700/50 text-sm cursor-pointer px-3 py-2 transition"
            onClick={() => onOpen("members", { server })}
          >
            Manage Members
            <Users className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            className="text-zinc-200 hover:bg-zinc-700/50 text-sm cursor-pointer px-3 py-2 transition"
            onClick={() => onOpen("createChannel", { server })}
          >
            Create Channel
            <PlusCircle className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator className="bg-zinc-700/50" />}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("deleteServer", { server })}
            className="text-rose-500 hover:bg-rose-500/10 text-sm cursor-pointer px-3 py-2 transition"
          >
            Delete Server
            <Trash className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("leaveServer", { server })}
            className="text-rose-500 hover:bg-rose-500/10 text-sm cursor-pointer px-3 py-2 transition"
          >
            Leave Server
            <LogOut className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
