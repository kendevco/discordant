// /app/(main)/(routes)/servers/[serverId]/channels/[channelId]/page.tsx

import { Metadata } from "next";
import { ChannelChatWrapper } from "@/components/chat/channel-chat-wrapper";
import { ChatHeader } from "@/components/chat/chat-header";
import { MediaRoom } from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

type Params = Promise<{ channelId: string; serverId: string }>;

interface ChannelIdPageProps {
  params: Params;
}

// Generate metadata
export async function generateMetadata({ params }: ChannelIdPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { channelId, serverId } = resolvedParams;

  const channel = await db.channel.findUnique({
    where: { id: channelId },
    include: {
      server: true
    }
  });

  return {
    title: channel ? `#${channel.name} - ${channel.server.name}` : "Channel",
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  // Await the params, since they are now a promise
  const resolvedParams = await params;
  const { channelId, serverId } = resolvedParams;
  const profile = await currentProfile();
  if (!profile) {
    const authInstance = await auth();
    return authInstance.redirectToSignIn();
  }
  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });
  const member = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id,
    },
  });
  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
  });

  if (!member || !channel) {
    redirect("/");
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      {/* Fixed Header */}
      <div className="flex-shrink-0">
        <ChatHeader
          name={channel.name}
          serverId={channel.serverId}
          type="channel"
          channelId={channel.id}
          serverImageUrl={server?.imageUrl}
          serverName={server?.name}
        />
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex-1 min-h-0">
        {channel.type === ChannelType.TEXT && (
          <ChannelChatWrapper
            member={member}
            channel={{
              id: channel.id,
              name: channel.name,
              serverId: channel.serverId,
            }}
          />
        )}
        {channel.type === ChannelType.AUDIO && (
          <MediaRoom chatId={channel.id} video={false} audio={true} />
        )}
        {channel.type === ChannelType.VIDEO && (
          <MediaRoom chatId={channel.id} video={true} audio={true} />
        )}
      </div>
    </div>
  );
};
export default ChannelIdPage;
