"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import { ActionTooltip } from "../../../../action-tooltip";
import { Plus } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerSectionProps {
    label: string;
    role?: MemberRole
    sectionType: "channels" | "members";
    channelType?: ChannelType;
    server?: ServerWithMembersWithProfiles;
    children: React.ReactNode;
}

export const ServerSection = ({
    label,
    role,
    sectionType,
    channelType,
    server,
    children
}: ServerSectionProps) => {

    const { onOpen } = useModal();

    return (
        <div>
            <div className="flex items-center justify-between py-2">
                <p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                    {label}
                </p>
                {role !== MemberRole.GUEST && sectionType === "channels" && (
                    <ActionTooltip label="Create Channel" side="top" >
                        <button
                            onClick={() => onOpen("createChannel", { channelType })}
                            className="transition text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </ActionTooltip>
                )}

                {role === MemberRole.ADMIN && sectionType === "members" && (
                    <ActionTooltip label="Manage Members" side="top" >
                        <button
                            onClick={() => onOpen("members", { server })}
                            className="transition text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </ActionTooltip>
                )}
            </div>
            {children}
        </div>
    )
}