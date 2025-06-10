import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { EnvironmentConfigPanel } from "@/components/admin/environment-config-panel";

const EnvironmentConfigPage = async () => {
  const profile = await currentProfile();
  const { sessionClaims } = await auth();
  
  if (!profile) {
    return redirect("/sign-in");
  }

  // Check if user has host role (highest level)
  const userRole = (sessionClaims?.metadata as any)?.role;
  const isHost = userRole === "host";

  // Temporary: Allow any authenticated user for testing
  // TODO: Uncomment role check for production
  // if (!isHost) {
  //   return redirect("/");
  // }
  
  return (
    <div className="bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666] min-h-screen">
      <EnvironmentConfigPanel />
    </div>
  );
};

export default EnvironmentConfigPage; 