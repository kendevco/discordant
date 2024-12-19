import { redirect } from "next/navigation";
import { ServerList } from "./components/ServerList";
import { UnifiedSidebarClient } from "./components/unified-sidebar-client";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function UnifiedSidebar() {
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
        <UnifiedSidebarClient servers={servers} initialProfile={profile}>
            <ServerList />
        </UnifiedSidebarClient>
    );
} 