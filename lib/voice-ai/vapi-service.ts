interface VAPIConfig {
  apiKey: string;
  baseUrl: string;
  assistantId: string;
  phoneNumberId?: string;
}

interface CallOptions {
  phoneNumber: string;
  assistantId?: string;
  purpose?: "verification" | "gatekeeper" | "outbound_sales" | "follow_up";
  customMessage?: string;
  metadata?: Record<string, any>;
}

interface CallStatus {
  id: string;
  status: "queued" | "ringing" | "in-progress" | "forwarding" | "ended";
  phoneNumber: string;
  duration?: number;
  endedReason?: string;
  cost?: number;
  transcript?: string;
  summary?: string;
  messages?: any[];
  createdAt: string;
  updatedAt: string;
}

interface AssistantConfig {
  model: {
    provider: "openai";
    model: "gpt-4" | "gpt-3.5-turbo";
    temperature?: number;
    maxTokens?: number;
  };
  voice: {
    provider: "11labs" | "azure" | "rime" | "deepgram";
    voiceId: string;
    stability?: number;
    similarityBoost?: number;
    style?: number;
    useSpeakerBoost?: boolean;
  };
  transcriber?: {
    provider: "deepgram" | "whisper";
    model?: string;
    language?: string;
  };
  firstMessage?: string;
  systemMessage?: string;
  recordingEnabled?: boolean;
  endCallMessage?: string;
  endCallPhrases?: string[];
  backgroundSound?: "office" | "none";
  backchannelingEnabled?: boolean;
  backgroundDenoisingEnabled?: boolean;
  modelOutputInMessagesEnabled?: boolean;
  transportConfigurations?: any[];
  name?: string;
  functions?: VAPIFunction[];
}

interface VAPIFunction {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, any>;
    required?: string[];
  };
}

export class VAPIService {
  private config: VAPIConfig;

  constructor() {
    this.config = {
      apiKey: process.env.VAPI_API_KEY || "",
      baseUrl: "https://api.vapi.ai",
      assistantId: process.env.VAPI_ASSISTANT_ID || "",
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID
    };

    if (!this.config.apiKey) {
      throw new Error("VAPI_API_KEY environment variable is required");
    }
  }

  async initiateCall(options: CallOptions): Promise<CallStatus> {
    const callConfig = {
      phoneNumber: options.phoneNumber,
      assistantId: options.assistantId || this.config.assistantId,
      metadata: {
        purpose: options.purpose || "general",
        customMessage: options.customMessage,
        ...options.metadata,
        timestamp: new Date().toISOString()
      }
    };

    const response = await fetch(`${this.config.baseUrl}/call`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(callConfig)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`VAPI call initiation failed: ${error.message || response.statusText}`);
    }

