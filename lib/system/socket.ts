import { io, Socket } from "socket.io-client";
import { SocketHelper } from "./types/socket";

class SocketService implements SocketHelper {
  private _socket: Socket | null = null;
  private _reconnectAttempts = 0;
  private _maxReconnectAttempts = 10;
  private _isConnecting = false;

  get socket() {
    return this._socket;
  }

  connect() {
    if (this._isConnecting) {
      console.log('[SOCKET_CLIENT] Connection already in progress');
      return this._socket;
    }

    if (this._socket?.connected) {
      console.log('[SOCKET_CLIENT] Already connected');
      return this._socket;
    }

    this._isConnecting = true;
    console.log('[SOCKET_CLIENT] Initiating connection...');

    try {
      // Get the site URL with proper HTTPS handling
      let siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
      
      if (typeof window !== 'undefined') {
        // In browser, use current origin (which will be https://localhost:3000 in dev)
        siteUrl = window.location.origin;
      } else if (!siteUrl) {
        // Fallback for server-side
        siteUrl = 'https://localhost:3000';
      }
      
      console.log(`[SOCKET_CLIENT] Connecting to: ${siteUrl}`);

      this._socket = io(siteUrl, {
        path: "/api/socket/io",
        addTrailingSlash: false,
        transports: ["polling", "websocket"],
        upgrade: true,
        rememberUpgrade: true,
        reconnection: true,
        reconnectionAttempts: this._maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        randomizationFactor: 0.5,
        timeout: 20000,
        forceNew: false,
        autoConnect: true,
        withCredentials: true,
        // HTTPS-specific configuration
        secure: siteUrl.startsWith('https://'),
        rejectUnauthorized: false, // Allow self-signed certificates in development
        // Enhanced configuration for stability
        closeOnBeforeunload: false,
        extraHeaders: {
          "User-Agent": "DiscordantClient/1.0"
        }
      });

      // Enhanced event handlers
      this._socket.on("connect", () => {
        console.log(`[SOCKET_CLIENT] ✅ Connected successfully: ${this._socket?.id}`);
        this._reconnectAttempts = 0;
        this._isConnecting = false;
        
        // Emit identification if we have user data
        const userData = this.getUserData();
        if (userData) {
          this._socket?.emit("user:identify", userData);
        }
      });

      this._socket.on("disconnect", (reason) => {
        console.log(`[SOCKET_CLIENT] ❌ Disconnected: ${reason}`);
        this._isConnecting = false;
        
        // Handle different disconnect reasons
        if (reason === "io server disconnect") {
          // Server initiated disconnect, don't reconnect automatically
          console.log('[SOCKET_CLIENT] Server initiated disconnect');
        } else if (reason === "transport close" || reason === "transport error") {
          // Network issues, will auto-reconnect
          console.log('[SOCKET_CLIENT] Network issue, will attempt reconnection');
        } else if (reason === "ping timeout") {
          // Ping timeout, will auto-reconnect
          console.log('[SOCKET_CLIENT] Ping timeout, will attempt reconnection');
        }
      });

      this._socket.on("connect_error", (error) => {
        console.error(`[SOCKET_CLIENT] ❌ Connection error:`, error.message);
        this._isConnecting = false;
        this._reconnectAttempts++;
        
        // Provide specific error guidance
        if (error.message.includes('websocket error')) {
          console.log('[SOCKET_CLIENT] 💡 WebSocket error - this is normal, will fallback to polling');
        } else if (error.message.includes('certificate')) {
          console.log('[SOCKET_CLIENT] 💡 Certificate error - this is expected with self-signed HTTPS certificates');
        } else if (error.message.includes('timeout')) {
          console.log('[SOCKET_CLIENT] 💡 Connection timeout - server may be overloaded');
        }
        
        if (this._reconnectAttempts >= this._maxReconnectAttempts) {
          console.error('[SOCKET_CLIENT] Max reconnection attempts reached');
          this._socket?.disconnect();
        }
      });

      this._socket.on("reconnect", (attemptNumber) => {
        console.log(`[SOCKET_CLIENT] ✅ Reconnected after ${attemptNumber} attempts`);
        this._reconnectAttempts = 0;
        this._isConnecting = false;
      });

      this._socket.on("reconnect_attempt", (attemptNumber) => {
        console.log(`[SOCKET_CLIENT] 🔄 Reconnection attempt ${attemptNumber}/${this._maxReconnectAttempts}`);
      });

      this._socket.on("reconnect_error", (error) => {
        console.error(`[SOCKET_CLIENT] ❌ Reconnection error:`, error.message);
      });

      this._socket.on("reconnect_failed", () => {
        console.error('[SOCKET_CLIENT] ❌ Reconnection failed completely');
        this._isConnecting = false;
      });

      // Handle pong responses
      this._socket.on("pong", () => {
        console.log('[SOCKET_CLIENT] 🏓 Pong received');
      });

      // Generic error handler
      this._socket.on("error", (error) => {
        console.error('[SOCKET_CLIENT] ❌ Socket error:', error);
      });

      // Handle transport events for debugging
      this._socket.io.on("error", (error) => {
        console.error('[SOCKET_CLIENT] ❌ Transport error:', error);
      });

      this._socket.io.on("reconnect", () => {
        console.log('[SOCKET_CLIENT] 🔄 Transport reconnected');
      });

    } catch (error) {
      console.error('[SOCKET_CLIENT] ❌ Failed to create socket:', error);
      this._isConnecting = false;
    }

    return this._socket;
  }

