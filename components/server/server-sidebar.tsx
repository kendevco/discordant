import { ChannelType, MemberRole } from '@prisma/client';
import { currentProfile } from '@/lib/current-profile';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { ServerHeader } from './server-header';
import { ScrollArea } from '../ui/scroll-area';
import { ServerSearch } from './server-search';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { classNames } from 'uploadthing/client';
import { Separator } from '../ui/separator';
import { ServerSection } from './server-section';
import { ServerChannel } from './server-channel';
import { ServerMember } from './server-member';

interface ServerSidebarProps {
    serverId: string;
}
const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className='mr-2 w-4 text-indigo-500'/>,
    [MemberRole.ADMIN]: <ShieldAlert className='mr-2 w-4 text-red-500'/>
}

// Use of a custom type gives context menu of members and properties. 
export const ServerSidebar = async ({ 
    serverId 
}: ServerSidebarProps) => {

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
            
            <ScrollArea className='flex-1 px-3'>
               
            <ServerSearch
                data={[
                    {
                        label: "Text Channels",
                        type: "channel",
                        data: textChannels?.map((channel) => ({
                            id: channel.id,
                            name: channel.name,
                            icon: iconMap[channel.type],
                        }))
                    },
                    {
                        label: "Voice Channels",
                        type: "channel",
                        data: audioChannels?.map((channel) => ({
                            id: channel.id,
                            name: channel.name,
                            icon: iconMap[channel.type],
                        }))
                    },
                    {
                        label: "Video Channels",
                        type: "channel",
                        data: videoChannels?.map((channel) => ({
                            id: channel.id,
                            name: channel.name,
                            icon: iconMap[channel.type],
                        }))
                    },
                    {
                        label: "Members",
                        type: "member",
                        data: members?.map((member) => ({
                            id: member.id,
                            name: member.profile.name,
                            icon: roleIconMap[member.role],
                        }))
                    }
                ]}
            />
            <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2'/>


            {!!textChannels?.length && (
                <div className='mb-2' >
                    <ServerSection 
                        sectionType='channels'
                        channelType={ChannelType.TEXT}
                        role={role}
                        label='Text Channels'
                        server={server} // Extra property recommended by Copilot
                    />
                    <div className='space-y-[2px]'>
                        {textChannels.map((channel) => (
                            <ServerChannel 
                                channel={channel}
                                server={server}
                                role={role}
                            />
                            )
                        )}
                    </div>
                </div>   
            )
            }

            {!!audioChannels?.length && (
                <div className='mb-2' >
                    <ServerSection 
                        sectionType='channels'
                        channelType={ChannelType.AUDIO}
                        role={role}
                        label='Voice Channels'
                        server={server} // Extra property recommended by Copilot
                    />
                    <div className='space-y-[2px]'>
                        {audioChannels.map((channel) => (
                            <ServerChannel 
                                channel={channel}
                                server={server}
                                role={role}
                            />
                            )
                        )}
                    </div>
                </div>   
            )
            }

            {!!videoChannels?.length && (
                <div className='mb-2' >
                    <ServerSection 
                        sectionType='channels'
                        channelType={ChannelType.VIDEO}
                        role={role}
                        label='Video Channels'
                        server={server} // Extra property recommended by Copilot
                    />
                    <div className='space-y-[2px]'>
                        {videoChannels.map((channel) => (
                            <ServerChannel 
                                channel={channel}
                                server={server}
                                role={role}
                            />
                            )
                        )}
                    </div>
                </div>   
            )}

            {!!members?.length && (
                <div className='mb-2' >
                    <ServerSection 
                        sectionType='members'
                        channelType={ChannelType.VIDEO}
                        role={role}
                        label='Members'
                        server={server} // Extra property recommended by Copilot
                    />
                    <div className='space-y-[2px]'> 
                        {members.map((member) => (
                            <ServerMember 
                                key={member.id}
                                member={member}
                                server={server}
                            />

                            )
                        )}
                    </div>
                </div>   
            )}


            </ScrollArea>
        </div>
    )

}


