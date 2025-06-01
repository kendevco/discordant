import { CalendarCommandDetector } from "./calendar-command-detector";

export interface TestWebhookPayload {
  message: string;
  userId: string;
  userName: string;
  channelId: string;
  timestamp: string;
  intent: string;
  requestContext: {
    platform: string;
    userRole: string;
    priority: string;
  };
}

export interface TestWebhookResponse {
  success: boolean;
  response?: any;
  error?: string;
  responseTime: number;
}

export class CalendarWebhookTester {
  private static readonly WEBHOOK_URL = "/api/calendar";

  static async testCalendarMessage(
    message: string,
    userId: string = "test-user-123",
    channelId: string = "test-channel-456"
  ): Promise<TestWebhookResponse> {
    const startTime = Date.now();
    
    // Process the message to add date/time context if it's calendar-related
    const processedMessage = CalendarCommandDetector.processCalendarMessage(message);
    
    console.log("🔍 Calendar Message Processing:", {
      original: message,
      isCalendarMessage: processedMessage.isCalendarMessage,
      intent: processedMessage.intent,
      enhanced: processedMessage.processedMessage
    });
    
    const payload: TestWebhookPayload = {
      message: processedMessage.processedMessage, // Use enhanced message with date/time context
      userId,
      userName: "Test User",
      channelId,
      timestamp: new Date().toISOString(),
      intent: processedMessage.intent,
      requestContext: {
        platform: "discordant-chat-test",
        userRole: "staff",
        priority: "normal",
      },
    };

    try {
      console.log("🧪 Testing webhook with payload:", payload);
      
      const response = await fetch(this.WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Discordant-Chat-App/1.0-Test",
          "X-Requested-From": "discordant-test-utility",
        },
        body: JSON.stringify(payload),
      });

      const responseTime = Date.now() - startTime;

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          responseTime,
        };
      }

      const data = await response.json();
      console.log("✅ Webhook response:", data);

      return {
        success: true,
        response: data,
        responseTime,
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error("❌ Webhook test failed:", error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        responseTime,
      };
    }
  }

  // Predefined test cases
  static async runTestSuite(): Promise<void> {
    console.log("🚀 Running Calendar Webhook Test Suite\n");

    const testCases = [
      "What do I have today?",
      "Show me my calendar for tomorrow",
      "Schedule a meeting with the team at 2pm",
      "Am I free this afternoon?",
      "Cancel my 3pm appointment",
      "What meetings do I have next week?",
    ];

    for (const testCase of testCases) {
      console.log(`\n📝 Testing: "${testCase}"`);
      const result = await this.testCalendarMessage(testCase);
      
      if (result.success) {
        console.log(`✅ Success (${result.responseTime}ms)`);
        console.log(`📄 Response: ${JSON.stringify(result.response, null, 2)}`);
      } else {
        console.log(`❌ Failed: ${result.error} (${result.responseTime}ms)`);
      }
      
      // Wait 1 second between tests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log("\n🏁 Test suite completed!");
  }

  // Test CORS specifically
  static async testCORS(): Promise<TestWebhookResponse> {
    console.log("🌐 Testing CORS configuration...");
    
    return this.testCalendarMessage("CORS test - show me today's events");
  }
} 