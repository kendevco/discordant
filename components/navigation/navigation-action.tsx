"use client";

import { Plus } from "lucide-react";

import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";
import { cn } from "@/lib/utils";

export const NavigationAction = () => {
  const { onOpen } = useModal();
  const { onClose: closeMobileSidebar } = useMobileSidebar();

  const onClick = () => {
    onOpen("createServer");
    closeMobileSidebar();
  };

  return (
    <ActionTooltip
      side="right"
      align="center"
      label="Add a server"
    >
      <button
        onClick={onClick}
        className="group flex items-center"
      >
        <div className={cn(
          "flex mx-3 h-[48px] w-[48px] rounded-[24px]",
          "group-hover:rounded-[16px]",
          "group-hover:bg-emerald-500",
          "transition-all overflow-hidden",
          "items-center justify-center",
          "bg-background dark:bg-neutral-700"
        )}>
          <Plus
            className={cn(
              "group-hover:text-white transition text-emerald-500",
              "h-6 w-6"
            )}
          />
        </div>
      </button>
    </ActionTooltip>
  )
}