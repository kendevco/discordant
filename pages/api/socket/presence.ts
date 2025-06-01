import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const data = req.body;
  
  if (!data.userId || !data.serverId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Update member's last seen time
    await db.member.updateMany({
      where: { 
        profileId: data.userId,
        serverId: data.serverId 
      },
      data: { lastSeen: new Date() },
    });

    // Get the socket.io server instance
    const io = res.socket.server.io;
    
    if (io) {
      // Find user's socket connections and join them to appropriate rooms
      const sockets = await io.fetchSockets();
      const userSockets = sockets.filter(socket => socket.data?.userId === data.userId);
      
      for (const userSocket of userSockets) {
  // Join server room
        await userSocket.join(`server:${data.serverId}`);
  
  if (data.channelId) {
          await userSocket.join(`channel:${data.channelId}`);
  }
}

      // Emit presence update to server room
      io.to(`server:${data.serverId}`).emit("presence:update", {
        userId: data.userId,
        status: data.status || "online",
    channelId: data.channelId,
        timestamp: new Date().toISOString(),
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Presence update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
} 