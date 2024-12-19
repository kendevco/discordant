'use client';

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole, Server } from "@prisma/client";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles
    role?: MemberRole
};

export const ServerHeader = ({
    server,
    role
}: ServerHeaderProps) => {
    const { onOpen } = useModal();

    const isAdmin = role === MemberRole.ADMIN;
    const isModerator = isAdmin || role === MemberRole.MODERATOR;

    return (

            <DropdownMenu>
                <DropdownMenuTrigger
                    className="focus:outline-none"
                    asChild 
                >
                    <button
                        className="flex items-center w-full h-12 px-3 font-semibold transition border-b-2 text-md border-neutral-200 dark:border-neutral-800 hober:bg-zinc-700/10 dark:hover:bg-zinc-700/50 "
                    >
                        {server.name}
                        <ChevronDown className="w-5 h-5 ml-auto" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-56 text-xs font-medium text-black
                    dark:text-neutral-400 space-y-[2px]"
                >
                    {isModerator && (
                        <DropdownMenuItem
                            onClick={() => onOpen("invite", { server })}

                            className="px-3 py-2 text-sm text-indigo-600 cursor-pointer dark:text-indigo-400"
                        >
                            Invite People
                            <UserPlus 
                                className="w-4 h-4 ml-auto"
                            />
                        </DropdownMenuItem>
                    )}

                    {isAdmin && (
                        <DropdownMenuItem
                            onClick={() => onOpen("editServer", { server })}
                            className="px-3 py-2 text-sm cursor-pointer"
                        >
                            Server Settings
                            <Settings 
                                className="w-4 h-4 ml-auto"
                            />
                        </DropdownMenuItem>
                    )}

                    {isAdmin && (
                        <DropdownMenuItem
                            onClick={() => onOpen("members", { server })}
                            className="px-3 py-2 text-sm cursor-pointer"
                        >
                            Manage Members
                            <Users 
                                className="w-4 h-4 ml-auto"
                            />
                        </DropdownMenuItem>
                    )}

                    {isModerator && (
                        <DropdownMenuItem
                        onClick={() => onOpen("createChannel", { server })}
                            className="px-3 py-2 text-sm cursor-pointer"
                        >
                            Create Channel
                            <PlusCircle 
                                className="w-4 h-4 ml-auto"
                            />
                        </DropdownMenuItem>
                    )}

                    {isModerator && (
                        <DropdownMenuSeparator />
                        )
                    }

                    {isAdmin && (
                        <DropdownMenuItem
                        onClick={() => onOpen("deleteServer", { server })}
                            className="px-3 py-2 text-sm cursor-pointer text-rose-500"
                        >
                            Delete Server
                            <Trash 
                                className="w-4 h-4 ml-auto"
                            />
                        </DropdownMenuItem>
                    )}

                    {!isAdmin && (
                        <DropdownMenuItem
                        onClick={() => onOpen("leaveServer", { server })}
                            className="px-3 py-2 text-sm cursor-pointer text-rose-500"
                        >
                            Leave Server
                            <LogOut 
                                className="w-4 h-4 ml-auto"
                            />
                        </DropdownMenuItem>
                    )}

                </DropdownMenuContent>
            </DropdownMenu>

    )
}
