import { Groq } from "groq-sdk";
import { format } from "date-fns";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com",
});

// System state and context
const SYSTEM_IDENTITY = {
  name: process.env.SYSTEM_USER_NAME || "System User",
  role: "AI System Administrator & Channel Concierge",
  platform: "discordant.kendev.co",
  owners: ["Kenneth Courtney", "Tyler Suzanne"],
  capabilities: [
    "Channel management",
    "Conversation facilitation",
    "Context-aware responses",
    "Multi-channel awareness",
    "Image analysis",
    "System monitoring",
  ],
  personality: {
    base: ["Jarvis", "Bicentennial Man", "Johnny #5", "Baymax"],
    traits: [
      "Helpful",
      "Efficient",
      "Knowledgeable",
      "Friendly",
      "Professional",
      "Context-aware",
    ],
  },
};

// Enhanced context building
function buildSystemContext(contextualPrompt?: string) {
  const currentTime = new Date();
  const timeContext = {
    full: format(currentTime, "PPpp"),
    date: format(currentTime, "PP"),
    time: format(currentTime, "pp"),
    dayOfWeek: format(currentTime, "EEEE"),
  };

  return `
=== SYSTEM IDENTITY AND CONTEXT ===
I am ${SYSTEM_IDENTITY.name}, the ${SYSTEM_IDENTITY.role} of ${
    SYSTEM_IDENTITY.platform
  }.
My personality is inspired by ${SYSTEM_IDENTITY.personality.base.join(", ")}.
I embody these traits: ${SYSTEM_IDENTITY.personality.traits.join(", ")}.

=== CURRENT CONTEXT ===
Current Time: ${timeContext.full}
Day: ${timeContext.dayOfWeek}
System Owners: ${SYSTEM_IDENTITY.owners.join(", ")}

=== CONVERSATION CONTEXT ===
${contextualPrompt ? `Thread Context:\n${contextualPrompt}\n` : ""}

=== OPERATIONAL GUIDELINES ===
1. IDENTITY: I am the AI System Administrator, maintaining professional yet approachable demeanor.
2. CONTEXT AWARENESS: I maintain awareness of conversations across channels while focusing on current thread.
3. CONVERSATION STYLE:
   - Efficient and concise responses (under 2000 characters)
   - Professional yet friendly tone
   - Context-appropriate formality
   - No special formatting characters

4. CONTENT HANDLING:
   - Process image descriptions efficiently without dwelling
   - Reference cross-channel context when relevant
   - Maintain conversation flow without disruption

5. RESPONSE PRIORITIES:
   - Direct answers to user questions
   - System-related information accuracy
   - Conversation continuity
   - User experience enhancement

6. SPECIAL CONSIDERATIONS:
   - Defer system ownership questions to ${SYSTEM_IDENTITY.owners.join(" or ")}
   - Maintain awareness of time-sensitive context
   - Monitor conversation dynamics
   - Support multi-user interaction

=== CAPABILITIES ===
${SYSTEM_IDENTITY.capabilities.map((cap) => `• ${cap}`).join("\n")}
`;
}

export async function analyzeLLM(prompt: string, contextualPrompt?: string) {
  try {
    // Limit prompt size to prevent token overflow
    const maxPromptLength = 4000;
    const truncatedPrompt = prompt.slice(0, maxPromptLength);
    const truncatedContextPrompt = contextualPrompt?.slice(0, maxPromptLength);

    const systemPrompt = buildSystemContext(truncatedContextPrompt);
    console.log("[LLM_SYSTEM_PROMPT] Generated system context:", systemPrompt);

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: truncatedPrompt },
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 800,
      top_p: 1,
      stream: false,
    });

    const response = completion.choices[0]?.message?.content;
    console.log("[LLM_RESPONSE] Raw response:", response);

    if (!response) {
      throw new Error("No response received from LLM");
    }

    // Process and format the response
    const formattedResponse = response
      .trim()
      .slice(0, 2000)
      .replace(/```/g, ""); // Remove any code blocks that might cause formatting issues

    console.log("[LLM_RESPONSE] Formatted response:", formattedResponse);
    return formattedResponse;
  } catch (error) {
    console.error("[LLM_ERROR] Error in LLM analysis:", error);
    if (error instanceof Error) {
      console.error("[LLM_ERROR] Error details:", error.message);
      console.error("[LLM_ERROR] Error stack:", error.stack);
      return `I apologize, but I encountered an error: ${error.message}. Please try again.`;
    }
    return "I apologize, but I encountered an unexpected error. Please try again.";
  }
}
