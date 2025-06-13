// /app/api/messages/route.ts
  
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 50;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");
    
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }
    
    // Validate channelId format (UUID format)
    if (!/^[a-f0-9-]{36}$/.test(channelId)) {
      return new NextResponse("Invalid channel ID format", { status: 400 });
    }

    // Use raw query to avoid Prisma include issues with null relationships
    let messages;
    
    try {
      if (cursor) {
        // Validate cursor format - should be a UUID (message ID)
        if (!/^[a-f0-9-]{36}$/.test(cursor)) {
          return new NextResponse("Invalid cursor format", { status: 400 });
        }
        
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
