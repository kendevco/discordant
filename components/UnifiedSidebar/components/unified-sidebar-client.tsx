'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ChannelList } from "./ChannelList";
import { UserSection } from "./UserSection";
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { Server, Channel, Member, Profile } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useParams } from 'next/navigation';
import { useTheme } from "next-themes";

interface ServerWithMembersAndChannels extends Server {
  channels: Channel[];
  members: (Member & {
    profile: Profile;
  })[];
}

interface UnifiedSidebarClientProps {
  children: React.ReactNode;
  servers: ServerWithMembersAndChannels[];
  initialProfile: Profile;
}

export function UnifiedSidebarClient({ children, servers, initialProfile }: UnifiedSidebarClientProps) {
  const params = useParams();
  const serverId = typeof params?.serverId === 'string' ? params.serverId : undefined;
  const currentServer = servers.find(server => server.id === serverId);
  const { theme } = useTheme();

  return (
    <div className="relative flex h-full">
      {/* Server Navigation - Always visible */}
      <div className={cn(
        "flex h-full w-[72px] z-30 flex-col fixed inset-y-0 left-0",
        "transition-colors duration-300",
        theme === 'dark' ? "bg-[#1E1F22]" : "bg-[#E3E5E8]"
      )}>
        {children}
      </div>

      {/* Channel Section */}
      <div className={cn(
        "flex h-full w-60 z-20 flex-col fixed inset-y-0",
        "transition-all duration-300",
        theme === 'dark' ? "bg-[#2B2D31]" : "bg-[#F2F3F5]",
        !serverId ? "left-[-240px]" : "left-[72px]"
      )}>
        {serverId && currentServer && (
          <>
            <ChannelList
              serverId={serverId}
              server={currentServer}
              initialProfile={initialProfile}
            />
            <UserSection />
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      {!serverId && (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed z-50 top-4 left-4 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 flex gap-0 w-[300px]">
            <VisuallyHidden>
              <SheetTitle>Navigation Menu</SheetTitle>
            </VisuallyHidden>
            <div className={cn(
              "w-[72px]",
              theme === 'dark' ? "bg-[#1E1F22]" : "bg-[#E3E5E8]"
            )}>
              {children}
            </div>
            {serverId && currentServer && (
              <div className={cn(
                "flex-1",
                theme === 'dark' ? "bg-[#2B2D31]" : "bg-[#F2F3F5]"
              )}>
                <ChannelList
                  serverId={serverId}
                  server={currentServer}
                  initialProfile={initialProfile}
                />
                <UserSection />
              </div>
            )}
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
} 