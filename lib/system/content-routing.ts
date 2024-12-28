import { Message } from "@prisma/client";

// Content routing patterns
export const contentPatterns = {
  imageContent: /\.(jpg|jpeg|png|gif|webp|bmp)$/i,
  furnitureContext:
    /\b(furniture|chair|table|desk|sofa|couch|cabinet|shelf|bed)\b/i,
  inventoryContext: /\b(inventory|stock|item|product|collection|catalog)\b/i,
  expenseContext: /\b(expense|cost|price|payment|receipt|bill)\b/i,
  mileageContext: /\b(mileage|distance|travel|trip|odometer|car|vehicle)\b/i,
  foodContext: /\b(food|meal|recipe|ingredient|calorie|nutrition)\b/i,
  collectionContext:
    /\b(collection|collectible|coin|stamp|beer|can|value|grade|condition)\b/i,
};

export interface ContentRoutingRule {
  pattern: RegExp;
  targetChannel: string;
  priority: number;
  description: string;
}

export const contentRoutingRules: ContentRoutingRule[] = [
  {
    pattern: contentPatterns.furnitureContext,
    targetChannel: "furniture",
    priority: 1,
    description: "Route furniture-related content",
  },
  {
    pattern: contentPatterns.inventoryContext,
    targetChannel: "inventory",
    priority: 2,
    description: "Route inventory-related content",
  },
  {
    pattern: contentPatterns.expenseContext,
    targetChannel: "expenses",
    priority: 1,
    description: "Route expense-related content",
  },
  {
    pattern: contentPatterns.mileageContext,
    targetChannel: "mileage",
    priority: 1,
    description: "Route mileage-related content",
  },
  {
    pattern: contentPatterns.foodContext,
    targetChannel: "food",
    priority: 1,
    description: "Route food and nutrition content",
  },
  {
    pattern: contentPatterns.collectionContext,
    targetChannel: "collections",
    priority: 1,
    description: "Route collectibles content",
  },
];

export interface ContentAnalysis {
  contentType: string;
  targetChannel?: string;
  confidence: number;
}

export function determineContentType(
  message: Message,
  previousMessages: Message[]
): ContentAnalysis {
  // Check for image content
  if (message.fileUrl && contentPatterns.imageContent.test(message.fileUrl)) {
    // Look at previous messages for context
    const recentContext = previousMessages
      .slice(-5)
      .map((msg) => msg.content)
      .join(" ")
      .toLowerCase();

    // Check each routing rule
    for (const rule of contentRoutingRules) {
      if (rule.pattern.test(recentContext)) {
        return {
          contentType: "image_analysis",
          targetChannel: rule.targetChannel,
          confidence: 0.8,
        };
      }
    }

    // Default image handling
    return {
      contentType: "image_analysis",
      confidence: 0.5,
    };
  }

  // Check text content against routing rules
  const content = message.content?.toLowerCase() || "";
  for (const rule of contentRoutingRules) {
    if (rule.pattern.test(content)) {
      return {
        contentType: "content_routing",
        targetChannel: rule.targetChannel,
        confidence: 0.7,
      };
    }
  }

  return {
    contentType: "channel",
    confidence: 1.0,
  };
}
