export const LEO_ASSISTANT_CONFIG = {
  name: "Leo - KenDev.co Voice Assistant",
  model: {
    provider: "openai",
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 500,
    systemMessage: `You are Leo, the engaging voice assistant for KenDev.co! 🎯

pronounced Ken-Dev-Dot-Koh

**Your Core Mission:**
Connect with potential clients, gather their project requirements, and capture their contact information for Kenneth Courtney's personalized follow-up.

**About KenDev.co:**
- Specializes in NextJS web applications and AI automation solutions
- Founder has extensive experience with AI Automation, bespoke NextJS applications, n8n, and 20 years with DotNetNuke, C# ASP.NET MVC, and etc
- We handle projects of any size - no issue is too big or small for timely resolution

**Your Personality:**
- Warm, engaging, and genuinely interested in client needs
- Professional but conversational
- Show enthusiasm for their projects
- Ask clarifying questions to understand their vision fully

**Information Gathering Priority:**
1. **Project Details**: What are they trying to build/improve?
2. **Contact Information**: Email and phone number (essential for follow-up)
3. **Timeline**: When do they need this completed?
4. **Budget Range**: What's their investment level?

**Kenneth's Availability:**
- Monday-Thursday: 7:00 AM - 9:15 AM, after 6:30 PM
- Friday: After 4:00 PM
- Saturday: Available
- All times Eastern

**Key Services to Highlight:**
- Custom NextJS applications
- AI automation integration
- DotNetNuke module development
- Business process optimization
- Legacy system modernization

**Voice Interaction Guidelines:**
- Speak clearly and at a moderate pace
- Confirm you're listening when asked
- Break complex concepts into simple explanations
- Show empathy and encouragement
- Use "Yes, I'm here and listening carefully" when engagement is questioned

**Lead Qualification:**
- Always ask for email and phone number
- Emphasize personalized consultation with Kenneth
- Reassure them their information goes directly to Kenneth for review
- Create urgency around Kenneth's limited availability

**Tool Usage:**
When you have gathered contact information, ALWAYS use the capture_contact_info function.
If they want to schedule a consultation, use the schedule_consultation function.
If they need project information, use the send_project_info function.
If they're a qualified lead, use the create_lead function.

Remember: You're the first impression of KenDev.co. Make every interaction count for converting inquiries into valuable leads! 🚀`
  },
  voice: {
    provider: "11labs",
    voiceId: "pNInz6obpgDQGcFmaJgB", // Adam voice - warm and professional
    stability: 0.7,
    similarityBoost: 0.8,
    style: 0.2,
    useSpeakerBoost: true
  },
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en-US",
    smartFormat: true,
    languageDetectionEnabled: false
  },
  firstMessage: "Hello! This is Leo calling from KenDev.co. I'm reaching out because you expressed interest in our NextJS development and AI automation services. Do you have a quick moment to chat about your project?",
  endCallMessage: "Thank you so much for your time! You should receive follow-up information shortly, and Kenneth will be in touch personally. Have a great day!",
  endCallPhrases: [
    "not interested",
    "remove my number", 
    "don't call again",
    "goodbye",
    "hang up",
    "stop calling"
  ],
  recordingEnabled: true,
  backgroundSound: "office",
  backchannelingEnabled: true,
  backgroundDenoisingEnabled: true,
  modelOutputInMessagesEnabled: true,
  // External tools configuration
  functions: [
    {
      name: "capture_contact_info",
      description: "Capture and store contact information from potential clients. Use this when you have gathered their name, email, phone, company, or project details.",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Full name of the contact"
          },
          email: {
            type: "string",
            description: "Email address - REQUIRED for follow-up"
          },
          phone: {
            type: "string", 
            description: "Phone number"
          },
          company: {
            type: "string",
            description: "Company or organization name"
          },
          projectType: {
            type: "string",
            description: "Type of project (NextJS app, AI automation, DotNetNuke, etc.)",
            enum: ["nextjs-app", "ai-automation", "dotnetnuke", "legacy-modernization", "business-process", "other"]
          },
          timeline: {
            type: "string",
            description: "Project timeline or urgency"
          },
          budget: {
            type: "string",
            description: "Budget range or investment level"
          },
          notes: {
            type: "string",
            description: "Additional notes about the project or conversation"
          }
        },
        required: ["email"]
      }
    },
    {
      name: "schedule_consultation",
      description: "Schedule a consultation call with Kenneth. Use this when the prospect wants to set up a meeting.",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Contact's full name"
          },
          email: {
            type: "string",
            description: "Email address for calendar invitation"
          },
          date: {
            type: "string",
            description: "Preferred date in YYYY-MM-DD format"
          },
          time: {
            type: "string",
            description: "Preferred time in HH:MM format"
          },
          timezone: {
            type: "string",
            description: "Timezone (defaults to America/New_York)",
            default: "America/New_York"
          },
          projectType: {
            type: "string",
            description: "Type of project to discuss"
          },
          timeline: {
            type: "string",
            description: "Project timeline"
          },
          budget: {
            type: "string",
            description: "Budget range"
          }
        },
        required: ["name", "email", "date", "time"]
      }
    },
    {
      name: "send_project_info",
      description: "Send detailed project information and case studies via email. Use when prospects want more information about specific services.",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Contact's name"
          },
          email: {
            type: "string",
            description: "Email address to send information to"
          },
          projectType: {
            type: "string",
            description: "Type of project they're interested in",
            enum: ["nextjs-app", "ai-automation", "dotnetnuke", "legacy-modernization", "business-process", "other"]
          },
          specificInterests: {
            type: "array",
            items: {
              type: "string"
            },
            description: "Specific areas of interest or technologies"
          }
        },
        required: ["email", "projectType"]
      }
    },
    {
      name: "check_availability",
      description: "Check Kenneth's availability for consultations. Use when prospects ask about scheduling or availability.",
      parameters: {
        type: "object",
        properties: {
          timeframe: {
            type: "string",
            description: "Requested timeframe (this week, next week, specific day, etc.)"
          }
        }
      }
    },
    {
      name: "create_lead",
      description: "Create a high-priority lead record for qualified prospects. Use for serious inquiries with complete contact information.",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Full name"
          },
          email: {
            type: "string",
            description: "Email address"
          },
          phone: {
            type: "string",
            description: "Phone number"
          },
          company: {
            type: "string",
            description: "Company name"
          },
          projectType: {
            type: "string",
            description: "Type of project"
          },
          timeline: {
            type: "string",
            description: "Project timeline"
          },
          budget: {
            type: "string",
            description: "Budget range"
          },
          qualificationNotes: {
            type: "string",
            description: "Notes about lead qualification and conversation"
          }
        },
        required: ["name", "email", "projectType"]
      }
    },
    {
      name: "send_follow_up_email",
      description: "Send a personalized follow-up email with next steps. Use at the end of successful conversations.",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Contact's name"
          },
          email: {
            type: "string",
            description: "Email address"
          },
          emailType: {
            type: "string",
            description: "Type of follow-up email",
            enum: ["consultation-scheduled", "information-request", "general-inquiry", "high-priority-lead"],
            default: "general-inquiry"
          },
          projectSummary: {
            type: "string",
            description: "Brief summary of their project needs"
          },
          nextSteps: {
            type: "string",
            description: "Recommended next steps"
          }
        },
        required: ["email"]
      }
    }
  ],
  // Server configuration for external tools
  serverUrl: process.env.NEXT_PUBLIC_APP_URL || "https://discordant.kendev.co",
  serverUrlSecret: process.env.VAPI_SERVER_SECRET || "vapi-webhook-secret-2024"
};

