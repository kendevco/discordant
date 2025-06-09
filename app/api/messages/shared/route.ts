import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const sharedMessages = await db.sharedMessage.findMany({
      where: {
        isPublic: true,
      },
      include: {
        message: {
          include: {
            member: {
              include: {
                profile: true,
              },
            },
            fileMetadata: true,
          },
        },
        directMessage: {
          include: {
            member: {
              include: {
                profile: true,
              },
            },
            fileMetadata: true,
          },
        },
      },
      orderBy: {
        sharedAt: 'desc',
      },
    });

    return NextResponse.json(sharedMessages);
  } catch (error) {
    console.error("[SHARED_MESSAGES_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 