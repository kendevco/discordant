import { NextRequest, NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { PresenceService } from "@/lib/system/presence-service";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    // Verify user is a member of this server
    const member = await db.member.findFirst({
      where: {
        profileId: profile.id,
        serverId: serverId,
      },
    });

    if (!member) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Get online users for this server
    const onlineUsers = await PresenceService.getOnlineUsers(serverId);

    return NextResponse.json(onlineUsers);
  } catch (error) {
    console.error("[PRESENCE_ONLINE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 