import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";

export const initialProfile = async () => {
    const { userId, redirectToSignIn } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        return redirectToSignIn();
    }   

    let profile = await db.profile.findUnique({
        where: {
            userId: userId,
        },
    });

    let firstName = user.firstName || "";
    let lastName = user.lastName || "";

    if (!firstName && !lastName) {
        const emailParts = user.emailAddresses[0].emailAddress.split("@");
        firstName = emailParts[0].trim();
        lastName = "";
    }

    if (!profile) {
        const now = new Date();
        profile = await db.profile.create({
            data: { 
                id: randomUUID(),
                userId: userId,
                name: `${firstName} ${lastName}`,
                imageUrl: user.imageUrl,
                email: user.emailAddresses[0].emailAddress,
                createdAt: now,
                updatedAt: now
            }
        });
    }

    return profile;
}
