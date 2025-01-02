// /pages/api/socket/messages/index.ts
import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";
import { MessageRole } from "@prisma/client";
import { createSystemMessage } from "@/lib/system/system-messages";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { fileUrl, serverId, channelId } = req.body;
    let { content } = req.body;

    if (!profile) return res.status(401).json({ error: "Unauthorized" });
    if (!serverId) return res.status(400).json({ error: "Server ID missing" });
    if (!channelId)
      return res.status(400).json({ error: "Channel ID missing" });
    if (!content && !fileUrl)
      return res.status(400).json({ error: "Content or file required" });

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: { some: { profileId: profile.id } },
      },
      include: { members: true },
    });

    if (!server) return res.status(404).json({ error: "Server not found" });

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );
    if (!member) return res.status(404).json({ error: "Member not found" });

    const message = await db.message.create({
      data: {
        id: randomUUID(),
        content: content || "",
        fileUrl: fileUrl || undefined,
        channelId,
        memberId: member.id,
        role: MessageRole.user,
        updatedAt: new Date(),
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);

    createSystemMessage(channelId, message).catch(console.error);

    return res.status(200).json(message);
  } catch (error) {
    console.error("[MESSAGES_POST]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
