// /app/(main)/(routes)/servers/[serverId]/conversations/[memberId]/page.tsx

import ChatHeader from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";

interface MemberIdPageProps {
  params: Promise<{
    memberId: string;
    serverId: string;
  }>;
  searchParams: Promise<{
    video?: boolean;
  }>;
}

// Generate metadata
export async function generateMetadata({ params }: MemberIdPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { memberId, serverId } = resolvedParams;
  
  const member = await db.member.findFirst({
    where: { id: memberId },
    include: {
      profile: true,
      server: true
    }
  });

  return {
    title: member ? `@${member.profile.name} - ${member.server.name}` : "Conversation",
  };
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
  const { memberId, serverId } = await params;
  const { video } = await searchParams;
  const profile = await currentProfile();
  if (!profile) {
    const authInstance = await auth();
    return authInstance.redirectToSignIn();
  }
  const currentMember = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });
  if (!currentMember) {
    return redirect("/");
  }
  const conversation = await getOrCreateConversation(
    currentMember.id,
    memberId
  );
  if (!conversation) {
    return redirect(`/servers/${serverId}`);
  }
  const { memberOne, memberTwo } = conversation;
  const otherMemberProfileId =
    memberOne.profileId === profile.id ? memberTwo.profileId : memberOne.profileId;
  const otherMember = await db.member.findFirst({
    where: {
      serverId,
      profileId: otherMemberProfileId,
    },
    include: {
      profile: true,
    },
  });
  if (!currentMember) {
    return redirect("/");
  }
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember?.profile.imageUrl || undefined}
        name={otherMember?.profile.name || ""}
        serverId={serverId}
        type="conversation"
        conversationId={conversation.id}
      />
      {video && (
        <MediaRoom chatId={conversation.id} video={true} audio={true} />
      )}
      {!video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember?.profile.name || ""}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <ChatInput
            name={otherMember?.profile.name || ""}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  );
};

export default MemberIdPage;
