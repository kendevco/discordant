import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { channelId, content } = await req.json();
    
    if (!channelId || !content) {
      return new NextResponse("channelId and content required", { status: 400 });
    }

    // Find the channel and verify access
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
        server: true
      }
    });

    if (!channel) {
      return new NextResponse("Channel not found or access denied", { status: 404 });
    }

    // Find the user's member in this server
    const member = await db.member.findFirst({
      where: {
        profileId: profile.id,
        serverId: channel.serverId
      },
      include: {
        profile: true
      }
    });

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    // Create test message
    const testMessage = await db.message.create({
      data: {
        id: randomUUID(),
        content: `🧪 **Test Message** - ${content}\n\n*Generated at: ${new Date().toISOString()}*`,
        channelId: channelId,
        memberId: member.id,
        role: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        member: {
          include: {
            profile: true
          }
        }
      }
    });

    console.log(`✅ Test message created: ${testMessage.id}`);
    console.log(`📍 Channel: ${channelId}, Member: ${member.profile.name}`);

    // Try to trigger SSE update
    try {
      const { triggerChannelUpdate } = await import('@/lib/system/sse-updates');
      await triggerChannelUpdate(channelId, {
        id: testMessage.id,
        content: testMessage.content,
        role: testMessage.role || 'system',
        author: testMessage.member.profile.name,
        createdAt: testMessage.createdAt
      });
      console.log(`✅ SSE update triggered for test message`);
    } catch (sseError) {
      console.error('❌ SSE update failed for test message:', sseError);
    }

    return NextResponse.json({
      success: true,
      messageId: testMessage.id,
      channelId: channelId,
      content: testMessage.content,
      timestamp: testMessage.createdAt.toISOString(),
      note: 'Test message created successfully'
    });

  } catch (error) {
    console.error("[TEST_MESSAGE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 