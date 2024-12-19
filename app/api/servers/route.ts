import { v4 as uuidv4 } from "uuid";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { MemberRole, ChannelType } from "@prisma/client";
import type { ServerWithMembersWithProfiles } from "@/types/server";

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
              profileId: profile.id,
              type: ChannelType.TEXT,
              updatedAt: new Date()
            }
          ]
        },
        members: {
          create: [
            {
              id: uuidv4(),
              profileId: profile.id,
              role: MemberRole.ADMIN,
              updatedAt: new Date()
            }
          ]
        }
      },
      include: {
        channels: true,
        members: {
          include: {
            profile: true
          }
        }
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const servers = await db.server.findMany({
      where: {
        members: {
          some: {
            profileId: profile.id
          }
        }
      },
      include: {
        channels: true,
        members: {
          include: {
            profile: true
          }
        }
      }
    }) as ServerWithMembersWithProfiles[];

    return NextResponse.json(servers);
  } catch (error) {
    console.log("[SERVERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
