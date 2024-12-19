'use client';

import { useMediaQuery } from "@/hooks/use-media-query";
import { ServerList } from "@/components/UnifiedSidebar/components/sidebar/server-list";
import { ChannelList } from "@/components/UnifiedSidebar/components/sidebar/channel-list";
import { MobileToggle } from "@/components/mobile-toggle";
import { Profile } from "@prisma/client";
import { ServerWithMembersWithProfiles } from "@/types/server";
import { cn } from "@/lib/utils";

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

  return (
    <div className="h-full">
      {isDesktop ? (
        <div className="fixed top-0 left-0 flex h-full">
          <div className="flex flex-col w-[72px] h-full bg-[#1E1F22]">
            <ServerList servers={servers} />
          </div>
          <div className="flex flex-col w-60 h-full bg-[#2B2D31]">
            <ChannelList server={server} />
          </div>
        </div>
      ) : (
        <nav className="md:hidden flex items-center p-4 h-[64px] fixed top-0 w-full z-30 bg-[#2B2D31]">
          <MobileToggle server={server} servers={servers} profile={profile} />
        </nav>
      )}

      <main className={cn(
        "h-full",
        isDesktop ? "pl-[332px]" : "pt-[64px]"
      )}>
        {children}
      </main>
    </div>
  );
}; 