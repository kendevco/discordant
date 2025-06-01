'use server'

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function getAuthenticatedUser() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await db.profile.findUnique({
      where: {
        userId
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("[GET_AUTHENTICATED_USER_ERROR]", error);
    throw new Error("Failed to get authenticated user");
  }
} 