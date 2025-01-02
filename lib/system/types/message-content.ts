export interface WorkflowContent {
  type: "workflow";
  originalPrompt?: string;
  analysis?: {
    description: string;
    objects: string[];
    categories: string[];
    metadata?: {
      location?: { lat: number; lng: number };
      timestamp?: string;
    };
  };
  workflow?: {
    type: "food_journal" | "expense_tracker" | "home_inventory";
    data: Record<string, any>;
  };
}

export interface SystemMessageContent {
  type: "system" | "workflow";
  content: string | WorkflowContent;
  context?: {
    recentMessages: {
      channelId: string;
      channelName: string;
      author: string;
      preview: string;
    }[];
  };
}
