import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";

export async function POST(req: Request) {
  console.log("POST /api/messages/broadcast - Request received");
  try {
    const profile = await currentProfile();
    console.log("Profile retrieved:", profile ? profile.id : "None");

    if (!profile) {
      console.warn("Unauthorized access attempt");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { channelId, message, type } = await req.json();
    console.log("Request payload:", { channelId, message, type });

    if (!channelId || !message) {
      console.warn("Missing required fields in request payload");
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // In a real implementation, you would use a pub/sub system or a broadcast channel
    // For now, the SSE connections will poll for updates
    console.log("Broadcasting message:", { channelId, message, type });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[MESSAGES_BROADCAST] Error:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 