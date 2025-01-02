import { db } from "@/lib/db";
import { generateUsernameFromEmail } from "@/lib/utils/username-generator";
import { WebhookEvent, UserJSON } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const headerPayload = await headers();
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new NextResponse("Error occurred -- no svix headers", {
        status: 400,
      });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new NextResponse("Error occurred", { status: 400 });
    }

    const { data } = evt;
    const userData = data as UserJSON;
    const { id } = userData;
    const email = userData.email_addresses?.[0]?.email_address;
    const imageUrl = userData.image_url;

    if (!email) {
      return new NextResponse("Email required", { status: 400 });
    }

    if (evt.type === "user.created") {
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

    if (evt.type === "user.updated") {
      await db.profile.update({
        where: { id },
        data: {
          email,
          imageUrl,
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
