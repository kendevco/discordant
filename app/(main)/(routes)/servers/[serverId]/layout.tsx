// path: app/(main)/(routes)/servers/[serverId]/layout.tsx

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { UnifiedSidebar } from "@/components/UnifiedSidebar/UnifiedSidebar";

interface ServerIdLayoutProps {
  children: React.ReactNode;
  params: { serverId: string };
}

export default async function ServerIdLayout({
  children,
  params,
}: ServerIdLayoutProps) {
  const profile = await currentProfile();
  const { userId } = await auth();

  if (!profile || !userId) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className=" md:block">
        <UnifiedSidebar />
      </div>
      <main className="h-full md:pl-[312px]">
        {children}
      </main>
    </div>
  );
}
