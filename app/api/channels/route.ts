import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole, ChannelType, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

const channelSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(ChannelType),
});

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { name, type } = channelSchema.parse(await req.json());
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server ID missing ", { status: 400 });
    }
    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            id: randomUUID(),
            profileId: profile.id,
            name,
            type,
            updatedAt: new Date(),
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("[CHANNELS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
