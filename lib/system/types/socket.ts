import { Socket } from "socket.io-client";

export interface SocketEvents {
  "chat:typing": (data: { userId: string; name: string }) => void;
  "chat:stop_typing": (data: { userId: string }) => void;
  "message:status": (data: { messageId: string; status: string }) => void;
}

export interface SocketHelper {
  socket: Socket | null;
  connect(): Socket | null;
  disconnect(): void;
  emit(event: string, data: any): void;
  on(event: string, callback: (...args: any[]) => void): void;
  off(event: string, callback: (...args: any[]) => void): void;
  sendMessage(channelId: string, message: any): void;
}
