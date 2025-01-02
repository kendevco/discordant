import { WorkflowContent } from "./types/message-content";

type WorkflowType = NonNullable<WorkflowContent["workflow"]>;

export function determineWorkflow(
  categories: string[],
  fileUrl?: string
): WorkflowType | undefined {
  if (categories.includes("furniture")) {
    return {
      type: "home_inventory",
      data: {
        timestamp: new Date().toISOString(),
        item: {
          name: "Leather Couch",
          category: "furniture",
          location: "living room",
          condition: "good",
          dimensions: {
            width: 84,
            depth: 38,
            height: 34,
            unit: "in",
          },
          images: fileUrl ? [fileUrl] : [],
          notes: "Gray leather sectional with chaise",
        },
      },
    };
  }
  if (categories.includes("food")) {
    return {
      type: "food_journal",
      data: {
        timestamp: new Date().toISOString(),
        meal: {
          type: "lunch",
          items: [
            {
              name: "Chicken Caesar Salad",
              portion: "1 bowl",
              calories: 350,
            },
          ],
          hunger: 3,
          images: [fileUrl],
        },
      },
    };
  }
  if (categories.includes("receipt") || categories.includes("price")) {
    return {
      type: "expense_tracker",
      data: { timestamp: new Date().toISOString() },
    };
  }
  if (categories.includes("home") || categories.includes("inventory")) {
    return {
      type: "home_inventory",
      data: { timestamp: new Date().toISOString() },
    };
  }
  return undefined;
}
