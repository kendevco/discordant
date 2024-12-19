import * as React from 'react';
import { redirect } from "next/navigation";
import { currentProfile } from "../../../lib/current-profile";
import { db } from "../../../lib/db";
import { ServerListClient } from "./ServerListClient";
import { ServerWithMembersWithProfiles } from "../../../types";

export const ServerList = async () => {
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
        },
        orderBy: {
            createdAt: 'asc'
        }
    });

    return <ServerListClient servers={servers} />;
}; 