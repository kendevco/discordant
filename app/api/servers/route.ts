import { v4 as uuidv4 } from "uuid";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { ChannelType, MemberRole } from "@prisma/client";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const server = await db.server.create({
      data: {
        id: uuidv4(),
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        updatedAt: new Date(),
        channels: {
          create: [
            {
              id: uuidv4(),
              name: "general",
              type: ChannelType.TEXT,
              profileId: profile.id,
              updatedAt: new Date(),
            },
          ],
        },
        members: {
          create: [
            {
              id: uuidv4(),
              profileId: profile.id,
              role: MemberRole.ADMIN,
              updatedAt: new Date(),
            },
          ],
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
