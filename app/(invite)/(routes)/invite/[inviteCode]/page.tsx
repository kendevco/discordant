import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type Params = Promise<{ inviteCode: string }>;

interface InviteCodePageProps {
  params: Params;
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const resolvedParams = await params; // Wait for the promise to resolve
  const { inviteCode } = resolvedParams; // Destructure the inviteCode

  const profile = await currentProfile();

  if (!profile) {
    const authInstance = await auth();
    authInstance.redirectToSignIn();
    return null; // This will not be rendered because of the redirection
  }

  if (!inviteCode) {
    return redirect("/"); // If no invite code is provided, redirect to home
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`); // Redirect if the server already exists
  }

  const server = await db.server.update({
    where: {
      inviteCode: inviteCode,
    },
    data: {
      members: {
        create: [{ profileId: profile.id }],
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`); // Redirect to the server if added successfully
  }

  return null; // Return nothing if no action was performed
};

export default InviteCodePage;
