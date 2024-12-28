export const socketHelper = {
  sendMessage: (channelId: string, message: any) => {
    const io = (global as any).io;
    if (io) {
      const channelKey = `chat:${channelId}:messages`;
      io.emit(channelKey, {
        type: "message",
        data: message,
      });
    }
  },
  on: (event: string, callback: (...args: any[]) => void) => {
    const io = (global as any).io;
    if (io) {
      io.on(event, callback);
    }
  },
  off: (event: string, callback: (...args: any[]) => void) => {
    const io = (global as any).io;
    if (io) {
      io.off(event, callback);
    }
  },
  emit: (event: string, data: any) => {
    const io = (global as any).io;
    if (io) {
      io.emit(event, data);
    }
  },
  // ... other socket helper methods
};
