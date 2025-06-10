import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { generateApiToken } from "@/lib/api-auth";
import { ApiTokenType } from "@prisma/client";

interface CreateTokenRequest {
  name: string;
  type: ApiTokenType;
  serverId?: string;
  channelIds?: string[];
  permissions?: Record<string, any>;
  sourceOrigin?: string;
  webhookUrl?: string;
  metadata?: Record<string, any>;
  expiresAt?: string; // ISO date string
  rateLimit?: number;
  rateLimitWindow?: number;
}

export async function POST(req: NextRequest) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body: CreateTokenRequest = await req.json();

    // Validate required fields
    if (!body.name || !body.type) {
      return new NextResponse("name and type are required", { status: 400 });
    }

    // Validate server access if specified
    if (body.serverId) {
      const server = await db.server.findFirst({
        where: {
          id: body.serverId,
          members: {
            some: {
              profileId: profile.id,
              role: { in: ["ADMIN", "MODERATOR"] } // Only admins/mods can create tokens
            }
          }
        }
      });

      if (!server) {
        return new NextResponse("Server not found or insufficient permissions", { status: 404 });
      }
    }

    // Validate channel access if specified
    if (body.channelIds && body.channelIds.length > 0) {
      const accessibleChannels = await db.channel.findMany({
        where: {
          id: { in: body.channelIds },
          server: {
            members: {
              some: {
                profileId: profile.id
              }
            }
          }
        }
      });

      if (accessibleChannels.length !== body.channelIds.length) {
        return new NextResponse("Some channels are not accessible", { status: 400 });
      }
    }

    // Generate unique token
    let token = await generateApiToken();
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 5) {
      const existing = await db.apiToken.findUnique({
        where: { token }
      });
      
      if (!existing) {
        isUnique = true;
      } else {
        token = await generateApiToken();
        attempts++;
      }
    }

    if (!isUnique) {
      return new NextResponse("Failed to generate unique token", { status: 500 });
    }

    // Create API token
    const apiToken = await db.apiToken.create({
      data: {
        name: body.name,
        token: token,
        type: body.type,
        profileId: profile.id,
        serverId: body.serverId,
        channelIds: body.channelIds ? JSON.stringify(body.channelIds) : null,
        permissions: JSON.stringify(body.permissions || {}),
        sourceOrigin: body.sourceOrigin,
        webhookUrl: body.webhookUrl,
        metadata: body.metadata ? JSON.stringify(body.metadata) : null,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        rateLimit: body.rateLimit || 100,
        rateLimitWindow: body.rateLimitWindow || 3600,
        isActive: true,
        usageCount: 0
      }
    });

    return NextResponse.json({
      success: true,
      token: {
        id: apiToken.id,
        name: apiToken.name,
        token: apiToken.token, // Only return token on creation
        type: apiToken.type,
        serverId: apiToken.serverId,
        channelIds: apiToken.channelIds ? JSON.parse(apiToken.channelIds) : null,
        permissions: JSON.parse(apiToken.permissions),
        sourceOrigin: apiToken.sourceOrigin,
        webhookUrl: apiToken.webhookUrl,
        expiresAt: apiToken.expiresAt,
        rateLimit: apiToken.rateLimit,
        rateLimitWindow: apiToken.rateLimitWindow,
        isActive: apiToken.isActive,
        createdAt: apiToken.createdAt
      }
    });

  } catch (error) {
    console.error("[TOKENS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const tokenType = searchParams.get("type") as ApiTokenType;

    // Get tokens owned by this user
    const tokens = await db.apiToken.findMany({
      where: {
        profileId: profile.id,
        ...(serverId && { serverId }),
        ...(tokenType && { type: tokenType })
      },
      include: {
        agentProfile: {
          select: {
            agentType: true,
            displayName: true,
            isOnline: true,
            messageCount: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({
      success: true,
      tokens: tokens.map(token => ({
        id: token.id,
        name: token.name,
        // Don't return the actual token value for security
        type: token.type,
        serverId: token.serverId,
        channelIds: token.channelIds ? JSON.parse(token.channelIds) : null,
        permissions: JSON.parse(token.permissions),
        sourceOrigin: token.sourceOrigin,
        webhookUrl: token.webhookUrl,
        expiresAt: token.expiresAt,
        rateLimit: token.rateLimit,
        rateLimitWindow: token.rateLimitWindow,
        isActive: token.isActive,
        lastUsed: token.lastUsed,
        usageCount: token.usageCount,
        agentProfile: token.agentProfile,
        createdAt: token.createdAt,
        updatedAt: token.updatedAt
      }))
    });

  } catch (error) {
    console.error("[TOKENS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { tokenId, ...updates } = body;

    if (!tokenId) {
      return new NextResponse("tokenId is required", { status: 400 });
    }

    // Verify ownership
    const token = await db.apiToken.findFirst({
      where: {
        id: tokenId,
        profileId: profile.id
      }
    });

    if (!token) {
      return new NextResponse("Token not found or access denied", { status: 404 });
    }

    // Validate updates
    const allowedUpdates = [
      'name', 'isActive', 'permissions', 'sourceOrigin', 
      'webhookUrl', 'metadata', 'expiresAt', 'rateLimit', 'rateLimitWindow'
    ];

    const updateData: any = {};
    for (const [key, value] of Object.entries(updates)) {
      if (allowedUpdates.includes(key)) {
        if (key === 'permissions' || key === 'metadata') {
          updateData[key] = typeof value === 'object' ? JSON.stringify(value) : value;
        } else if (key === 'expiresAt') {
          updateData[key] = value ? new Date(value as string) : null;
        } else {
          updateData[key] = value;
        }
      }
    }

    updateData.updatedAt = new Date();

    await db.apiToken.update({
      where: { id: tokenId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      message: "Token updated successfully"
    });

  } catch (error) {
    console.error("[TOKENS_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const tokenId = searchParams.get("tokenId");

    if (!tokenId) {
      return new NextResponse("tokenId is required", { status: 400 });
    }

    // Verify ownership
    const token = await db.apiToken.findFirst({
      where: {
        id: tokenId,
        profileId: profile.id
      }
    });

    if (!token) {
      return new NextResponse("Token not found or access denied", { status: 404 });
    }

    // Delete token (cascade will handle cleanup)
    await db.apiToken.delete({
      where: { id: tokenId }
    });

    return NextResponse.json({
      success: true,
      message: "Token deleted successfully"
    });

  } catch (error) {
    console.error("[TOKENS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 