// /app/actions/addMembers.ts

"use server";

import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

export async function addMembers(serverId: string, userIds: string[]) {
  try {
    console.log("Server action - adding members:", { serverId, userIds }); // Debug log

    // Validate inputs
    if (!serverId || !userIds.length) {
      return { success: false, error: "Invalid input" };
    }

    // Add members in parallel
    await Promise.all(
      userIds.map(async (userId: string) => {
        const existingMember = await db.member.findFirst({
          where: {
            serverId,
            profileId: userId,
          },
        });

        if (!existingMember) {
          await db.member.create({
            data: {
              id: uuidv4(),
              profileId: userId,
              serverId,
              role: "GUEST",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
        }
      })
    );

    // Revalidate the server page
    revalidatePath(`/servers/${serverId}`);

    return { success: true };
  } catch (error) {
    console.error("[ADD_MEMBERS_ERROR]", error);
    return { success: false, error: "Internal Error" };
  }
}
