export class CalendarCommandDetector {
  private static calendarKeywords = [
    "calendar",
    "event",
    "meeting",
    "appointment",
    "schedule",
    "today",
    "tomorrow",
    "next week",
    "availability",
    "free",
    "busy",
    "create",
    "update",
    "delete",
    "cancel",
    "reschedule",
    "when",
    "what time",
    "book",
    "plan",
    "diary",
    "agenda"
  ];

  static isCalendarMessage(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    return this.calendarKeywords.some((keyword) =>
      lowerMessage.includes(keyword)
    );
  }

  static getCalendarIntent(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("show") ||
      lowerMessage.includes("what") ||
      lowerMessage.includes("list") ||
      lowerMessage.includes("today") ||
      lowerMessage.includes("tomorrow") ||
      lowerMessage.includes("when")
    ) {
      return "view";
    }

    if (
      lowerMessage.includes("create") ||
      lowerMessage.includes("schedule") ||
      lowerMessage.includes("book") ||
      lowerMessage.includes("add") ||
      lowerMessage.includes("plan")
    ) {
      return "create";
    }

    if (
      lowerMessage.includes("update") ||
      lowerMessage.includes("change") ||
      lowerMessage.includes("move") ||
      lowerMessage.includes("reschedule") ||
      lowerMessage.includes("modify")
    ) {
      return "update";
    }

    if (
      lowerMessage.includes("delete") ||
      lowerMessage.includes("cancel") ||
      lowerMessage.includes("remove")
    ) {
      return "delete";
    }

    if (
      lowerMessage.includes("free") ||
      lowerMessage.includes("available") ||
      lowerMessage.includes("busy")
    ) {
      return "availability";
    }

    return "general";
  }

  /**
   * Appends current date, time, and timezone context to calendar messages
   * so the AI agent knows the current temporal reference point
   */
  static appendDateTimeContext(message: string): string {
    const now = new Date();
    
    // Get current date in readable format
    const currentDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Get current time in readable format
    const currentTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    
    // Get timezone information
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneOffset = now.getTimezoneOffset();
    const offsetHours = Math.abs(Math.floor(timezoneOffset / 60));
    const offsetMinutes = Math.abs(timezoneOffset % 60);
    const offsetSign = timezoneOffset <= 0 ? '+' : '-';
    const formattedOffset = `UTC${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
    
    // Create context string
    const contextString = `\n\n[CURRENT CONTEXT: Today is ${currentDate}. The current time is ${currentTime}. The timezone is ${timezone} (${formattedOffset}).]`;
    
    return message + contextString;
  }

  /**
   * Processes a calendar message by appending context if it's calendar-related
   */
  static processCalendarMessage(message: string): {
    isCalendarMessage: boolean;
    processedMessage: string;
    intent: string;
  } {
    const isCalendar = this.isCalendarMessage(message);
    
    return {
      isCalendarMessage: isCalendar,
      processedMessage: isCalendar ? this.appendDateTimeContext(message) : message,
      intent: isCalendar ? this.getCalendarIntent(message) : 'none'
    };
  }
} 