// /pages/api/socket/io.ts
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
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socket/io",
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["polling", "websocket"],
    });

    res.socket.server.io = io;
    
    // Register the Socket.IO instance globally for server-side emissions
    import('@/lib/system/server-socket').then(({ setServerSocketIO }) => {
      setServerSocketIO(io);
      console.log('[SOCKET_IO] Server instance registered globally');
    }).catch(error => {
      console.error('[SOCKET_IO] Failed to register server instance:', error);
    });
  }

  res.end();
};

export default ioHandler;
