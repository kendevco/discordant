import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    
    const serverId = searchParams.get("serverId");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
          }
        }
      },
      include: {
        members: true,
      }
    });

    if (!server) {
      return new NextResponse("Server not found", { status: 404 });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId,
        serverId,
      },
    });
  
    if (!channel) {
      return new NextResponse("Channel not found", { status: 404 });
    }

    const member = server.members.find((member) => member.profileId === profile.id);

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    let message = await db.message.findFirst({
      where: {
        id: params.messageId,
        channelId,
      },
      include: {
        member: {
          include: {
            profile: true,
          }
        }
      }
    });

    if (!message || message.deleted) {
      return new NextResponse("Message not found", { status: 404 });
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    message = await db.message.update({
      where: {
        id: params.messageId,
      },
      data: {
        fileUrl: null,
        content: "This message has been deleted.",
        deleted: true,
      },
      include: {
        member: {
          include: {
            profile: true,
          }
        }
      }
    });

    // Broadcast the update
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/messages/broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channelId,
        message,
        type: `chat:${channelId}:messages:update`
      }),
    });

    return NextResponse.json(message);
  } catch (error) {
    console.log("[MESSAGE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { content } = await req.json();
    
    const serverId = searchParams.get("serverId");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    if (!content) {
      return new NextResponse("Content missing", { status: 400 });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
          }
        }
      },
      include: {
        members: true,
      }
    });

    if (!server) {
      return new NextResponse("Server not found", { status: 404 });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId,
        serverId,
      },
    });
  
    if (!channel) {
      return new NextResponse("Channel not found", { status: 404 });
    }

    const member = server.members.find((member) => member.profileId === profile.id);

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    let message = await db.message.findFirst({
      where: {
        id: params.messageId,
        channelId,
      },
      include: {
        member: {
          include: {
            profile: true,
          }
        }
      }
    });

    if (!message || message.deleted) {
      return new NextResponse("Message not found", { status: 404 });
    }

    const isMessageOwner = message.memberId === member.id;

    if (!isMessageOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    message = await db.message.update({
      where: {
        id: params.messageId,
      },
      data: {
        content,
      },
      include: {
        member: {
          include: {
            profile: true,
          }
        }
      }
    });

    // Broadcast the update
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/messages/broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channelId,
        message,
        type: `chat:${channelId}:messages:update`
      }),
    });

    return NextResponse.json(message);
  } catch (error) {
    console.log("[MESSAGE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 