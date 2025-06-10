import { db } from "@/lib/db";
import { ApiToken, AgentProfile, Profile } from "@prisma/client";
import { NextRequest } from "next/server";
import { currentProfile } from "@/lib/current-profile";

export interface ApiAuthResult {
  success: boolean;
  token?: ApiToken & {
    profile: Profile;
    agentProfile?: AgentProfile;
  };
  error?: string;
  statusCode?: number;
}

/**
 * Authenticate API request using Bearer token or API key
 */
export async function authenticateApiRequest(req: NextRequest): Promise<ApiAuthResult> {
  try {
    // Try Bearer token first
    const authHeader = req.headers.get("authorization");
    let tokenValue: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      tokenValue = authHeader.substring(7);
    } else {
      // Try API key header
      tokenValue = req.headers.get("x-api-key");
    }

    if (!tokenValue) {
      return {
        success: false,
        error: "Missing API token. Provide via Authorization: Bearer <token> or X-API-Key header",
        statusCode: 401
      };
    }

    // Find and validate token
    const token = await db.apiToken.findUnique({
      where: { 
        token: tokenValue,
        isActive: true 
      },
      include: {
        profile: true,
        agentProfile: true
      }
    });

    if (!token) {
      return {
        success: false,
        error: "Invalid or inactive API token",
        statusCode: 401
      };
    }

    // Check expiration
    if (token.expiresAt && token.expiresAt < new Date()) {
      return {
        success: false,
        error: "API token has expired",
        statusCode: 401
      };
    }

    // Rate limiting check
    const rateLimitResult = await checkRateLimit(token);
    if (!rateLimitResult.allowed) {
      return {
        success: false,
        error: `Rate limit exceeded. ${rateLimitResult.remaining} requests remaining. Reset in ${rateLimitResult.resetTime}s`,
        statusCode: 429
      };
    }

    // Update usage statistics
    await updateTokenUsage(token.id);

    return {
      success: true,
      token: {
        ...token,
        agentProfile: token.agentProfile || undefined
      }
    };

  } catch (error) {
    console.error("[API_AUTH_ERROR]", error);
    return {
      success: false,
      error: "Authentication failed",
      statusCode: 500
    };
  }
}

/**
 * Authenticate with fallback to regular user authentication
 */
export async function authenticateWithFallback(req: NextRequest): Promise<{
  success: boolean;
  profile?: Profile;
  apiToken?: ApiToken;
  isApiRequest: boolean;
  error?: string;
  statusCode?: number;
}> {
  // Try API authentication first
  const apiResult = await authenticateApiRequest(req);
  
  if (apiResult.success && apiResult.token) {
    return {
      success: true,
      profile: apiResult.token.profile,
      apiToken: apiResult.token,
      isApiRequest: true
    };
  }

  // Fall back to regular Clerk authentication
  try {
    const profile = await currentProfile();
    if (profile) {
      return {
        success: true,
        profile,
        isApiRequest: false
      };
    }

    return {
      success: false,
      error: "No valid authentication found",
      statusCode: 401,
      isApiRequest: false
    };
  } catch (error) {
    return {
      success: false,
      error: "Authentication failed",
      statusCode: 500,
      isApiRequest: false
    };
  }
}

/**
 * Rate limiting for API tokens
 */
async function checkRateLimit(token: ApiToken): Promise<{
  allowed: boolean;
  remaining: number;
  resetTime: number;
}> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - (token.rateLimitWindow * 1000));

  // Get recent usage count
  const recentUsage = await db.externalMessage.count({
    where: {
      apiTokenId: token.id,
      createdAt: {
        gte: windowStart
      }
    }
  });

  const remaining = Math.max(0, token.rateLimit - recentUsage);
  const resetTime = token.rateLimitWindow - Math.floor((now.getTime() - windowStart.getTime()) / 1000);

  return {
    allowed: recentUsage < token.rateLimit,
    remaining,
    resetTime: Math.max(0, resetTime)
  };
}

/**
 * Update token usage statistics
 */
async function updateTokenUsage(tokenId: string) {
  await db.apiToken.update({
    where: { id: tokenId },
    data: {
      usageCount: { increment: 1 },
      lastUsed: new Date()
    }
  });
}

/**
 * Validate channel access for API token
 */
export async function validateChannelAccess(
  token: ApiToken,
  channelId: string
): Promise<boolean> {
  try {
    // If no channel restrictions, allow all channels the user has access to
    if (!token.channelIds) {
      const channel = await db.channel.findFirst({
        where: {
          id: channelId,
          server: {
            members: {
              some: {
                profileId: token.profileId
              }
            }
          }
        }
      });
      return !!channel;
    }

    // Check specific channel allowlist
    const allowedChannels = JSON.parse(token.channelIds) as string[];
    return allowedChannels.includes(channelId);
  } catch (error) {
    console.error("[CHANNEL_ACCESS_ERROR]", error);
    return false;
  }
}

/**
 * Validate server access for API token
 */
export async function validateServerAccess(
  token: ApiToken,
  serverId: string
): Promise<boolean> {
  try {
    // If token is scoped to specific server
    if (token.serverId && token.serverId !== serverId) {
      return false;
    }

    // Check if user is member of the server
    const member = await db.member.findFirst({
      where: {
        profileId: token.profileId,
        serverId: serverId
      }
    });

    return !!member;
  } catch (error) {
    console.error("[SERVER_ACCESS_ERROR]", error);
    return false;
  }
}

/**
 * Get or create agent profile for API token
 */
export async function getOrCreateAgentProfile(
  token: ApiToken,
  agentData?: {
    displayName?: string;
    avatarUrl?: string;
    description?: string;
  }
): Promise<AgentProfile | null> {
  try {
    // Check if agent profile exists
    let agentProfile = await db.agentProfile.findUnique({
      where: { apiTokenId: token.id }
    });

    if (!agentProfile && agentData) {
      // Create new agent profile
      agentProfile = await db.agentProfile.create({
        data: {
          profileId: token.profileId,
          apiTokenId: token.id,
          agentType: "EXTERNAL_SERVICE", // Default type
          displayName: agentData.displayName || "External Agent",
          avatarUrl: agentData.avatarUrl,
          description: agentData.description,
          isOnline: true,
          lastActive: new Date()
        }
      });
    }

    return agentProfile;
  } catch (error) {
    console.error("[AGENT_PROFILE_ERROR]", error);
    return null;
  }
}

/**
 * Generate new API token
 */
export async function generateApiToken(): Promise<string> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const prefix = 'disc_';
  let token = prefix;
  
  for (let i = 0; i < 48; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return token;
} 