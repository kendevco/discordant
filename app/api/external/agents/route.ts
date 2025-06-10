import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticateApiRequest } from "@/lib/api-auth";
import { generateUsernameFromEmail } from "@/lib/utils/username-generator";
import { AgentType } from "@prisma/client";
import { randomUUID } from "crypto";

interface CreateAgentRequest {
  agentType: AgentType;
  displayName: string;
  email: string;
  avatarUrl?: string;
  description?: string;
  canImpersonate?: boolean;
  canCreateUsers?: boolean;
  systemBot?: boolean;
  sourceConfig?: Record<string, any>;
  responseConfig?: Record<string, any>;
}

export async function POST(req: NextRequest) {
  try {
    // Authenticate API request
    const authResult = await authenticateApiRequest(req);
    if (!authResult.success || !authResult.token) {
      return new NextResponse(authResult.error, { 
        status: authResult.statusCode || 401 
      });
    }

    const token = authResult.token;
    const body: CreateAgentRequest = await req.json();

    // Validate required fields
    if (!body.agentType || !body.displayName || !body.email) {
      return new NextResponse("agentType, displayName, and email are required", { status: 400 });
    }

    // Check if this token can create agents
    const permissions = token.permissions ? JSON.parse(token.permissions) : {};
    if (!permissions.canCreateAgents && !token.agentProfile?.canCreateUsers) {
      return new NextResponse("Token does not have agent creation permissions", { status: 403 });
    }

    // Check if agent already exists
    const existingProfile = await db.profile.findFirst({
      where: {
        email: body.email
      }
    });

    if (existingProfile) {
      return new NextResponse("Agent with this email already exists", { status: 409 });
    }

    // Generate unique username for agent
    const username = await generateUsernameFromEmail(body.email, db);
    const profileId = randomUUID();

    // Create agent profile
    const agentProfile = await db.profile.create({
      data: {
        id: profileId,
        userId: profileId, // For agents, userId = id
        name: username,
        email: body.email,
        imageUrl: body.avatarUrl || generateDefaultAgentAvatar(body.agentType),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // Create agent metadata
    const agentMeta = await db.agentProfile.create({
      data: {
        profileId: agentProfile.id,
        apiTokenId: token.id,
        agentType: body.agentType,
        displayName: body.displayName,
        avatarUrl: body.avatarUrl,
        description: body.description,
        canImpersonate: body.canImpersonate || false,
        canCreateUsers: body.canCreateUsers || false,
        systemBot: body.systemBot || false,
        sourceConfig: body.sourceConfig ? JSON.stringify(body.sourceConfig) : null,
        responseConfig: body.responseConfig ? JSON.stringify(body.responseConfig) : null,
        isOnline: true,
        lastActive: new Date(),
        messageCount: 0
      }
    });

    return NextResponse.json({
      success: true,
      agent: {
        id: agentProfile.id,
        userId: agentProfile.userId,
        name: agentProfile.name,
        email: agentProfile.email,
        imageUrl: agentProfile.imageUrl,
        agentType: agentMeta.agentType,
        displayName: agentMeta.displayName,
        description: agentMeta.description,
        capabilities: {
          canImpersonate: agentMeta.canImpersonate,
          canCreateUsers: agentMeta.canCreateUsers,
          systemBot: agentMeta.systemBot
        },
        createdAt: agentProfile.createdAt
      }
    });

  } catch (error) {
    console.error("[AGENTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Authenticate API request
    const authResult = await authenticateApiRequest(req);
    if (!authResult.success || !authResult.token) {
      return new NextResponse(authResult.error, { 
        status: authResult.statusCode || 401 
      });
    }

    const token = authResult.token;
    const { searchParams } = new URL(req.url);
    const agentType = searchParams.get("agentType") as AgentType;

    // Get agents created by this token
    const agents = await db.agentProfile.findMany({
      where: {
        apiTokenId: token.id,
        ...(agentType && { agentType })
      },
      include: {
        profile: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({
      success: true,
      agents: agents.map(agent => ({
        id: agent.profile.id,
        userId: agent.profile.userId,
        name: agent.profile.name,
        email: agent.profile.email,
        imageUrl: agent.profile.imageUrl,
        agentType: agent.agentType,
        displayName: agent.displayName,
        description: agent.description,
        capabilities: {
          canImpersonate: agent.canImpersonate,
          canCreateUsers: agent.canCreateUsers,
          systemBot: agent.systemBot
        },
        activity: {
          isOnline: agent.isOnline,
          lastActive: agent.lastActive,
          messageCount: agent.messageCount
        },
        createdAt: agent.createdAt
      }))
    });

  } catch (error) {
    console.error("[AGENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Authenticate API request
    const authResult = await authenticateApiRequest(req);
    if (!authResult.success || !authResult.token) {
      return new NextResponse(authResult.error, { 
        status: authResult.statusCode || 401 
      });
    }

    const token = authResult.token;
    const body = await req.json();
    const { agentId, ...updates } = body;

    if (!agentId) {
      return new NextResponse("agentId is required", { status: 400 });
    }

    // Verify ownership
    const agent = await db.agentProfile.findFirst({
      where: {
        profileId: agentId,
        apiTokenId: token.id
      },
      include: {
        profile: true
      }
    });

    if (!agent) {
      return new NextResponse("Agent not found or access denied", { status: 404 });
    }

    // Update profile if needed
    const profileUpdates: any = {};
    if (updates.name) profileUpdates.name = updates.name;
    if (updates.email) profileUpdates.email = updates.email;
    if (updates.imageUrl) profileUpdates.imageUrl = updates.imageUrl;

    if (Object.keys(profileUpdates).length > 0) {
      await db.profile.update({
        where: { id: agentId },
        data: {
          ...profileUpdates,
          updatedAt: new Date()
        }
      });
    }

    // Update agent metadata
    const agentUpdates: any = {};
    if (updates.displayName) agentUpdates.displayName = updates.displayName;
    if (updates.description !== undefined) agentUpdates.description = updates.description;
    if (updates.avatarUrl !== undefined) agentUpdates.avatarUrl = updates.avatarUrl;
    if (updates.canImpersonate !== undefined) agentUpdates.canImpersonate = updates.canImpersonate;
    if (updates.canCreateUsers !== undefined) agentUpdates.canCreateUsers = updates.canCreateUsers;
    if (updates.systemBot !== undefined) agentUpdates.systemBot = updates.systemBot;
    if (updates.sourceConfig) agentUpdates.sourceConfig = JSON.stringify(updates.sourceConfig);
    if (updates.responseConfig) agentUpdates.responseConfig = JSON.stringify(updates.responseConfig);

    if (Object.keys(agentUpdates).length > 0) {
      await db.agentProfile.update({
        where: { profileId: agentId },
        data: {
          ...agentUpdates,
          updatedAt: new Date()
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: "Agent updated successfully"
    });

  } catch (error) {
    console.error("[AGENTS_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Authenticate API request
    const authResult = await authenticateApiRequest(req);
    if (!authResult.success || !authResult.token) {
      return new NextResponse(authResult.error, { 
        status: authResult.statusCode || 401 
      });
    }

    const token = authResult.token;
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get("agentId");

    if (!agentId) {
      return new NextResponse("agentId is required", { status: 400 });
    }

    // Verify ownership
    const agent = await db.agentProfile.findFirst({
      where: {
        profileId: agentId,
        apiTokenId: token.id
      }
    });

    if (!agent) {
      return new NextResponse("Agent not found or access denied", { status: 404 });
    }

    // Delete agent (cascade will handle cleanup)
    await db.profile.delete({
      where: { id: agentId }
    });

    return NextResponse.json({
      success: true,
      message: "Agent deleted successfully"
    });

  } catch (error) {
    console.error("[AGENTS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

function generateDefaultAgentAvatar(agentType: AgentType): string {
  const avatars = {
    AI_ASSISTANT: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=ai-assistant&backgroundColor=4F46E5",
    VAPI_TRANSCRIBER: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=vapi-transcriber&backgroundColor=059669",
    SYSTEM_NOTIFIER: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=system-notifier&backgroundColor=DC2626",
    PORTFOLIO_VISITOR: "https://api.dicebear.com/7.x/avataaars/svg?seed=visitor&backgroundColor=6B7280",
    WORKFLOW_RESPONDER: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=workflow&backgroundColor=7C3AED",
    EXTERNAL_SERVICE: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=external&backgroundColor=0891B2"
  };

  return avatars[agentType] || avatars.EXTERNAL_SERVICE;
} 