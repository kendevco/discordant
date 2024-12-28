export interface TypingUser {
  userId: string;
  name: string;
  timestamp: number;
}

export interface TypingIndicator {
  channelId: string;
  users: TypingUser[];
}

export interface TypingEvents {
  "chat:typing": (data: { channelId: string; userId: string; name: string }) => void;
  "chat:stop_typing": (data: { channelId: string; userId: string }) => void;
}

export const TYPING_TIMEOUT = 3000; // 3 seconds

export interface TypingState {
  typingUsers: Map<string, TypingUser>;
  sendTyping: (name: string) => void;
  sendStopTyping: () => void;
} 