// Home Inventory Item
interface HomeInventoryEntry {
  type: "home_inventory";
  data: {
    timestamp: string;
    item: {
      name: string;
      category: "furniture" | "electronics" | "appliances" | "decor" | "other";
      location: string; // e.g., "living room", "kitchen"
      condition: "new" | "good" | "fair" | "poor";
      purchaseInfo?: {
        date?: string;
        price?: number;
        store?: string;
        receipt?: string; // URL to receipt image
      };
      dimensions?: {
        width?: number;
        height?: number;
        depth?: number;
        unit: "in" | "cm";
      };
      serialNumber?: string;
      warranty?: {
        expires: string;
        provider: string;
      };
      notes?: string;
      images: string[]; // URLs to images
    };
  };
}

// Food Journal Entry
interface FoodJournalEntry {
  type: "food_journal";
  data: {
    timestamp: string;
    meal: {
      type: "breakfast" | "lunch" | "dinner" | "snack";
      items: Array<{
        name: string;
        portion: string;
        calories?: number;
        nutrients?: {
          protein?: number;
          carbs?: number;
          fat?: number;
        };
      }>;
      location?: string;
      mood?: string;
      hunger?: 1 | 2 | 3 | 4 | 5; // Scale of 1-5
      images: string[]; // URLs to food images
    };
    notes?: string;
  };
}
