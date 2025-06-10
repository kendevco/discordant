import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticateApiRequest } from "@/lib/api-auth";
import { externalSocketService } from "@/lib/socket-service";

interface VisitorActivityRequest {
  sessionId: string;
  type: string;
  data: any;
  channelId?: string;
  conversationId?: string;
  visitorData?: {
    email?: string;
    name?: string;
    page?: string;
    metadata?: Record<string, any>;
  };
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

    const body: VisitorActivityRequest = await req.json();

    // Validate required fields
    if (!body.sessionId || !body.type) {
      return new NextResponse("sessionId and type are required", { status: 400 });
    }

    // Create or update visitor session
    const visitorSession = await db.visitorSession.upsert({
      where: { sessionId: body.sessionId },
      update: {
        lastActivity: new Date(),
        channelId: body.channelId,
        conversationId: body.conversationId,
        email: body.visitorData?.email,
        name: body.visitorData?.name,
        customData: body.visitorData?.metadata ? JSON.stringify(body.visitorData.metadata) : undefined,
        ...(body.type === 'widget-opened' && { pageViews: { increment: 1 } }),
        ...(body.type === 'message-sent' && { messagesCount: { increment: 1 } })
      },
      create: {
        sessionId: body.sessionId,
        email: body.visitorData?.email,
        name: body.visitorData?.name,
        origin: body.visitorData?.metadata?.origin || "unknown",
        ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
        userAgent: req.headers.get("user-agent"),
        referrer: req.headers.get("referer"),
        channelId: body.channelId,
        conversationId: body.conversationId,
        customData: body.visitorData?.metadata ? JSON.stringify(body.visitorData.metadata) : undefined,
        pageViews: body.type === 'widget-opened' ? 1 : 0,
        messagesCount: body.type === 'message-sent' ? 1 : 0,
        isActive: true
      }
    });

    // Emit visitor activity event
    externalSocketService.emitVisitorActivity(body.sessionId, {
      type: body.type,
      data: body.data,
      channelId: body.channelId,
      conversationId: body.conversationId
    });

    // Emit specific activity events based on type
    switch (body.type) {
      case 'widget-opened':
        externalSocketService.emitPortfolioNotification({
          type: 'system-alert',
          title: 'New Visitor',
          message: `Visitor opened chat widget on ${body.visitorData?.page || 'unknown page'}`,
          sessionId: body.sessionId,
          channelId: body.channelId,
          metadata: {
            activityType: 'widget-opened',
            visitorData: body.visitorData
          }
        });
        break;

      case 'message-sent':
        // This will be handled by the message API
        break;

      case 'widget-minimized':
        // Track engagement patterns
        break;

      case 'widget-closed':
        await db.visitorSession.update({
          where: { sessionId: body.sessionId },
          data: { isActive: false }
        });
        break;
    }

    return NextResponse.json({
      success: true,
      sessionId: body.sessionId,
      activityTracked: true,
      visitorSessionId: visitorSession.id
    });

  } catch (error) {
    console.error("[VISITOR_ACTIVITY_POST]", error);
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

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const channelId = searchParams.get("channelId");
    const isActive = searchParams.get("active") === "true";

    // Build query
    const where: any = {};
    if (sessionId) where.sessionId = sessionId;
    if (channelId) where.channelId = channelId;
    if (isActive !== undefined) where.isActive = isActive;

    const visitorSessions = await db.visitorSession.findMany({
      where,
      orderBy: { lastActivity: "desc" },
      take: 50
    });

    return NextResponse.json({
      success: true,
      visitorSessions: visitorSessions.map(session => ({
        id: session.id,
        sessionId: session.sessionId,
        email: session.email,
        name: session.name,
        origin: session.origin,
        channelId: session.channelId,
        conversationId: session.conversationId,
        pageViews: session.pageViews,
        messagesCount: session.messagesCount,
        isActive: session.isActive,
        lastActivity: session.lastActivity,
        createdAt: session.createdAt,
        customData: session.customData ? JSON.parse(session.customData) : null
      }))
    });

  } catch (error) {
    console.error("[VISITOR_ACTIVITY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 