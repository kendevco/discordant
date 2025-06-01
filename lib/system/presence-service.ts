import { db } from "@/lib/db";
import { ActivityType, OnlineStatus } from "@prisma/client";
import { randomUUID } from "crypto";

export interface PresenceUser {
  id: string;
  profileId: string;
  name: string;
  imageUrl?: string;
  onlineStatus: OnlineStatus;
  lastSeen: Date;
  isOnline: boolean;
  serverId: string;
  currentChannel?: string;
}

export interface ActivityLog {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: Date;
  member?: {
    name: string;
    imageUrl?: string;
  };
  channel?: {
    name: string;
    id: string;
  };
  metadata?: any;
}

export interface RecentMessage {
  id: string;
  content: string;
  timestamp: Date;
  member: {
    name: string;
    imageUrl?: string;
  };
  channel: {
    name: string;
    id: string;
  };
  fileUrl?: string;
}

export class PresenceService {
  private static readonly HEARTBEAT_INTERVAL = 30000; // 30 seconds
  private static readonly OFFLINE_THRESHOLD = 60000; // 1 minute

  /**
   * Create or update user session when they connect
   */
  static async createSession(
    profileId: string, 
    sessionId: string, 
    serverId?: string,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
      channelId?: string;
    }
  ) {
    try {
      // Create new session
      const session = await db.userSession.create({
        data: {
          id: randomUUID(),
          profileId,
          sessionId,
          serverId,
          channelId: metadata?.channelId,
          ipAddress: metadata?.ipAddress,
          userAgent: metadata?.userAgent,
          isActive: true,
          lastActivity: new Date(),
          connectedAt: new Date(),
        },
      });

      // Update member online status if in a server
      if (serverId) {
        await this.updateMemberOnlineStatus(profileId, serverId, OnlineStatus.ONLINE, true);
        
        // Log member joined activity
        await this.logActivity({
          type: ActivityType.MEMBER_JOINED,
          serverId,
          memberId: await this.getMemberId(profileId, serverId),
          description: "Member joined the server",
          metadata: { sessionId },
        });
      }

      return session;
    } catch (error) {
      console.error("[PRESENCE_SERVICE] Error creating session:", error);
      throw error;
    }
  }

  /**
   * Update session activity and member presence
   */
  static async updateSession(
    sessionId: string, 
    activity?: {
      serverId?: string;
      channelId?: string;
      lastActivity?: Date;
    }
  ) {
    try {
      const session = await db.userSession.update({
        where: { sessionId },
        data: {
          lastActivity: activity?.lastActivity || new Date(),
          serverId: activity?.serverId,
          channelId: activity?.channelId,
        },
      });

      // Update member's last seen if in a server
      if (session.serverId) {
        await db.member.updateMany({
          where: {
            profileId: session.profileId,
            serverId: session.serverId,
          },
          data: {
            lastSeen: new Date(),
          },
        });
      }

      return session;
    } catch (error) {
      console.error("[PRESENCE_SERVICE] Error updating session:", error);
      throw error;
    }
  }

  /**
   * End user session when they disconnect
   */
  static async endSession(sessionId: string) {
    try {
      const session = await db.userSession.findUnique({
        where: { sessionId },
      });

      if (!session) return null;

      // Update session as inactive
      await db.userSession.update({
        where: { sessionId },
        data: {
          isActive: false,
          disconnectedAt: new Date(),
        },
      });

      // Check if user has other active sessions in this server
      if (session.serverId) {
        const activeSessions = await db.userSession.count({
          where: {
            profileId: session.profileId,
            isActive: true,
            serverId: session.serverId,
          },
        });

        // If no other active sessions, mark as offline
        if (activeSessions === 0) {
          await this.updateMemberOnlineStatus(
            session.profileId, 
            session.serverId, 
            OnlineStatus.OFFLINE, 
            false
          );

          // Log member left activity
          await this.logActivity({
            type: ActivityType.MEMBER_LEFT,
            serverId: session.serverId,
            memberId: await this.getMemberId(session.profileId, session.serverId),
            description: "Member left the server",
            metadata: { sessionId },
          });
        }
      }

      return session;
    } catch (error) {
      console.error("[PRESENCE_SERVICE] Error ending session:", error);
      throw error;
    }
  }

  /**
   * Update member's online status
   */
  static async updateMemberOnlineStatus(
    profileId: string,
    serverId: string,
    status: OnlineStatus,
    isOnline: boolean
  ) {
    try {
      await db.member.updateMany({
        where: {
          profileId,
          serverId,
        },
        data: {
          onlineStatus: status,
          isOnline,
          lastSeen: new Date(),
        },
      });
    } catch (error) {
      console.error("[PRESENCE_SERVICE] Error updating member status:", error);
      throw error;
    }
  }

  /**
   * Get online users for a server
   */
  static async getOnlineUsers(serverId: string): Promise<PresenceUser[]> {
    try {
      const onlineMembers = await db.member.findMany({
        where: {
          serverId,
          isOnline: true,
        },
        include: {
          profile: true,
        },
        orderBy: [
          { onlineStatus: 'asc' }, // ONLINE first, then AWAY, etc.
          { profile: { name: 'asc' } },
        ],
      });

      return onlineMembers.map(member => ({
        id: member.id,
        profileId: member.profileId,
        name: member.profile.name,
        imageUrl: member.profile.imageUrl || undefined,
        onlineStatus: member.onlineStatus,
        lastSeen: member.lastSeen,
        isOnline: member.isOnline,
        serverId: member.serverId,
      }));
    } catch (error) {
      console.error("[PRESENCE_SERVICE] Error getting online users:", error);
      return [];
    }
  }

  /**
   * Get recent activity for a server
   */
  static async getRecentActivity(serverId: string, limit: number = 20): Promise<ActivityLog[]> {
    try {
      const activities = await db.serverActivity.findMany({
        where: { serverId },
        include: {
          server: {
            include: {
              members: {
                where: {
                  id: { not: undefined }
                },
                include: {
                  profile: true,
                },
                take: 1,
              },
            },
          },
        },
        orderBy: { timestamp: 'desc' },
        take: limit,
      });

      return activities.map(activity => {
        const member = activity.server.members[0];
        return {
          id: activity.id,
          type: activity.activityType,
          description: activity.description,
          timestamp: activity.timestamp,
          member: member ? {
            name: member.profile.name,
            imageUrl: member.profile.imageUrl || undefined,
          } : undefined,
          metadata: activity.metadata ? JSON.parse(activity.metadata) : undefined,
        };
      });
    } catch (error) {
      console.error("[PRESENCE_SERVICE] Error getting recent activity:", error);
      return [];
    }
  }

  /**
   * Get recent messages across server
   */
  static async getRecentMessages(serverId: string, limit: number = 20): Promise<RecentMessage[]> {
    try {
      const messages = await db.message.findMany({
        where: {
          channel: { serverId },
          deleted: false,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
          channel: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      return messages.map(message => ({
        id: message.id,
        content: message.content,
        timestamp: message.createdAt,
        member: {
          name: message.member.profile.name,
          imageUrl: message.member.profile.imageUrl || undefined,
        },
        channel: {
          name: message.channel.name,
          id: message.channel.id,
        },
        fileUrl: message.fileUrl || undefined,
      }));
    } catch (error) {
      console.error("[PRESENCE_SERVICE] Error getting recent messages:", error);
      return [];
    }
  }

  /**
   * Log activity for tracking
   */
  static async logActivity(activity: {
    type: ActivityType;
    serverId?: string;
    channelId?: string;
    memberId?: string;
    description: string;
    metadata?: any;
  }) {
    try {
      const activityData = {
        id: randomUUID(),
        activityType: activity.type,
        description: activity.description,
        metadata: activity.metadata ? JSON.stringify(activity.metadata) : null,
        timestamp: new Date(),
      };

      // Log to server activity if serverId provided
      if (activity.serverId) {
        await db.serverActivity.create({
          data: {
            ...activityData,
            serverId: activity.serverId,
            memberId: activity.memberId,
            channelId: activity.channelId,
          },
        });
      }

      // Log to channel activity if channelId provided
      if (activity.channelId) {
        await db.channelActivity.create({
          data: {
            ...activityData,
            channelId: activity.channelId,
            memberId: activity.memberId,
          },
        });
      }

      // Log to member activity if memberId provided
      if (activity.memberId) {
        await db.memberActivity.create({
          data: {
            ...activityData,
            memberId: activity.memberId,
            serverId: activity.serverId,
            channelId: activity.channelId,
          },
        });
      }
    } catch (error) {
      console.error("[PRESENCE_SERVICE] Error logging activity:", error);
    }
  }

  /**
   * Clean up old sessions and update offline status
   */
  static async cleanupOldSessions() {
    try {
      const cutoffTime = new Date(Date.now() - this.OFFLINE_THRESHOLD);

      // Find sessions that haven't been active recently
      const staleSessions = await db.userSession.findMany({
        where: {
          isActive: true,
          lastActivity: {
            lt: cutoffTime,
          },
        },
      });

      // End stale sessions
      for (const session of staleSessions) {
        await this.endSession(session.sessionId);
      }

      // Clean up very old inactive sessions (older than 24 hours)
      const oldCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
      await db.userSession.deleteMany({
        where: {
          isActive: false,
          disconnectedAt: {
            lt: oldCutoff,
          },
        },
      });

      return staleSessions.length;
    } catch (error) {
      console.error("[PRESENCE_SERVICE] Error cleaning up sessions:", error);
      return 0;
    }
  }

  /**
   * Helper to get member ID from profile and server
   */
  private static async getMemberId(profileId: string, serverId: string): Promise<string | undefined> {
    try {
      const member = await db.member.findFirst({
        where: { profileId, serverId },
      });
      return member?.id;
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Get typing users for a channel
   */
  static async getTypingUsers(channelId: string): Promise<PresenceUser[]> {
    try {
      // Get recent typing activities (within last 10 seconds)
      const recentTyping = new Date(Date.now() - 10000);
      
      const typingActivities = await db.channelActivity.findMany({
        where: {
          channelId,
          activityType: ActivityType.TYPING_STARTED,
          timestamp: {
            gte: recentTyping,
          },
        },
        include: {
          channel: {
            include: {
              server: {
                include: {
                  members: {
                    include: {
                      profile: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { timestamp: 'desc' },
      });

      const typingUsers: PresenceUser[] = [];
      const seenMemberIds = new Set<string>();

      for (const activity of typingActivities) {
        if (activity.memberId && !seenMemberIds.has(activity.memberId)) {
          const member = activity.channel.server.members.find(m => m.id === activity.memberId);
          if (member) {
            typingUsers.push({
              id: member.id,
              profileId: member.profileId,
              name: member.profile.name,
              imageUrl: member.profile.imageUrl || undefined,
              onlineStatus: member.onlineStatus,
              lastSeen: member.lastSeen,
              isOnline: member.isOnline,
              serverId: member.serverId,
              currentChannel: channelId,
            });
            seenMemberIds.add(activity.memberId);
          }
        }
      }

      return typingUsers;
    } catch (error) {
      console.error("[PRESENCE_SERVICE] Error getting typing users:", error);
      return [];
    }
  }
} 