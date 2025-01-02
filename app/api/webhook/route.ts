import { db } from "@/lib/db";
import { generateUsernameFromEmail } from "@/lib/utils/username-generator";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Get the headers
    const headerPayload = await headers();
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svixId || !svixTimestamp || !svixSignature) {
      return new NextResponse("Error occurred -- no svix headers", {
        status: 400,
      });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your webhook secret
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
      evt = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new NextResponse("Error occurred", {
        status: 400,
      });
    }

    // Handle the webhook
    if (evt.type === "user.created") {
      const { id, email_addresses: emailAddresses, image_url: imageUrl } = evt.data;
      const email = emailAddresses[0]?.email_address;

      if (!email) {
        return new NextResponse("Email required", { status: 400 });
      }

      const username = await generateUsernameFromEmail(email, db);

      await db.profile.create({
        data: {
          id,
          userId: id,
          email,
          name: username,
          imageUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.error("[WEBHOOK_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
