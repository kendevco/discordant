import { io, Socket } from "socket.io-client";
import { SocketHelper } from "./types/socket";

class SocketService implements SocketHelper {
  private _socket: Socket | null = null;

  get socket() {
    return this._socket;
  }

  connect() {
    if (!this._socket) {
      this._socket = io(process.env.NEXT_PUBLIC_SITE_URL!, {
        path: "/api/socket/io",
        addTrailingSlash: false,
      });
    }
    return this._socket;
  }

  disconnect() {
    this._socket?.disconnect();
    this._socket = null;
  }

  emit(event: string, data: any) {
    this._socket?.emit(event, data);
  }

  on(event: string, callback: (...args: any[]) => void) {
    this._socket?.on(event, callback);
  }

  off(event: string, callback: (...args: any[]) => void) {
    this._socket?.off(event, callback);
  }

  sendMessage(channelId: string, message: any) {
    const channelKey = `chat:${channelId}:messages`;
    this._socket?.emit(channelKey, message);
  }
}

export const socketHelper = new SocketService();
