import { redirect } from "next/navigation";
import { ChannelType, MemberRole } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ServerSidebarClient } from "./server-sidebar-client";

interface ServerSidebarProps {
  serverId: string;
  initialProfile: any;
  server?: any;
}

export const ServerSidebar = async ({
  serverId,
  initialProfile
}: ServerSidebarProps) => {
  const profile = initialProfile || await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  const role = server.members.find((member) => member.profileId === profile.id)?.role;

  return (
    <ServerSidebarClient
      serverId={serverId}
      profile={profile}
    />
  );
};


