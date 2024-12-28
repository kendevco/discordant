export interface MessageStatus {
  id: string;
  status: "sending" | "sent" | "delivered" | "failed";
  error?: string;
  timestamp: number;
}
