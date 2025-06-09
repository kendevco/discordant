import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { deleteUploadThingFile, cleanupOldFile } from "@/lib/utils/uploadthing-cleanup";

type Params = Promise<{
  serverId: string;
}>;

export async function DELETE(req: Request, { params }: { params: Params }) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { serverId } = await params;
    
    // Get the server first to access the image URL
    const serverToDelete = await db.server.findUnique({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });

    if (!serverToDelete) {
      return new NextResponse("Server not found", { status: 404 });
    }

    // Delete the server image from UploadThing if it exists
    if (serverToDelete.imageUrl) {
      await deleteUploadThingFile(serverToDelete.imageUrl, "SERVER_DELETE");
    }

    const server = await db.server.delete({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_DELETE", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
    const profile = await currentProfile();
    const { name, imageUrl, workflowEnabled, selectedWorkflow } = await req.json();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { serverId } = await params;
    
    // Get the current server to check for old image
    const currentServer = await db.server.findUnique({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });

    if (!currentServer) {
      return new NextResponse("Server not found", { status: 404 });
    }

    // If imageUrl is being changed, delete the old image from UploadThing
    await cleanupOldFile(currentServer.imageUrl, imageUrl, "SERVER_UPDATE");

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
        ...(workflowEnabled !== undefined && { workflowEnabled }),
        ...(selectedWorkflow !== undefined && { selectedWorkflow }),
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_PATCH", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
