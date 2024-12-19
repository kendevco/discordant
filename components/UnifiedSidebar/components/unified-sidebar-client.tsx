'use client';

import React from 'react';
import { ChannelList } from "@/components/UnifiedSidebar/components/sidebar/channel-list";
import { ServerList } from "@/components/UnifiedSidebar/components/sidebar/server-list";
import { Channel, Member, Profile, Server } from "@prisma/client";

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
  const currentServer = servers[0]; // Just for testing, replace with actual logic

  return (
    <div className="hidden h-screen text-gray-100 md:flex bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="flex flex-col items-center py-4 border-r border-gray-700 w-[72px]">
        <ServerList servers={servers} />
      </div>
      <div className="flex flex-col bg-gray-800 w-60">
        {currentServer && (
          <ChannelList server={currentServer} />
        )}
      </div>
    </div>
  );
} 