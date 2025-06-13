import { Server as ServerIO } from "socket.io";

// Global variable to store the Socket.IO server instance
let globalSocketIO: ServerIO | null = null;

export function setServerSocketIO(io: ServerIO) {
  globalSocketIO = io;
}

export async function getServerSocketIO(): Promise<ServerIO | null> {
  // If we have a global instance, return it
  if (globalSocketIO) {
    return globalSocketIO;
  }
  
  // Try to get the Socket.IO instance from the Next.js server
  try {
    // In production/serverless, we need to create a new instance or use existing one
    // This is a fallback approach for when the global instance isn't available
    
    // For now, return null and log that we need the socket server
    console.log('[SERVER_SOCKET] No Socket.IO server instance available');
    console.log('[SERVER_SOCKET] This is expected in serverless environments');
    
    return null;
  } catch (error) {
    console.error('[SERVER_SOCKET] Error getting Socket.IO instance:', error);
    return null;
  }
}

export function emitToChannel(channelId: string, event: string, data: any) {
  if (globalSocketIO) {
    const channelKey = `chat:${channelId}:messages`;
    globalSocketIO.emit(channelKey, data);
    console.log(`[SERVER_SOCKET] Emitted to channel: ${channelKey}`);
    return true;
  } else {
    console.warn('[SERVER_SOCKET] No Socket.IO instance available for emission');
    return false;
  }
} 