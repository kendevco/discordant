import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

export async function GET(req: NextRequest) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.json({
      success: true,
      role: profile.role,
      profileId: profile.id
    });

  } catch (error) {
    console.error("[PROFILE_ROLE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Only HOST users can change roles
    if (profile.role !== "HOST") {
      return new NextResponse("Forbidden - Only HOST can change roles", { status: 403 });
    }

    const body = await req.json();
    const { profileId, role } = body;

    if (!profileId || !role) {
      return new NextResponse("profileId and role are required", { status: 400 });
    }

    // Validate role
    const validRoles = ["HOST", "ADMIN", "MODERATOR", "USER"];
    if (!validRoles.includes(role)) {
      return new NextResponse("Invalid role", { status: 400 });
    }

    // Update the user's role
    const updatedProfile = await db.profile.update({
      where: { id: profileId },
      data: { role: role as any }
    });

    return NextResponse.json({
      success: true,
      profile: {
        id: updatedProfile.id,
        name: updatedProfile.name,
        email: updatedProfile.email,
        role: updatedProfile.role
      }
    });

  } catch (error) {
    console.error("[PROFILE_ROLE_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 