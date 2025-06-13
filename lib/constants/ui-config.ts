// UI Configuration Constants
export const UI_CONFIG = {
  // Message display settings
  MESSAGE_LINE_WRAP: 40, // Characters before wrapping (user configurable)
  MESSAGE_EXPANDABLE_LENGTH: 650, // Characters before showing "Show more"
  
  // Spacing settings
  MESSAGE_SPACING: {
    PARAGRAPH_GAP: "mb-1", // Tight spacing between paragraphs
    SECTION_GAP: "mt-2 mb-1", // Minimal spacing for sections
    HEADER_GAP: "mt-1 mb-1", // Tight header spacing
    LIST_ITEM_GAP: "mb-0.5", // Very tight list spacing
  },
  
  // User preferences (will be moved to user settings later)
  USER_PREFERENCES: {
    COMPACT_MESSAGES: true,
    SHOW_TIMESTAMPS: true,
    SHOW_AVATARS: true,
    AUTO_EXPAND_LONG_MESSAGES: false,
  }
} as const;

export type UIConfig = typeof UI_CONFIG; 