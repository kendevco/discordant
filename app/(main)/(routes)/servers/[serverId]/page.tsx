// /app/(main)/(routes)/servers/[serverId]/page.tsx

import LoadingRedirect from "@/components/loading-redirect";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

type Params = Promise<{
  serverId: string;
}>;

interface ServerIdPageProps {
  params: Params;
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  // Await params since it is now a promise
  const { serverId } = await params;
  const profile = await currentProfile();
  if (!profile) {
    const authInstance = await auth();
    return authInstance.redirectToSignIn();
  }
  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
  const initialChannel = server?.channels[0];
  if (initialChannel?.name !== "general") {
    return null;
  }
  return (
    <LoadingRedirect
      serverId={serverId}
      initialChannelId={initialChannel?.id}
      shouldRedirect={initialChannel?.name === "general"}
    />
  );
};

export default ServerIdPage;
