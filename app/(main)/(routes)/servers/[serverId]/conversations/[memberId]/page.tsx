import { ChatHeader } from "@/components/chat/chat-header";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
    params: {
        memberId: string;
        serverId: string;
    }
}

const MemberIdPage = async ({
    params 
}: MemberIdPageProps) => {
    
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    const currentMember = await db.member.findFirst({
        where: {
                serverId: params.serverId,
                profileId: profile.id      
        },
        include: {
            profile: true
        }
    });

    if (!currentMember) {
        return redirect("/");
    }

    const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

    // If something went wrong, we can't load a conversation redirect to the server page
    if (!conversation) {
        return redirect(`/servers/${params.serverId}`);
    }

    const { memberOne, memberTwo } = conversation;

    // Pick the opposite member either could have initiated we have no way of knowing
    // which one is the current member
    const otherMember = memberOne.profileId === currentMember.profileId ? memberTwo : memberOne;

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader 
                // @ts-ignore
                imageUrl={otherMember.profile?.imageUrl}
                name={otherMember.profile.name}
                serverId={params.serverId}
                type="conversation"
            />
        </div>
    )
}

export default MemberIdPage;