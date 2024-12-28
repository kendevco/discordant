import { NextApiRequest, NextApiResponse } from "next";
import { analyzeAndUpdateMessage } from "@/lib/system/system-messages";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const messageId = req.query.messageId as string;
    const updatedMessage = await analyzeAndUpdateMessage(messageId);

    return res.status(200).json(updatedMessage);
  } catch (error) {
    console.error("[MESSAGE_ANALYZE]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
