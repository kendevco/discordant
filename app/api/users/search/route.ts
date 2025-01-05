import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    // Get existing member IDs for this server
    const existingMembers = await db.member.findMany({
      where: { serverId },
      select: { profileId: true },
    });
    const existingMemberIds = existingMembers.map((member) => member.profileId);

    // Base query to exclude current user and existing members
    const baseWhere = {
      NOT: {
        id: {
          in: [profile.id, ...existingMemberIds],
        },
      },
    };

    // Add search condition if query exists
    const where = query
      ? {
          ...baseWhere,
          OR: [{ name: { contains: query } }, { email: { contains: query } }],
        }
      : baseWhere;

    const users = await db.profile.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: 25, // Limit results
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("[USERS_SEARCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
