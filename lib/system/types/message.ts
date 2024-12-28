import { Message, Member, Profile } from "@prisma/client";
import { AutomationContext } from "./workflow";

export interface MessageWithMemberWithProfile extends Message {
  member: Member & {
    profile: Profile;
  };
}

export interface EnhancedMessage {
  role: string;
  content: string;
  author: string;
  timestamp: Date;
  channelName?: string;
  messageType: string;
  isThread: boolean;
  hasAttachments: boolean;
  sentiment?: string;
  workflowId?: string;
  workflowType?: string;
  automationContext?: AutomationContext;
}
