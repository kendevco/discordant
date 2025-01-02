import { NextApiRequest, NextApiResponse } from "next";
import { createSystemMessage } from "@/lib/system/system-messages";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const messageId = req.query.messageId as string;

    // Fetch the message with its channel and member info
    const message = await db.message.findUnique({
      where: { id: messageId },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    const updatedMessage = await createSystemMessage(
      message.channelId,
      message,
      req.body.socketIo // Optional socket instance
    );

    return res.status(200).json(updatedMessage);
  } catch (error) {
    console.error("[MESSAGE_ANALYZE]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
