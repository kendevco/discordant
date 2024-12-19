import React from "react";
import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ServerListClient } from "./ServerListClient";

interface ServerListProps {
  className?: string;
}

export const ServerList = async ({ className }: ServerListProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  return (
    <div className={className}>
      <ServerListClient servers={servers} />
    </div>
  );
};
// ... existing code ... 