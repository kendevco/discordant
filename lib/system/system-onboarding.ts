import { Profile, Server, ChannelType, MemberRole } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { createSystemMessage } from "@/lib/system/system-messages";
// Constants
const SYSTEM_USER_ID = "system-user-9000";
const SYSTEM_USER_NAME = "System User";
const SYSTEM_USER_IMAGE = "/SystemAvatarNuke.png";
const SYSTEM_USER_EMAIL = "ai@payload.nuke.com";
const DEFAULT_SERVER_NAME = "Code with KenDev";
const DEFAULT_SYSTEM_CHANNEL = "system";

// Default users to be added to new servers
const DEFAULT_USERS = [
  {
    id: "a90a7a15-1419-4c72-b58f-52adfc11a0aa",
    userId: "user_2UiYG68D5ki8SE5RBJGkgkWRvjS",
    name: "Kenneth Courtney",
    email: "kenneth.courtney@gmail.com",
    role: MemberRole.ADMIN,
    imageUrl:
      "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yVWlZR01MTUxETnBmN1NLYzlWZVBXNnNJaEguanBlZyJ9", // Using Clerk image URL
  },
  /*   {
    id: "3f69fc0c-43e7-464a-bca4-be68c8ba7825",
    userId: "user_2V2E7jcIaaPTXXKz4K8lp5jKHUq",
    name: "Tyler Suzanne",
    email: "tylersuzanne84@gmail.com",
    role: MemberRole.ADMIN,
    imageUrl:
      "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQWNIVHRlMjRzVGdQN2dHY1ZvVmQzMnl5eExzZmlac1BSN3ZqeXRQU19UX2xRUTY9czEwMDAtYyIsInMiOiI3b3RRejFqcHlHM2dhQVlFM2h0S3lGVG51N1hHT0tKZlUyUGNDRFVYbVJnIn0", // Using Clerk image URL
  }, */
];

async function fetchSystemUser() {
  return db.profile.upsert({
    where: { id: SYSTEM_USER_ID },
    update: {},
    create: {
      id: SYSTEM_USER_ID,
      userId: SYSTEM_USER_ID,
      name: SYSTEM_USER_NAME,
      imageUrl: SYSTEM_USER_IMAGE,
      email: SYSTEM_USER_EMAIL,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

async function fetchOrCreateSystemMember(
  systemUserId: string,
  serverId: string
) {
  const member = await db.member.findFirst({
    where: { profileId: systemUserId, serverId },
  });

  if (member) return member;

  return db.member.create({
    data: {
      id: uuidv4(),
      profileId: systemUserId,
      serverId,
      role: MemberRole.GUEST,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

export async function ensureSystemInUserServer(
  profile: Profile,
  server: Server
) {
  try {
    const systemUser = await fetchSystemUser();
    const systemMember = await fetchOrCreateSystemMember(
      systemUser.id,
      server.id
    );

    if (!systemMember) {
      throw new Error("Failed to fetch or create system member");
    }

    const generalChannel = await db.channel.findFirst({
      where: {
        serverId: server.id,
        name: "general",
      },
    });

    if (!generalChannel) {
      console.error("General channel not found in server:", server.id);
      return;
    }

    await createSystemMessage(generalChannel.id, {
      id: uuidv4(),
      content: `👋 Welcome to your new server, ${profile.name}!...`,
      channelId: generalChannel.id,
      memberId: systemUser.id,
      fileUrl: null,
      deleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: "system",
      member: {
        profile: systemUser,
      },
    });

    const systemChannel = await db.channel.findFirst({
      where: {
        serverId: server.id,
        name: "system",
      },
    });

    if (!systemChannel) {
      const newSystemChannel = await db.channel.create({
        data: {
          id: uuidv4(),
          name: "system",
          type: ChannelType.TEXT,
          profileId: systemUser.id,
          serverId: server.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      await createSystemMessage(newSystemChannel.id, {
        id: uuidv4(),
        content: `🔧 System Channel Created

This channel will be used for:
• System announcements and updates
• Moderation notifications
• Server status updates
• AI assistance and responses

You can customize system settings and permissions in the server settings.`,
        channelId: newSystemChannel.id,
        memberId: systemUser.id,
        fileUrl: null,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "system",
        member: {
          profile: systemUser,
        },
      });
    }

    return systemMember;
  } catch (error) {
    console.error("Error ensuring system in user server:", error);
    throw error;
  }
}

export async function ensureUserInDefaultServer(
  profile: Profile,
  server: Server
) {
  try {
    const defaultServer = await db.server.findFirst({
      where: { name: DEFAULT_SERVER_NAME },
      include: {
        channels: true,
      },
    });

    if (!defaultServer) {
      console.log("Default server not found");
      return null;
    }

    const existingMember = await db.member.findFirst({
      where: {
        serverId: defaultServer.id,
        profileId: profile.id,
      },
    });

    if (existingMember) {
      console.log("User already member of default server");
      return existingMember;
    }

    const newMember = await db.member.create({
      data: {
        id: uuidv4(),
        role: MemberRole.GUEST,
        profileId: profile.id,
        serverId: defaultServer.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const systemChannel = defaultServer.channels.find(
      (channel) => channel.name.toLowerCase() === DEFAULT_SYSTEM_CHANNEL
    );

    if (systemChannel) {
      const systemUser = await fetchSystemUser();
      await createSystemMessage(systemChannel.id, {
        id: uuidv4(),
        content: `Welcome ${profile.name} to the ${DEFAULT_SERVER_NAME} server! 👋\nFeel free to explore and ask questions.`,
        channelId: systemChannel.id,
        memberId: systemUser.id,
        fileUrl: null,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "system",
        member: {
          profile: systemUser,
        },
      });
    }

    return newMember;
  } catch (error) {
    console.error("Error ensuring user in default server:", error);
    return null;
  }
}

export async function ensureDefaultUsersInServer(server: Server) {
  try {
    for (const defaultUser of DEFAULT_USERS) {
      // Check if user profile exists
      const profile = await db.profile.upsert({
        where: { id: defaultUser.id },
        update: {},
        create: {
          id: defaultUser.id,
          userId: defaultUser.userId,
          name: defaultUser.name,
          email: defaultUser.email,
          imageUrl: defaultUser.imageUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Check if user is already a member
      const existingMember = await db.member.findFirst({
        where: {
          serverId: server.id,
          profileId: profile.id,
        },
      });

      if (!existingMember) {
        // Add user as member
        await db.member.create({
          data: {
            id: uuidv4(),
            profileId: profile.id,
            serverId: server.id,
            role: defaultUser.role,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        // Find general channel
        const generalChannel = await db.channel.findFirst({
          where: {
            serverId: server.id,
            name: "general",
          },
        });

        if (generalChannel) {
          const systemUser = await fetchSystemUser();
          await createSystemMessage(generalChannel.id, {
            id: uuidv4(),
            content: `👋 ${
              defaultUser.name
            } has been added as a ${defaultUser.role.toLowerCase()} to help manage this server.`,
            channelId: generalChannel.id,
            memberId: systemUser.id,
            fileUrl: null,
            deleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            role: "system",
            member: {
              profile: systemUser,
            },
          });
        }
      }
    }
  } catch (error) {
    console.error("Error ensuring default users in server:", error);
    throw error;
  }
}
