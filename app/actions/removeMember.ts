// /app/actions/removeMember.ts

"use server";

import { db } from "@/lib/db";

export async function removeMember(serverId: string, userId: string) {
  try {
    await db.member.delete({
      where: {
        serverId_profileId: {
          serverId,
          profileId: userId,
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("[REMOVE_MEMBER_ERROR]", error);
    return { success: false, error: "Internal Error" };
  }
}
