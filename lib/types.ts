import {
  Message as PrismaMessage,
  Profile,
  Server,
  ChannelType,
} from "@prisma/client";

// Message Types
export interface MessageContext {
  content: string;
  timestamp: string;
  channelName?: string;
  author: string;
  isCurrentThread: boolean;
}

export interface MessageWithMemberProfile extends PrismaMessage {
  member: {
    profile: Profile;
  };
  channel?: {
    name: string;
  };
}

// Analysis Types
export interface MessageAnalysisResult {
  type: "text" | "image" | "document" | "command";
  content: string;
  metadata: {
    inventoryItems?: InventoryItem[];
    workflows?: string[];
    actions?: string[];
    location?: {
      lat: number;
      lng: number;
      address?: string;
    };
    confidence: number;
    tags: string[];
  };
}

// Workflow Types
export interface Workflow {
  id: string;
  triggers: Array<{
    type: string;
    conditions: Record<string, any>;
  }>;
  actions: Array<{
    type: string;
    config: Record<string, any>;
  }>;
  enabled: boolean;
}

export interface WorkflowTrigger {
  channelId: string;
  messageId: string;
  type: "message" | "image" | "document" | "schedule";
  content: string;
  metadata: Record<string, any>;
}

// Storage Types
export interface DynamicStorageSchema {
  id: string;
  type: string;
  category: string;
  subcategory?: string;
  properties: {
    [key: string]: {
      type: "string" | "number" | "boolean" | "date" | "object" | "array";
      required?: boolean;
      defaultValue?: any;
      validation?: string;
    };
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: number;
    source: string;
  };
}

export interface InventoryItem {
  // ... keep existing InventoryItem interface
}
