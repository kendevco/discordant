'use client';

import React from 'react';
import { ChannelList } from "@/components/UnifiedSidebar/components/sidebar/channel-list";
import { ServerList } from "@/components/UnifiedSidebar/components/sidebar/server-list";
import { Channel, Member, Profile, Server } from "@prisma/client";
import { useParams } from "next/navigation";

interface ServerWithMembersAndChannels extends Server {
  channels: Channel[];
  members: (Member & {
    profile: Profile;
  })[];
}

interface UnifiedSidebarClientProps {
  servers: ServerWithMembersAndChannels[];
  initialProfile: Profile;
}

export function UnifiedSidebarClient({ servers, initialProfile }: UnifiedSidebarClientProps) {
  const params = useParams();
  const currentServer = servers.find(server => server.id === params?.serverId) || servers[0];

  return (
    <nav className="hidden md:flex fixed left-0 top-0 h-full">
      <div className="flex flex-col w-[72px] h-full bg-[#1E1F22]">
        <ServerList servers={servers} />
      </div>
      {currentServer && (
        <div className="flex flex-col w-60 h-full bg-[#2B2D31]">
          <ChannelList server={currentServer} />
        </div>
      )}
    </nav>
  );
} 