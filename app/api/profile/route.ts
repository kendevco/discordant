import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const profile = await currentProfile();
    const { name } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedProfile = await db.profile.update({
      where: {
        id: profile.id,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.log("[PROFILE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
