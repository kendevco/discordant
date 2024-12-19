import { randomUUID } from "crypto";

import prismadb from "@/lib/prismadb";
import { MAX_FREE_COUNTS } from "@/constants";
import { currentProfile } from "@/lib/current-profile";
import { Profile } from "@prisma/client";

export const incrementApiLimit = async () => {
  try {
    const profile = await currentProfile();
    
    if (!profile || !profile.id) {
      return;
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
      where: { userId: profile.id },
    });

    if (userApiLimit) {
      await prismadb.userApiLimit.update({
        where: { userId: profile.id },
        data: { 
          count: userApiLimit.count + 1,
          updatedAt: new Date()
        },
      });
    } else {
      await prismadb.userApiLimit.create({
        data: { 
          id: randomUUID(),
          userId: profile.id, 
          count: 1,
          updatedAt: new Date()
        },
      });
    }
  } catch (error) {
    console.error("Error incrementing API limit:", error);
    return;
  }
};

export const checkApiLimit = async () => {
  try {
    const profile = await currentProfile();
    
    if (!profile || !profile.id) {
      return false;
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
      where: { userId: profile.id },
    });

    if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking API limit:", error);
    return false;
  }
};

export const getApiLimitCount = async () => {
  try {
    const profile = await currentProfile();
    
    if (!profile || !profile.id) {
      return 0;
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
      where: {
        userId: profile.id
      }
    });

    if (!userApiLimit) {
      return 0;
    }

    return userApiLimit.count;
  } catch (error) {
    console.error("Error getting API limit count:", error);
    return 0;
  }
};
