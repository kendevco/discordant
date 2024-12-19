import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import type { ServerWithMembersWithProfiles } from "@/types/server";

export async function GET(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.findUnique({
      where: {
        id: params.serverId,
        members: {
          some: {
            profileId: profile.id
          }
        }
      },
      include: {
        channels: {
          orderBy: {
            createdAt: "asc"
          }
        },
        members: {
          include: {
            profile: true
          },
          orderBy: {
            role: "asc"
          }
        }
      }
    }) as ServerWithMembersWithProfiles;

    if (!server) {
      return new NextResponse("Server not found", { status: 404 });
    }

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }

    const server = await db.server.delete({
      where: {
        id: params.serverId,
        profileId: profile.id,
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    const { name, imageUrl } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
      include: {
        channels: true,
        members: {
          include: {
            profile: true
          }
        }
      }
    }) as ServerWithMembersWithProfiles;

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}