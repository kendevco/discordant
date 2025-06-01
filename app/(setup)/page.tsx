// /app/(setup)/page.tsx

import { InitialModal } from "@/components/modals/initial-modal";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial.profile";
import { redirect } from "next/navigation";
import { ensureUserInDefaultServer } from "@/lib/system/system-onboarding";

const DEFAULT_SERVER_NAME = "Code with KenDev";

const SetupPage = async () => {
  const profile = await initialProfile();
  
  // First, try to find the default "Code with KenDev" server
  const defaultServer = await db.server.findFirst({
    where: { name: DEFAULT_SERVER_NAME },
  });

  if (defaultServer) {
    // Check if user is already a member of the default server
    const existingMember = await db.member.findFirst({
      where: {
        serverId: defaultServer.id,
        profileId: profile.id,
      },
    });

    // If not a member, add them to the default server
    if (!existingMember) {
      try {
        await ensureUserInDefaultServer(profile, defaultServer);
        console.log(`Added ${profile.name} to default server: ${DEFAULT_SERVER_NAME}`);
      } catch (error) {
        console.error("Error adding user to default server:", error);
      }
    }

    // Always redirect to the default server if it exists
    return redirect(`/servers/${defaultServer.id}`);
  }

  // Fallback: Find any server the user is a member of
  const anyServer = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (anyServer) {
    return redirect(`/servers/${anyServer.id}`);
  }

  // If no servers exist, show the initial modal to create one
  return <InitialModal />;
};

export default SetupPage;
