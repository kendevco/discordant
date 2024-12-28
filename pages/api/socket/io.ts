import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIo } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      transports: ["websocket", "polling"],
      pingInterval: 25000,
      pingTimeout: 20000,
      connectTimeout: 10000,
      allowEIO3: true,
      maxHttpBufferSize: 1e8,
      upgradeTimeout: 30000,
      perMessageDeflate: {
        threshold: 2048,
      }
    });

    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);

      socket.on("error", (error) => {
        console.error("Socket error:", error);
      });

      socket.on("disconnect", (reason) => {
        console.log(`Socket ${socket.id} disconnected:`, reason);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;
