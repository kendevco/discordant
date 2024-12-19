'use client';

import { useMediaQuery } from "@/hooks/use-media-query";
import { ServerList } from "@/components/UnifiedSidebar/components/sidebar/server-list";
import { ChannelList } from "@/components/UnifiedSidebar/components/sidebar/channel-list";
import { MobileToggle } from "@/components/mobile-toggle";
import { Profile } from "@prisma/client";
import { ServerWithMembersWithProfiles } from "@/types/server";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface ServerLayoutClientProps {
  server: ServerWithMembersWithProfiles;
  servers: ServerWithMembersWithProfiles[];
  profile: Profile;
  children: React.ReactNode;
}

export const ServerLayoutClient = ({
  server,
  servers,
  profile,
  children
}: ServerLayoutClientProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    console.log("Window width:", window.innerWidth);
    console.log("Media query state:", isDesktop);
  }, [isDesktop]);

  return (
    <div className="h-full">
      {/* Desktop Navigation */}
      {isDesktop && (
        <>
          <nav className="md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0 bg-[#1E1F22]">
            <ServerList servers={servers} />
          </nav>
          <aside className="md:flex h-full w-60 z-20 flex-col fixed inset-y-0 left-[72px] bg-[#2B2D31]">
            <ChannelList server={server} />
          </aside>
        </>
      )}

      {/* Mobile Navigation */}
      {!isDesktop && (
        <nav className="md:hidden flex items-center p-4 h-[64px] fixed top-0 w-full z-30 bg-[#2B2D31]">
          <MobileToggle server={server} servers={servers} profile={profile} />
        </nav>
      )}

      {/* Main Content */}
      <main className={cn(
        "h-full",
        isDesktop ? "pl-[332px]" : "pt-[64px]"
      )}>
        {children}
      </main>
    </div>
  );
}; 