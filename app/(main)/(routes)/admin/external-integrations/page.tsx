import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ExternalIntegrationsPanel } from "@/components/admin/external-integrations-panel";

const ExternalIntegrationsPage = async () => {
  const profile = await currentProfile();
  const { sessionClaims } = await auth();
  
  if (!profile) {
    return redirect("/sign-in");
  }

  // Check if user has admin or host role
  const userRole = (sessionClaims?.metadata as any)?.role;
  const isAdmin = userRole === "admin";
  const isHost = userRole === "host";

  // Temporary: Allow any authenticated user for testing
  // TODO: Uncomment role check for production
  // if (!isAdmin && !isHost) {
  //   return redirect("/");
  // }
  
  return (
    <div className="bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666] min-h-screen">
      <ExternalIntegrationsPanel />
    </div>
  );
};

export default ExternalIntegrationsPage; 