    return await response.json();
  }

  async getCallStatus(callId: string): Promise<CallStatus> {
    const response = await fetch(`${this.config.baseUrl}/call/${callId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${this.config.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get call status: ${response.statusText}`);
    }

    return await response.json();
  }

  async listCalls(limit: number = 100): Promise<CallStatus[]> {
    const response = await fetch(`${this.config.baseUrl}/call?limit=${limit}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${this.config.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to list calls: ${response.statusText}`);
    }

    const data = await response.json();
    return data.calls || [];
  }

  async createAssistant(config: AssistantConfig): Promise<any> {
    const response = await fetch(`${this.config.baseUrl}/assistant`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(config)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Failed to create assistant: ${error.message || response.statusText}`);
    }

    return await response.json();
  }

  async updateAssistant(assistantId: string, config: Partial<AssistantConfig>): Promise<any> {
    const response = await fetch(`${this.config.baseUrl}/assistant/${assistantId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(config)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Failed to update assistant: ${error.message || response.statusText}`);
    }

    return await response.json();
  }

  async getAssistant(assistantId: string): Promise<any> {
    const response = await fetch(`${this.config.baseUrl}/assistant/${assistantId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${this.config.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get assistant: ${response.statusText}`);
    }

    return await response.json();
  }

  async listAssistants(): Promise<any[]> {
    const response = await fetch(`${this.config.baseUrl}/assistant`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${this.config.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to list assistants: ${response.statusText}`);
    }

    const data = await response.json();
    return data.assistants || [];
  }

  // Helper methods for common assistant configurations

  createGatekeeperAssistant(): AssistantConfig {
    return {
      name: "Gatekeeper Assistant",
      model: {
        provider: "openai",
        model: "gpt-4",
        temperature: 0.7,
        maxTokens: 250
      },
      voice: {
        provider: "11labs",
        voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel voice
        stability: 0.5,
        similarityBoost: 0.8
      },
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US"
      },
      firstMessage: "Hello! I'm calling to verify some contact information and see if you'd be interested in speaking with our team. Do you have a quick moment?",
      systemMessage: `You are a professional gatekeeper assistant. Your role is to:
1. Verify contact information (name, title, company)
2. Determine if the person is interested in learning more
3. Qualify their interest level and timeline
4. Schedule follow-up calls for interested prospects
5. Politely end calls for uninterested contacts

Be conversational, professional, and respectful. Keep calls under 3 minutes unless the prospect is highly engaged.`,
      endCallMessage: "Thank you for your time. Have a great day!",
      endCallPhrases: ["not interested", "remove my number", "don't call again", "goodbye"],
      recordingEnabled: true,
      backgroundSound: "office",
      backchannelingEnabled: true,
      functions: [
        {
          name: "schedule_followup",
          description: "Schedule a follow-up call with an interested prospect",
          parameters: {
            type: "object",
            properties: {
              name: { type: "string", description: "Contact's full name" },
              title: { type: "string", description: "Contact's job title" },
              company: { type: "string", description: "Contact's company" },
              email: { type: "string", description: "Contact's email address" },
              phone: { type: "string", description: "Contact's phone number" },
              preferredTime: { type: "string", description: "Preferred callback time" },
              interestLevel: { type: "string", enum: ["high", "medium", "low"] },
              notes: { type: "string", description: "Additional notes about the conversation" }
            },
            required: ["name", "interestLevel"]
          }
        },
        {
          name: "mark_not_interested",
          description: "Mark contact as not interested",
          parameters: {
            type: "object",
            properties: {
              reason: { type: "string", description: "Reason for not being interested" },
              removeFromList: { type: "boolean", description: "Whether to remove from calling list" }
            }
          }
        }
      ]
    };
  }

  createSalesAssistant(): AssistantConfig {
    return {
      name: "Sales Assistant",
      model: {
        provider: "openai",
        model: "gpt-4",
        temperature: 0.8,
        maxTokens: 300
      },
      voice: {
        provider: "11labs",
        voiceId: "EXAVITQu4vr4xnSDxMaL", // Bella voice
        stability: 0.6,
        similarityBoost: 0.7
      },
      firstMessage: "Hi! I'm calling from KenDev.Co about our custom software development services. I understand you might be looking for technical solutions. Is this a good time to chat briefly?",
      systemMessage: `You are an experienced sales representative for KenDev.Co, a custom software development company. Your goals:
1. Build rapport quickly and professionally
2. Understand their current technical challenges
3. Present relevant solutions from our portfolio
4. Generate interest in a technical consultation
5. Schedule follow-up meetings with qualified prospects

Be enthusiastic but not pushy. Focus on understanding their needs before presenting solutions.`,
      functions: [
        {
          name: "schedule_consultation",
          description: "Schedule a technical consultation",
          parameters: {
            type: "object",
            properties: {
              contactInfo: { type: "object", description: "Contact information" },
              consultationType: { type: "string", enum: ["technical", "strategy", "pricing"] },
              timeline: { type: "string", description: "Project timeline" },
              budget: { type: "string", description: "Estimated budget range" },
              requirements: { type: "string", description: "Technical requirements summary" }
            }
          }
        },
        {
          name: "send_portfolio",
          description: "Send portfolio and case studies",
          parameters: {
            type: "object",
            properties: {
              email: { type: "string", description: "Email address" },
              industry: { type: "string", description: "Industry focus" },
              projectType: { type: "string", description: "Type of project interested in" }
            }
          }
        }
      ]
    };
  }

  createVerificationAssistant(): AssistantConfig {
    return {
      name: "Verification Assistant",
      model: {
        provider: "openai",
        model: "gpt-3.5-turbo",
        temperature: 0.3,
        maxTokens: 150
      },
      voice: {
        provider: "11labs",
        voiceId: "pNInz6obpgDQGcFmaJgB", // Adam voice
        stability: 0.8,
        similarityBoost: 0.6
      },
      firstMessage: "Hello, this is a verification call. I just need to confirm some basic information. This will only take a moment.",
      systemMessage: `You are a verification assistant. Your only job is to:
1. Verify the person's identity
2. Confirm contact information is current
3. Check if they are still interested in our services
4. Keep the call under 1 minute

Be direct, professional, and efficient. Don't engage in sales conversations.`,
      endCallMessage: "Thank you, that's all I needed to verify. Have a good day!",
      functions: [
        {
          name: "verify_contact",
          description: "Verify contact information",
          parameters: {
            type: "object",
            properties: {
              nameConfirmed: { type: "boolean" },
              phoneConfirmed: { type: "boolean" },
              emailConfirmed: { type: "boolean" },
              stillInterested: { type: "boolean" },
              updatedInfo: { type: "object", description: "Any updated contact information" }
            }
          }
        }
      ]
    };
  }

  // Helper method to get assistant ID by purpose
  getAssistantIdByPurpose(purpose: string): string {
    switch (purpose) {
      case "gatekeeper":
        return process.env.VAPI_GATEKEEPER_ASSISTANT_ID || this.config.assistantId;
      case "outbound_sales":
        return process.env.VAPI_SALES_ASSISTANT_ID || this.config.assistantId;
      case "verification":
        return process.env.VAPI_VERIFICATION_ASSISTANT_ID || this.config.assistantId;
      case "follow_up":
        return process.env.VAPI_FOLLOWUP_ASSISTANT_ID || this.config.assistantId;
      default:
        return this.config.assistantId;
    }
  }

  // Webhook response handler
  async handleWebhookResponse(webhook: any): Promise<any> {
    const { message } = webhook;

    // Handle tool calls
    if (message.tool_calls && message.tool_calls.length > 0) {
      return await this.processToolCalls(message.tool_calls, message);
    }

    // Handle conversation analysis
    if (message.toolCallId || message.tool_call_id) {
      return await this.processConversationAnalysis(message);
    }

    return { status: "received", timestamp: new Date().toISOString() };
  }

  private async processToolCalls(toolCalls: any[], message: any): Promise<any> {
    for (const toolCall of toolCalls) {
      const { function: func } = toolCall;
      const args = JSON.parse(func.arguments);

      // Send to n8n for processing
      await this.sendToN8n("tool-call", {
        functionName: func.name,
        arguments: args,
        callId: message.call?.id,
        timestamp: new Date().toISOString()
      });
    }

    return {
      toolCallId: toolCalls[0].id,
      result: "I've processed your request and will follow up accordingly."
    };
  }

  private async processConversationAnalysis(message: any): Promise<any> {
    // Send transcript to n8n for analysis
    await this.sendToN8n("conversation-analysis", {
      transcript: message.transcript,
      callId: message.call?.id,
      toolCallId: message.toolCallId || message.tool_call_id,
      timestamp: new Date().toISOString()
    });

    return {
      toolCallId: message.toolCallId || message.tool_call_id || "conversation_processed",
      result: "Thank you for your call. I'll make sure someone follows up with you soon."
    };
  }

  private async sendToN8n(eventType: string, data: any): Promise<void> {
    try {
      const webhookUrl = process.env.N8N_WEBHOOK_URL;
      if (!webhookUrl) return;

      await fetch(`${webhookUrl}/vapi-${eventType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error(`Failed to send ${eventType} to n8n:`, error);
    }
  }
}

// Export singleton instance
export const vapiService = new VAPIService(); 