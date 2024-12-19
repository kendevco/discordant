import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface ServerIdPageProps {
  params: {
    serverId: string;
  }
};

const ServerIdPage = async ({
  params
}: ServerIdPageProps) => {
  const profile = await currentProfile();


  if (!profile ) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        }
      }
    },
    include: {
      channels: {
        where: {
          name: "general"
        },
        take: 1
      }
    }
  });

  if (!server) {
    return redirect("/");
  }

  const initialChannel = server.channels[0];

  if (!initialChannel) {
    return redirect("/");
  }

  return redirect(`/servers/${params.serverId}/channels/${initialChannel.id}`);
}

export default ServerIdPage;