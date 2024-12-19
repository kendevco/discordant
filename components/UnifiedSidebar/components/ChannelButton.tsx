'use client';

import { Channel, MemberRole, Server } from "@prisma/client";
import { Edit, Lock, LucideIcon, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCyberTheme } from "@/hooks/use-cyber-theme";
import { ActionTooltip } from "@/components/action-tooltip";
import { ModalType, useModal } from "@/hooks/use-modal-store";

interface ChannelButtonProps {
  channel: Channel;
  server: Server;
  icon: LucideIcon;
  role?: MemberRole;
  isActive?: boolean;
}

export function ChannelButton({
  channel,
  server,
  icon: Icon,
  role,
  isActive
}: ChannelButtonProps) {
  const router = useRouter();
  const params = useParams();
  const { isDark } = useCyberTheme();
  const { onOpen } = useModal();

  const onClick = () => {
    router.push(`/servers/${server.id}/channels/${channel.id}`);
  };

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { server, channel });
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex w-full items-center rounded-md px-2 py-2",
        "transition-all duration-300",
        isDark && "hover:shadow-[0_0_10px_rgba(0,245,255,0.3)]",
        isActive
          ? isDark
            ? "bg-zinc-700 text-white"
            : "bg-zinc-700 text-white"
          : isDark
            ? "hover:bg-zinc-700/50 text-zinc-400 hover:text-zinc-200"
            : "hover:bg-zinc-700/10 text-zinc-600 hover:text-zinc-800"
      )}
    >
      <Icon className="flex-shrink-0 w-4 h-4 mr-2" />
      <span className="truncate">{channel.name}</span>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="flex items-center ml-auto gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              onClick={(e) => onAction(e, "editChannel")}
              className={cn(
                "hidden group-hover:block w-4 h-4 transition",
                isDark
                  ? "text-zinc-400 hover:text-zinc-300"
                  : "text-zinc-500 hover:text-zinc-600"
              )}
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              onClick={(e) => onAction(e, "deleteChannel")}
              className={cn(
                "hidden group-hover:block w-4 h-4 transition",
                isDark
                  ? "text-zinc-400 hover:text-zinc-300"
                  : "text-zinc-500 hover:text-zinc-600"
              )}
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <Lock
          className={cn(
            "ml-auto w-4 h-4",
            isDark ? "text-zinc-400" : "text-zinc-500"
          )}
        />
      )}
    </button>
  );
} 