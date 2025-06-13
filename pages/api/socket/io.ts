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
        origin: [
          process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000",
          "https://discordant.kendev.co",
          "https://discordant-git-main-ken-dev-co.vercel.app",
          "https://localhost:3000",
          "http://localhost:3000",
          "http://localhost:3001"
        ],
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
      },
      transports: ["polling", "websocket"],
      allowEIO3: true,
      pingTimeout: 60000,
      pingInterval: 25000,
      upgradeTimeout: 30000,
      maxHttpBufferSize: 1e6,
      allowRequest: (req, callback) => {
        // Allow all requests for now, add validation later if needed
        callback(null, true);
      },
    });

    // Enhanced connection handling
    io.on("connection", (socket) => {
      console.log(`[SOCKET_IO] ✅ Client connected: ${socket.id}`);
      
      // Store user data in socket
      socket.on("user:identify", (data) => {
        socket.data = { ...socket.data, ...data };
        console.log(`[SOCKET_IO] User identified: ${data.userId || 'unknown'}`);
      });

      // Handle room joining
      socket.on("join:channel", (channelId) => {
        const roomName = `chat:${channelId}:messages`;
        socket.join(roomName);
        console.log(`[SOCKET_IO] Socket ${socket.id} joined channel: ${channelId}`);
      });

      socket.on("leave:channel", (channelId) => {
        const roomName = `chat:${channelId}:messages`;
        socket.leave(roomName);
        console.log(`[SOCKET_IO] Socket ${socket.id} left channel: ${channelId}`);
      });

      // Handle conversation rooms
      socket.on("join:conversation", (conversationId) => {
        const roomName = `conversation:${conversationId}:messages`;
        socket.join(roomName);
        console.log(`[SOCKET_IO] Socket ${socket.id} joined conversation: ${conversationId}`);
      });

      socket.on("leave:conversation", (conversationId) => {
        const roomName = `conversation:${conversationId}:messages`;
        socket.leave(roomName);
        console.log(`[SOCKET_IO] Socket ${socket.id} left conversation: ${conversationId}`);
      });

      // Handle presence updates
      socket.on("presence:update", (data) => {
        if (data.serverId) {
          socket.to(`server:${data.serverId}`).emit("presence:update", {
            userId: socket.data?.userId,
            status: data.status,
            timestamp: new Date().toISOString(),
          });
        }
      });

      // Handle typing indicators
      socket.on("typing:start", (data) => {
        const roomName = data.conversationId 
          ? `conversation:${data.conversationId}:messages`
          : `chat:${data.channelId}:messages`;
        
        socket.to(roomName).emit("typing:start", {
          userId: socket.data?.userId,
          userName: socket.data?.userName,
          timestamp: new Date().toISOString(),
        });
      });

      socket.on("typing:stop", (data) => {
        const roomName = data.conversationId 
          ? `conversation:${data.conversationId}:messages`
          : `chat:${data.channelId}:messages`;
        
        socket.to(roomName).emit("typing:stop", {
          userId: socket.data?.userId,
          timestamp: new Date().toISOString(),
        });
      });

      // Handle disconnection
      socket.on("disconnect", (reason) => {
        console.log(`[SOCKET_IO] ❌ Client disconnected: ${socket.id}, reason: ${reason}`);
        
        // Emit user offline status if we have user data
        if (socket.data?.userId && socket.data?.serverId) {
          socket.to(`server:${socket.data.serverId}`).emit("presence:update", {
            userId: socket.data.userId,
            status: "offline",
            timestamp: new Date().toISOString(),
          });
        }
      });

      // Handle connection errors
      socket.on("error", (error) => {
        console.error(`[SOCKET_IO] Socket error for ${socket.id}:`, error);
      });

      // Heartbeat/ping handling
      socket.on("ping", () => {
        socket.emit("pong");
      });
    });

    // Global error handling
    io.engine.on("connection_error", (err) => {
      console.error("[SOCKET_IO] Connection error:", {
        message: err.message,
        description: err.description,
        context: err.context,
        type: err.type,
      });
    });

    res.socket.server.io = io;
    
    // Register the Socket.IO instance globally for server-side emissions
    import('@/lib/system/server-socket').then(({ setServerSocketIO }) => {
      setServerSocketIO(io);
      console.log('[SOCKET_IO] ✅ Server instance registered globally');
    }).catch(error => {
      console.error('[SOCKET_IO] ❌ Failed to register server instance:', error);
    });

    console.log('[SOCKET_IO] ✅ Socket.IO server initialized successfully');
  }

  // End the response
  res.end();
};

export default ioHandler;
