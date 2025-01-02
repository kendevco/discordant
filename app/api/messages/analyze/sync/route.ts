import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { createSystemMessage } from "@/lib/system/system-messages";
import { Permission, hasPermission } from "@/lib/system/role-checker";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    // Check if user has admin permission
    if (!(await hasPermission(profile, Permission.ADMIN))) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get all messages with fileUrls
    const messages = await db.message.findMany({
      where: {
        fileUrl: {
          not: null,
          contains: ".", // Basic check for file extension
        },
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    console.log(`[SYNC] Found ${messages.length} messages with files`);

    // Process each message
    const results = await Promise.allSettled(
      messages.map(async (message) => {
        try {
          // Only process image files
          if (!message.fileUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            return { status: "skipped", messageId: message.id };
          }

          // Reprocess through system message handler
          await createSystemMessage(message.channelId, message);

          return { status: "success", messageId: message.id };
        } catch (error) {
          console.error(`[SYNC_ERROR] Message ${message.id}:`, error);
          return { status: "error", messageId: message.id, error };
        }
      })
    );

    // Compile results
    const summary = {
      total: messages.length,
      processed: results.length,
      successful: results.filter((r) => r.status === "fulfilled").length,
      failed: results.filter((r) => r.status === "rejected").length,
    };

    console.log("[SYNC_COMPLETE]", summary);

    return NextResponse.json(summary);
  } catch (error) {
    console.error("[SYNC_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