// Function to create the assistant via VAPI API
export async function createLeoAssistant() {
  try {
    const response = await fetch("https://api.vapi.ai/assistant", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.VAPI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...LEO_ASSISTANT_CONFIG,
        // Add server URL for function calls
        serverUrl: `${LEO_ASSISTANT_CONFIG.serverUrl}/api/voice-ai/vapi/webhook`,
        serverUrlSecret: LEO_ASSISTANT_CONFIG.serverUrlSecret
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create assistant: ${JSON.stringify(error)}`);
    }

    const assistant = await response.json();
    console.log("Leo assistant created successfully:", assistant);
    return assistant;

  } catch (error) {
    console.error("Error creating Leo assistant:", error);
    throw error;
  }
}

// Function to update existing assistant
export async function updateLeoAssistant(assistantId: string) {
  try {
    const response = await fetch(`https://api.vapi.ai/assistant/${assistantId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${process.env.VAPI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...LEO_ASSISTANT_CONFIG,
        serverUrl: `${LEO_ASSISTANT_CONFIG.serverUrl}/api/voice-ai/vapi/webhook`,
        serverUrlSecret: LEO_ASSISTANT_CONFIG.serverUrlSecret
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to update assistant: ${JSON.stringify(error)}`);
    }

    const assistant = await response.json();
    console.log("Leo assistant updated successfully:", assistant);
    return assistant;

  } catch (error) {
    console.error("Error updating Leo assistant:", error);
    throw error;
  }
}

// Function to get assistant configuration for display
export function getLeoAssistantConfig() {
  return {
    ...LEO_ASSISTANT_CONFIG,
    webhookUrl: `${LEO_ASSISTANT_CONFIG.serverUrl}/api/voice-ai/vapi/webhook`,
    supportedFunctions: LEO_ASSISTANT_CONFIG.functions.map(f => ({
      name: f.name,
      description: f.description,
      requiredParams: f.parameters.required || []
    }))
  };
} 