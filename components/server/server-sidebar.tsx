'use client';

import { Channel, ChannelType, MemberRole, Profile, Server } from "@prisma/client";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

import { cn } from "@/lib/utils";
import { useCyberTheme } from "@/hooks/use-cyber-theme";
import { ServerHeader } from './server-header';
import { ScrollArea } from '../ui/scroll-area';
import { ServerSearch } from './server-search';
import { Separator } from '../ui/separator';
import { ServerSection } from './server-section';
import { ServerChannel } from './server-channel';
import { ServerMember } from './server-member';

export type ServerWithMembersWithProfiles = Server & {
    channels: Channel[];
    members: Array<{
        id: string;
        serverId: string;
        profileId: string;
        role: MemberRole;
        createdAt: Date;
        updatedAt: Date;
        profile: Profile;
    }>;
};

interface ServerSidebarProps {
    serverId: string;
    initialProfile: Profile;
    server?: ServerWithMembersWithProfiles;
}

export const ServerSidebar = ({
    serverId,
    initialProfile,
    server
}: ServerSidebarProps) => {
    const { isDark } = useCyberTheme();
    const router = useRouter();
    const params = useParams();

    const textChannels = useMemo(() => {
        if (!server?.channels) return [];
        return server.channels.filter((channel) => channel.type === ChannelType.TEXT);
    }, [server?.channels]);

    const audioChannels = useMemo(() => {
        if (!server?.channels) return [];
        return server.channels.filter((channel) => channel.type === ChannelType.AUDIO);
    }, [server?.channels]);

    const videoChannels = useMemo(() => {
        if (!server?.channels) return [];
        return server.channels.filter((channel) => channel.type === ChannelType.VIDEO);
    }, [server?.channels]);

    const members = useMemo(() => {
        if (!server?.members || !initialProfile?.id) return [];
        return server.members.filter((member) => member.profileId !== initialProfile.id);
    }, [server?.members, initialProfile?.id]);

    const role = useMemo(() => {
        if (!server?.members || !initialProfile?.id) return undefined;
        return server.members.find((member) => member.profileId === initialProfile.id)?.role;
    }, [server?.members, initialProfile?.id]);

    if (!server || !initialProfile) {
        return null;
    }

    return (
        <div className="flex flex-col h-full w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader
                server={server}
                role={role}
            />
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch
                        data={[
                            {
                                label: "Text Channels",
                                type: "channel",
                                data: textChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: <Hash className="mr-2 h-4 w-4" />,
                                }))
                            },
                            {
                                label: "Voice Channels",
                                type: "channel",
                                data: audioChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: <Mic className="mr-2 h-4 w-4" />,
                                }))
                            },
                            {
                                label: "Video Channels",
                                type: "channel",
                                data: videoChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: <Video className="mr-2 h-4 w-4" />,
                                }))
                            },
                            {
                                label: "Members",
                                type: "member",
                                data: members?.map((member) => ({
                                    id: member.id,
                                    name: member.profile.name,
                                    icon: member.role === MemberRole.ADMIN ? 
                                        <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" /> :
                                        member.role === MemberRole.MODERATOR ?
                                            <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" /> :
                                            null
                                }))
                            }
                        ]}
                    />
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
                {!!textChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.TEXT}
                            role={role}
                            label="Text Channels"
                            server={server}
                        />
                        <div className="space-y-[2px]">
                            {textChannels.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    server={server}
                                    role={role}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {!!audioChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.AUDIO}
                            role={role}
                            label="Voice Channels"
                            server={server}
                        />
                        <div className="space-y-[2px]">
                            {audioChannels.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    server={server}
                                    role={role}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {!!videoChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.VIDEO}
                            role={role}
                            label="Video Channels"
                            server={server}
                        />
                        <div className="space-y-[2px]">
                            {videoChannels.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    server={server}
                                    role={role}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {!!members?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="members"
                            role={role}
                            label="Members"
                            server={server}
                        />
                        <div className="space-y-[2px]">
                            {members.map((member) => (
                                <ServerMember
                                    key={member.id}
                                    member={member}
                                    server={server}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};


