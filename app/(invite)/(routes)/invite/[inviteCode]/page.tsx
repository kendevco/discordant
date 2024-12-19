import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { safeRedirectToSignIn } from "@/lib/auth";

interface InviteCodePageProps {
    params: {
        inviteCode: string;
    };
};

const InviteCodePage = async ({
    params
}: InviteCodePageProps) => {

    const profile = await currentProfile();

    if (!profile) {
        return safeRedirectToSignIn("/");
    }

    if (!params.inviteCode) {
        return redirect("/");
    }

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (existingServer) {
        return redirect(`/servers/${existingServer.id}`);
    }

    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode,
        },
        data: {
            members: {
                create: {
                    id: randomUUID(),
                    profileId: profile.id,
                    role: "GUEST",
                    updatedAt: new Date(),
                }
            }
        }
    })

    if (server) {
        return redirect(`/servers/${server.id}`);
    }

    return (
        null
    );
}
export default InviteCodePage;