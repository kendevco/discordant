import { currentProfile } from "@/lib/current-profile";
import { ServerSidebar } from "./server-sidebar";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

interface ServerSidebarServerProps {
  serverId: string;
}

export async function ServerSidebarServer({
  serverId
}: ServerSidebarServerProps) {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id
        }
      }
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc"
        }
      },
      members: {
        include: {
          profile: true
        },
        orderBy: {
          role: "asc"
        }
      }
    }
  });

  if (!server) {
    return redirect("/");
  }

  return <ServerSidebar serverId={serverId} initialProfile={profile} server={server} />;
} 