  disconnect() {
    if (this._socket) {
      console.log('[SOCKET_CLIENT] 🔌 Disconnecting...');
      this._socket.disconnect();
      this._socket = null;
    }
    this._isConnecting = false;
    this._reconnectAttempts = 0;
  }

  emit(event: string, data: any) {
    if (this._socket?.connected) {
      this._socket.emit(event, data);
      console.log(`[SOCKET_CLIENT] 📤 Emitted: ${event}`);
    } else {
      console.warn(`[SOCKET_CLIENT] ⚠️ Cannot emit ${event}: not connected`);
      // Attempt to reconnect if not connected
      this.connect();
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (this._socket) {
      this._socket.on(event, callback);
      console.log(`[SOCKET_CLIENT] 👂 Listening for: ${event}`);
    } else {
      console.warn(`[SOCKET_CLIENT] ⚠️ Cannot listen for ${event}: socket not initialized`);
    }
  }

  off(event: string, callback: (...args: any[]) => void) {
    if (this._socket) {
      this._socket.off(event, callback);
      console.log(`[SOCKET_CLIENT] 🔇 Stopped listening for: ${event}`);
    }
  }

  sendMessage(channelId: string, message: any) {
    const channelKey = `chat:${channelId}:messages`;
    this.emit(channelKey, message);
  }

  // Join/leave channel rooms
  joinChannel(channelId: string) {
    this.emit("join:channel", channelId);
  }

  leaveChannel(channelId: string) {
    this.emit("leave:channel", channelId);
  }

  // Join/leave conversation rooms
  joinConversation(conversationId: string) {
    this.emit("join:conversation", conversationId);
  }

  leaveConversation(conversationId: string) {
    this.emit("leave:conversation", conversationId);
  }

  // Presence management
  updatePresence(serverId: string, status: string) {
    this.emit("presence:update", { serverId, status });
  }

  // Typing indicators
  startTyping(channelId?: string, conversationId?: string) {
    this.emit("typing:start", { channelId, conversationId });
  }

  stopTyping(channelId?: string, conversationId?: string) {
    this.emit("typing:stop", { channelId, conversationId });
  }

  // Heartbeat
  ping() {
    this.emit("ping", {});
  }

  // Get connection status
  isConnected(): boolean {
    return this._socket?.connected || false;
  }

  // Get socket ID
  getSocketId(): string | undefined {
    return this._socket?.id;
  }

  // Store user data for identification
  private getUserData() {
    if (typeof window !== 'undefined') {
      try {
        const userData = localStorage.getItem('socket_user_data');
        return userData ? JSON.parse(userData) : null;
      } catch (error) {
        console.error('[SOCKET_CLIENT] Error getting user data:', error);
        return null;
      }
    }
    return null;
  }

  // Set user data for identification
  setUserData(userData: { userId: string; userName?: string; serverId?: string }) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('socket_user_data', JSON.stringify(userData));
        // If already connected, identify immediately
        if (this._socket?.connected) {
          this._socket.emit("user:identify", userData);
        }
      } catch (error) {
        console.error('[SOCKET_CLIENT] Error setting user data:', error);
      }
    }
  }
}

export const socketHelper = new SocketService();
