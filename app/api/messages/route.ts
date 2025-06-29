// /app/api/messages/route.ts
  
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 50;

export async function GET(req: Request) {
  try {
    console.log('[MESSAGES_GET] Request started:', {
      url: req.url,
      timestamp: new Date().toISOString()
    });

    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");
    
    console.log('[MESSAGES_GET] Request params:', {
      profileId: profile?.id,
      channelId,
      cursor: cursor ? cursor.substring(0, 8) + '...' : null
    });
    
    if (!profile) {
      console.error('[MESSAGES_GET] No profile found - user not authenticated');
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!channelId) {
      console.error('[MESSAGES_GET] No channelId provided in request');
      return new NextResponse("Channel ID missing", { status: 400 });
    }
    
    // Validate channelId format (UUID format)
    if (!/^[a-f0-9-]{36}$/.test(channelId)) {
      console.error('[MESSAGES_GET] Invalid channelId format:', channelId);
      return new NextResponse("Invalid channel ID format", { status: 400 });
    }

    // Check if user has access to this channel
    console.log('[MESSAGES_GET] Checking channel access...');
    const channel = await db.channel.findFirst({
      where: {
        id: channelId,
        server: {
          members: {
            some: {
              profileId: profile.id
            }
          }
        }
      },
      include: {
        server: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!channel) {
      console.error('[MESSAGES_GET] Channel not found or user has no access:', {
        channelId,
        profileId: profile.id
      });
      return new NextResponse("Channel not found or access denied", { status: 404 });
    }

    console.log('[MESSAGES_GET] Channel access confirmed:', {
      channelId: channel.id,
      serverId: channel.server.id,
      serverName: channel.server.name
    });

    // Use raw query to avoid Prisma include issues with null relationships
    let messages;
    
    try {
      if (cursor) {
        // Validate cursor format - should be a UUID (message ID)
        if (!/^[a-f0-9-]{36}$/.test(cursor)) {
          console.error('[MESSAGES_GET] Invalid cursor format:', cursor);
          return new NextResponse("Invalid cursor format", { status: 400 });
        }
        
        console.log('[MESSAGES_GET] Fetching messages with cursor...');
        messages = await db.$queryRaw`
          SELECT 
            m.id,
            m.content,
            m.fileUrl,
            m.memberId,
            m.role,
            m.createdAt,
            m.updatedAt,
            m.channelId,
            COALESCE(p.id, 'ai-assistant-bot') as profileId,
            COALESCE(p.name, 'AI Assistant') as profileName,
            COALESCE(p.imageUrl, '/ai-avatar.png') as profileImageUrl,
            COALESCE(mb.id, 'ai-assistant-bot') as memberIdResolved
          FROM message m
          LEFT JOIN member mb ON m.memberId = mb.id
          LEFT JOIN profile p ON mb.profileId = p.id
          WHERE m.channelId = ${channelId}
          AND m.createdAt < (
            SELECT createdAt FROM message WHERE id = ${cursor}
          )
          ORDER BY m.createdAt DESC
          LIMIT ${MESSAGES_BATCH}
        `;
      } else {
        console.log('[MESSAGES_GET] Fetching initial messages...');
        messages = await db.$queryRaw`
          SELECT 
            m.id,
            m.content,
            m.fileUrl,
            m.memberId,
            m.role,
            m.createdAt,
            m.updatedAt,
            m.channelId,
            COALESCE(p.id, 'ai-assistant-bot') as profileId,
            COALESCE(p.name, 'AI Assistant') as profileName,
            COALESCE(p.imageUrl, '/ai-avatar.png') as profileImageUrl,
            COALESCE(mb.id, 'ai-assistant-bot') as memberIdResolved
          FROM message m
          LEFT JOIN member mb ON m.memberId = mb.id
          LEFT JOIN profile p ON mb.profileId = p.id
          WHERE m.channelId = ${channelId}
          ORDER BY m.createdAt DESC
          LIMIT ${MESSAGES_BATCH}
        `;
      }
      
      console.log('[MESSAGES_GET] Database query completed, messages found:', Array.isArray(messages) ? messages.length : 0);
      
    } catch (dbError) {
      console.error("[MESSAGES_GET] Database error:", dbError);
      return new NextResponse("Database error", { status: 500 });
    }
    
    // Ensure messages is an array and handle null/undefined cases
    const messageArray = Array.isArray(messages) ? messages : [];
    
    // Transform the raw query results to match expected format with proper null handling
    const processedMessages = messageArray.map(msg => {
      // Ensure all required fields exist and are properly typed
      if (!msg || typeof msg !== 'object') {
        console.warn("[MESSAGES_GET] Invalid message object:", msg);
        return null;
      }

      return {
        id: String(msg.id || ''),
        content: String(msg.content || ''),
        fileUrl: msg.fileUrl ? String(msg.fileUrl) : null,
        memberId: msg.memberId ? String(msg.memberId) : null,
        role: String(msg.role || 'user'),
        createdAt: msg.createdAt instanceof Date ? msg.createdAt : new Date(msg.createdAt),
        updatedAt: msg.updatedAt instanceof Date ? msg.updatedAt : new Date(msg.updatedAt),
        channelId: String(msg.channelId || channelId),
        deleted: false, // Add missing deleted field
        member: {
          id: String(msg.memberIdResolved || 'ai-assistant-bot'),
          profile: {
            id: String(msg.profileId || 'ai-assistant-bot'),
            name: String(msg.profileName || 'AI Assistant'),
            imageUrl: String(msg.profileImageUrl || '/ai-avatar.png')
          }
        }
      };
    }).filter(Boolean); // Remove any null entries
    
    let nextCursor = null;
    if (processedMessages.length === MESSAGES_BATCH) {
      nextCursor = processedMessages[MESSAGES_BATCH - 1]?.id || null;
    }
    
    // Ensure we return a valid response with proper structure
    const response = { 
      items: processedMessages || [], 
      nextCursor: nextCursor
    };
    
    console.log('[MESSAGES_GET] Response prepared:', {
      messageCount: processedMessages.length,
      hasNextCursor: !!nextCursor,
      processingTime: Date.now() - new Date().getTime()
    });
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error("[MESSAGES_GET] Error details:", {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      channelId: new URL(req.url).searchParams.get("channelId"),
      cursor: new URL(req.url).searchParams.get("cursor"),
      timestamp: new Date().toISOString()
    });
    
    // Return a proper error response that won't cause payload issues
    return NextResponse.json(
      { error: "Internal server error", items: [], nextCursor: null }, 
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    console.log('[MESSAGES_POST] Request started:', {
      url: req.url,
      timestamp: new Date().toISOString()
    });

    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const body = await req.json();
    
    const channelId = searchParams.get("channelId");
    const serverId = searchParams.get("serverId");
    const { content, fileUrl } = body;

    console.log('[MESSAGES_POST] Request params:', {
      profileId: profile?.id,
      channelId,
      serverId,
      hasContent: !!content,
      hasFileUrl: !!fileUrl
    });

    if (!profile) {
      console.error('[MESSAGES_POST] No profile found - user not authenticated');
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!channelId) {
      console.error('[MESSAGES_POST] No channelId provided in request');
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    if (!serverId) {
      console.error('[MESSAGES_POST] No serverId provided in request');
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!content && !fileUrl) {
      console.error('[MESSAGES_POST] No content or file provided');
      return new NextResponse("Content or file required", { status: 400 });
    }

    // Validate IDs format (UUID format)
    if (!/^[a-f0-9-]{36}$/.test(channelId) || !/^[a-f0-9-]{36}$/.test(serverId)) {
      console.error('[MESSAGES_POST] Invalid ID format:', { channelId, serverId });
      return new NextResponse("Invalid ID format", { status: 400 });
    }

    // Check if user is a member of the server and has access to the channel
    console.log('[MESSAGES_POST] Checking member access...');
    const member = await db.member.findFirst({
      where: {
        profileId: profile.id,
        serverId: serverId,
      },
    });

    if (!member) {
      console.error('[MESSAGES_POST] User is not a member of the server:', {
        profileId: profile.id,
        serverId
      });
      return new NextResponse("Not a member of this server", { status: 403 });
    }

    // Verify channel exists and belongs to the server
    const channel = await db.channel.findFirst({
      where: {
        id: channelId,
        serverId: serverId,
      },
    });

    if (!channel) {
      console.error('[MESSAGES_POST] Channel not found or does not belong to server:', {
        channelId,
        serverId
      });
      return new NextResponse("Channel not found", { status: 404 });
    }

    console.log('[MESSAGES_POST] Access verified, creating message...');

    // Create the message
    const message = await db.message.create({
      data: {
        id: require('crypto').randomUUID(),
        content: content || "",
        fileUrl: fileUrl || null,
        channelId: channelId,
        memberId: member.id,
        role: "user",
        updatedAt: new Date(),
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    console.log('[MESSAGES_POST] Message created successfully:', {
      messageId: message.id,
      memberId: member.id,
      channelId: channelId
    });

    // Trigger system message processing for AI workflow
    try {
      console.log('[MESSAGES_POST] Triggering system message processing...');
      const { createSystemMessage } = await import('@/lib/system/system-messages');
      
      // Create system message processing in the background (don't await to avoid blocking user response)
      setImmediate(async () => {
        try {
          await createSystemMessage(channelId, message, req);
          console.log('[MESSAGES_POST] ✅ System message processing completed');
        } catch (systemError) {
          console.error('[MESSAGES_POST] ❌ System message processing failed:', systemError);
        }
      });
      
      console.log('[MESSAGES_POST] ✅ System message processing initiated');
    } catch (importError) {
      console.error('[MESSAGES_POST] ❌ Failed to import system message handler:', importError);
    }

    // Return the created message
    return NextResponse.json(message);

  } catch (error) {
    console.error("[MESSAGES_POST] Error details:", {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    return new NextResponse("Internal Error", { status: 500 });
  }
}
