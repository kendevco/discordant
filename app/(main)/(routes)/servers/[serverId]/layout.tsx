// path: app/(main)/(routes)/servers/[serverId]/layout.tsx

import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ServerLayoutClient } from "@/app/(main)/(routes)/servers/[serverId]/server-layout-client";

interface ServerIdLayoutProps {
  children: React.ReactNode;
  params: { serverId: string };
}

const ServerIdLayout = async ({
  children,
  params
}: ServerIdLayoutProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id
        }
      }
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
    }
  });

  if (!server) {
    return redirect("/");
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    },
    include: {
      channels: true,
      members: {
        include: {
          profile: true
        }
      }
    }
  });

  return (
    <ServerLayoutClient
      server={server}
      servers={servers}
      profile={profile}
    >
      {children}
    </ServerLayoutClient>
  );
}

export default ServerIdLayout;
