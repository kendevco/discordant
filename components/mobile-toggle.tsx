"use client";

import { ChevronFirst, ChevronLast, Menu } from "lucide-react";
import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";
import { useEffect, useState } from "react";
import { Profile } from "@prisma/client";
import { ChannelList } from "@/components/UnifiedSidebar/components/sidebar/channel-list";
import { ServerList } from "@/components/UnifiedSidebar/components/sidebar/server-list";
import { cn } from "@/lib/utils";
import { ServerWithMembersWithProfiles } from "@/types/server";

interface MobileToggleProps {
  server: ServerWithMembersWithProfiles;
  servers: ServerWithMembersWithProfiles[];
  profile: Profile;
}

export const MobileToggle = ({
  server,
  servers,
  profile
}: MobileToggleProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const { isOpen, onOpen, onClose } = useMobileSidebar();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <button
        onClick={onOpen}
        className="p-2 transition rounded-lg hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 md:hidden"
      >
        <Menu className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      </button>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40",
          "flex h-full w-[300px] flex-col",
          "transform transition-transform duration-300 ease-in-out",
          "bg-gradient-to-br from-[#2B2D31] to-[#1E1F22] dark:from-[#1E1F22] dark:to-[#2B2D31]",
          "shadow-xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-800">
          <div className="flex items-center">
            <span className="text-lg font-semibold text-zinc-200 dark:text-white">
              Discordant
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 transition rounded-lg hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
          >
            {isOpen ? (
              <ChevronFirst className="w-5 h-5 text-zinc-400" />
            ) : (
              <ChevronLast className="w-5 h-5 text-zinc-400" />
            )}
          </button>
        </div>
        <div className="flex flex-1">
          <div className="w-[72px] flex-shrink-0 bg-[#1E1F22] dark:bg-[#2B2D31]">
            <ServerList servers={servers} />
          </div>
          <div className="flex-1 bg-[#2B2D31] dark:bg-[#1E1F22]">
            <ChannelList server={server} />
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 transition-opacity bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};
