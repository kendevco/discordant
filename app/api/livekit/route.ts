import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const room = req.nextUrl.searchParams.get("room");
    const username = req.nextUrl.searchParams.get("username");
    
    if (!room) {
      return NextResponse.json({ error: 'Missing "room" query parameter' }, { status: 400 });
    } else if (!username) {
      return NextResponse.json({ error: 'Missing "username" query parameter' }, { status: 400 });
    }

    // Log all environment variables for debugging
    console.log("Environment variables:", {
      LIVEKIT_API_KEY: process.env.LIVEKIT_API_KEY?.substring(0, 3) + "...",
      LIVEKIT_API_SECRET: process.env.LIVEKIT_API_SECRET?.substring(0, 3) + "...",
      LIVEKIT_URL: process.env.LIVEKIT_URL,
      NEXT_PUBLIC_LIVEKIT_URL: process.env.NEXT_PUBLIC_LIVEKIT_URL,
    });

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing LIVEKIT_API_KEY" }, { status: 500 });
    }
    if (!apiSecret) {
      return NextResponse.json({ error: "Missing LIVEKIT_API_SECRET" }, { status: 500 });
    }
    if (!wsUrl) {
      return NextResponse.json({ error: "Missing LIVEKIT_URL" }, { status: 500 });
    }

    // Create token with room-specific grants
    const at = new AccessToken(apiKey, apiSecret, { identity: username });
    at.addGrant({ 
      room,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      roomList: false // Restrict to specific room only
    });

    try {
      const token = await at.toJwt();
      console.log("Generated LiveKit token for room:", room, "user:", username);
      
      return NextResponse.json({ 
        token,
        room,
        username,
        url: wsUrl // Return URL for debugging
      });
    } catch (tokenError) {
      console.error("[LIVEKIT_TOKEN_GENERATION_ERROR]", tokenError);
      return NextResponse.json(
        { error: "Failed to generate JWT token" }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[LIVEKIT_TOKEN_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to generate token" }, 
      { status: 500 }
    );
  }
}