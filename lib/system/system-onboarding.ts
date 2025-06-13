import { Profile, Server, ChannelType, MemberRole, OnlineStatus, UserRole } from "@prisma/client";
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
    update: {
      // Update system user info if needed
      name: SYSTEM_USER_NAME,
      imageUrl: SYSTEM_USER_IMAGE,
      email: SYSTEM_USER_EMAIL,
      updatedAt: new Date(),
    },
    create: {
      id: SYSTEM_USER_ID,
      userId: SYSTEM_USER_ID,
      name: SYSTEM_USER_NAME,
      imageUrl: SYSTEM_USER_IMAGE,
      email: SYSTEM_USER_EMAIL,
      role: UserRole.ADMIN, // System user gets admin role
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

  if (member) {
    // Update existing member with complete data
    return db.member.update({
      where: { id: member.id },
      data: {
        role: MemberRole.GUEST,
        onlineStatus: OnlineStatus.ONLINE,
        lastSeen: new Date(),
        isOnline: true,
        updatedAt: new Date(),
      },
    });
  }

  // Create new system member with complete touchpoints
  const newMember = await db.member.create({
    data: {
      id: uuidv4(),
      profileId: systemUserId,
      serverId,
      role: MemberRole.GUEST,
      onlineStatus: OnlineStatus.ONLINE,
      lastSeen: new Date(),
      isOnline: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create initial member activity for system user joining
  try {
    await db.memberActivity.create({
      data: {
        id: uuidv4(),
        memberId: newMember.id,
        serverId: serverId,
        activityType: 'MEMBER_JOINED',
        description: `${SYSTEM_USER_NAME} joined the server`,
        timestamp: new Date(),
        metadata: JSON.stringify({
          systemUser: true,
          serverJoin: true,
          automated: true,
        }),
      },
    });
  } catch (error) {
    console.error("Failed to create system member activity:", error);
    // Don't fail if activity creation fails
  }

  // Create user session for system presence
  try {
    await db.userSession.create({
      data: {
        id: uuidv4(),
        profileId: systemUserId,
        sessionId: `system-${Date.now()}-${uuidv4().substring(0, 8)}`,
        serverId: serverId,
        isActive: true,
        lastActivity: new Date(),
        connectedAt: new Date(),
        ipAddress: null,
        userAgent: 'Discordant System Bot',
      },
    });
  } catch (error) {
    console.error("Failed to create system session:", error);
    // Don't fail if session creation fails
  }

  return newMember;
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

    // Ensure the user who created the server has all touchpoints
    const userMember = await db.member.findFirst({
      where: {
        profileId: profile.id,
        serverId: server.id,
      },
    });

    if (userMember) {
      // Update member with complete presence data if missing
      await db.member.update({
        where: { id: userMember.id },
        data: {
          onlineStatus: OnlineStatus.ONLINE,
          lastSeen: new Date(),
          isOnline: true,
          updatedAt: new Date(),
        },
      });

      // Create member activity record for server creation
      try {
        await db.memberActivity.create({
          data: {
            id: uuidv4(),
            memberId: userMember.id,
            serverId: server.id,
            activityType: 'MEMBER_JOINED',
            description: `${profile.name} created and joined the server "${server.name}"`,
            timestamp: new Date(),
            metadata: JSON.stringify({
              serverCreation: true,
              serverId: server.id,
              serverName: server.name,
              isOwner: true,
            }),
          },
        });
      } catch (activityError) {
        console.error("Failed to create server creation activity:", activityError);
        // Don't fail if activity creation fails
      }

      // Create user session for presence tracking
      try {
        await db.userSession.create({
          data: {
            id: uuidv4(),
            profileId: profile.id,
            sessionId: `server-creation-${Date.now()}-${uuidv4().substring(0, 8)}`,
            serverId: server.id,
            isActive: true,
            lastActivity: new Date(),
            connectedAt: new Date(),
            ipAddress: null,
            userAgent: 'Server Creation Process',
          },
        });
      } catch (sessionError) {
        console.error("Failed to create server creation session:", sessionError);
        // Don't fail if session creation fails
      }

      // Note: UserActivity model doesn't exist in current schema
      // This feature can be added later when the model is implemented
      console.log(`Server creation activity logged for ${profile.name}`);
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

    // Enhanced welcome message for new server
    const welcomeMessage = `🎉 **Welcome to your new server, ${profile.name}!**

🏠 **Server Setup Complete**
Your "${server.name}" server is ready to go! Here's what I've set up for you:

🤖 **AI Assistant Integration**
• I'm your dedicated AI assistant for this server
• Ask me anything about calendar management, research, or general assistance
• I can help with scheduling, finding information, and business intelligence

📅 **Calendar Features**
• View and manage your calendar events
• Schedule meetings with team members
• Check availability and resolve conflicts

🔍 **Smart Search**
• Find messages and conversations across channels
• Search for files and documents
• Get intelligent summaries of discussions

🌐 **Research Capabilities**
• Get real-time market data and company intelligence
• Research competitors and industry trends
• Analyze business opportunities

💡 **Getting Started**
Try asking me:
• "What meetings do I have today?"
• "Research Tesla's latest news"
• "Find messages about our project timeline"

Ready to transform your workflow with AI assistance! 🚀`;

    await createSystemMessage(generalChannel.id, {
      id: uuidv4(),
      content: welcomeMessage,
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
      asIs: true, // Important: This bypasses workflow routing for onboarding
    });

    // Create system channel if it doesn't exist
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

      const systemChannelMessage = `🔧 **System Channel Created**

This dedicated system channel will be used for:

🛠️ **Administrative Functions**
• System announcements and updates
• Server configuration changes
• Moderation and security notifications

🤖 **AI Assistant Management**
• Monitor AI assistant performance
• Review conversation analytics
• Configure AI behavior and preferences

📊 **Analytics & Monitoring**
• Server activity reports
• User engagement metrics
• Performance insights

🔐 **Security & Compliance**
• Audit logs and security events
• Data privacy notifications
• Compliance reporting

You can customize system settings and permissions in the server settings panel.

**Tip:** Use this channel to communicate directly with the AI system about server management needs!`;

      await createSystemMessage(newSystemChannel.id, {
        id: uuidv4(),
        content: systemChannelMessage,
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
        asIs: true, // Important: This bypasses workflow routing for onboarding
      });

      // Log system channel creation activity
      if (userMember) {
        try {
          await db.memberActivity.create({
            data: {
              id: uuidv4(),
              memberId: userMember.id,
              serverId: server.id,
              activityType: 'CHANNEL_JOINED',
              description: `System channel joined in "${server.name}"`,
              timestamp: new Date(),
              metadata: JSON.stringify({
                channelId: newSystemChannel.id,
                channelName: 'system',
                autoCreated: true,
              }),
            },
          });
        } catch (activityError) {
          console.error("Failed to create system channel activity:", activityError);
        }
      }
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
      const defaultServerWelcome = `🎊 **Welcome ${profile.name} to the ${DEFAULT_SERVER_NAME} server!**

🌟 **You've joined the main community hub**
This is Kenneth's primary development and AI testing server where we explore cutting-edge technology.

🤖 **AI-Powered Environment**
• Full business intelligence assistant available
• Real-time calendar and scheduling integration
• Advanced search and research capabilities
• Collaborative AI workflows

🚀 **What's Available**
• Live development discussions
• AI assistant testing and feedback
• Technology research and insights
• Business intelligence demos

💬 **Getting Started**
Feel free to explore, ask questions, and test the AI capabilities. Try commands like:
• "What's Kenneth working on today?"
• "Research the latest in AI development"
• "Help me understand this codebase"

Welcome to the future of AI-integrated development! 🔥`;

      await createSystemMessage(systemChannel.id, {
        id: uuidv4(),
        content: defaultServerWelcome,
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
        asIs: true, // Important: This bypasses workflow routing for onboarding
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
          const adminJoinMessage = `👨‍💼 **${defaultUser.name} has joined as ${defaultUser.role.toLowerCase()}**

🛡️ **Administrative Access Granted**
${defaultUser.name} now has ${defaultUser.role.toLowerCase()} privileges to help manage this server and provide technical expertise.

🤖 **AI Collaboration**
They can work directly with the AI assistant for:
• Server configuration and optimization
• Advanced workflow development
• Business intelligence implementation
• Technical problem-solving

Welcome to the team! 🎯`;

          await createSystemMessage(generalChannel.id, {
            id: uuidv4(),
            content: adminJoinMessage,
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
            asIs: true, // Important: This bypasses workflow routing for onboarding
          });
        }
      }
    }
  } catch (error) {
    console.error("Error ensuring default users in server:", error);
    throw error;
  }
}
