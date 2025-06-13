import { currentUser, auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";
import { UserRole, OnlineStatus, MemberRole } from "@prisma/client";

export const initialProfile = async () => {
  const user = await currentUser();
  if (!user) {
    const authInstance = await auth();
    return authInstance.redirectToSignIn();
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (profile) {
    // Update existing profile with latest Clerk data
    try {
      const updatedProfile = await db.profile.update({
        where: { id: profile.id },
        data: {
          name: `${user.firstName} ${user.lastName}`.trim() || user.username || "User",
          imageUrl: user.imageUrl,
          email: user.emailAddresses?.[0]?.emailAddress || profile.email,
          updatedAt: new Date(),
        },
      });
      return updatedProfile;
    } catch (error) {
      console.error("Failed to update existing profile:", error);
      return profile; // Return existing profile if update fails
    }
  }

  // Create comprehensive user profile with all touchpoints
  try {
  const newProfile = await db.profile.create({
    data: {
      id: randomUUID(),
      userId: user.id,
        name: `${user.firstName} ${user.lastName}`.trim() || user.username || "User",
      imageUrl: user.imageUrl,
        email: user.emailAddresses?.[0]?.emailAddress || "",
        role: UserRole.USER, // Default role for new users
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Note: UserActivity and UserPreferences models don't exist in current schema
    // These features can be added later when the models are implemented
    console.log(`✅ Profile created successfully: ${newProfile.name} (${newProfile.id})`);
    console.log("Note: User activity tracking and preferences will be available when models are implemented");

    // Create initial user session tracking
    try {
      await db.userSession.create({
        data: {
          id: randomUUID(),
          profileId: newProfile.id,
          sessionId: `initial-${Date.now()}-${randomUUID().substring(0, 8)}`,
          isActive: true,
          lastActivity: new Date(),
          connectedAt: new Date(),
          ipAddress: null,
          userAgent: 'Initial Profile Setup',
          serverId: null,
        },
      });
    } catch (sessionError) {
      console.error("Failed to create initial session:", sessionError);
      // Don't fail profile creation if session creation fails
    }



    // Ensure user gets added to default server if it exists
    try {
      const defaultServer = await db.server.findFirst({
        where: { name: "Code with KenDev" },
      });

      if (defaultServer) {
        // Check if already a member (shouldn't be, but just in case)
        const existingMember = await db.member.findFirst({
          where: {
            profileId: newProfile.id,
            serverId: defaultServer.id,
          },
        });

        if (!existingMember) {
          // Create member record
          const newMember = await db.member.create({
            data: {
              id: randomUUID(),
              profileId: newProfile.id,
              serverId: defaultServer.id,
              role: MemberRole.GUEST,
              onlineStatus: OnlineStatus.OFFLINE,
              lastSeen: new Date(),
              isOnline: false,
      updatedAt: new Date(),
    },
  });

          // Log member creation activity
          await db.memberActivity.create({
            data: {
              id: randomUUID(),
              memberId: newMember.id,
              serverId: defaultServer.id,
              activityType: 'MEMBER_JOINED',
              description: `${newProfile.name} joined the server`,
              timestamp: new Date(),
              metadata: JSON.stringify({
                profileCreation: true,
                defaultServerAutoJoin: true,
              }),
            },
          });

          console.log(`[INITIAL_PROFILE] Added ${newProfile.name} to default server as member`);
        }
      }
    } catch (serverError) {
      console.error(`[INITIAL_PROFILE] Failed to add to default server:`, serverError);
      // Don't fail profile creation if server join fails
    }

  return newProfile;

  } catch (error) {
    console.error("❌ Failed to create initial profile:", error);
    
    // If profile creation fails completely, still try to return existing data
    // This prevents the app from breaking on profile creation errors
    try {
      const existingProfile = await db.profile.findUnique({
        where: { userId: user.id },
      });
      
      if (existingProfile) {
        console.log("Returning existing profile after creation failure");
        return existingProfile;
      }
    } catch (lookupError) {
      console.error("Failed to lookup existing profile:", lookupError);
    }
    
    // Last resort: throw the original error
    throw error;
  }
};
