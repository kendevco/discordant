import { ChannelType } from '@prisma/client';
import { currentProfile } from '@/lib/current-profile';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { ServerHeader } from './server-header';

interface ServerSidebarProps {
    serverId: string;
}

// Use of a custom type gives context menu of members and properties. 
export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {

    const profile = await currentProfile();

    if (!profile) {
        return redirect("/");
    }

    // Mobile Sidebar will not have access to this

    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: { 
                orderBy: {
                    createdAt: "asc"
                }
            },
            members: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: "asc"
                }
            }
        }     
    });

    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT);
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO);
    const members = server?.members.filter((member) => member.profileId !== profile.id);

    if (!server) {
        return redirect("/");
    }

    const role = server.members.find((member) => member.profileId === profile.id)?.role;
    
    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31]">
            <ServerHeader   
                server={server}
                role={role}
            />
        </div>
    )

}


