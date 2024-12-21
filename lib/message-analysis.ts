import { Message } from "@prisma/client";
import { MessageWithMemberWithProfile } from "@/types";
import { analyzeLLM } from "./llm-provider";

export async function analyzeMessage(
  currentMessage: Message,
  previousMessages: MessageWithMemberWithProfile[] | any[],
  contextualPrompt?: string
): Promise<string> {
  try {
    // Format the messages for analysis
    const formattedMessages = previousMessages.map((msg) => ({
      role: msg.role || "user",
      content: msg.content,
      author: msg.member?.profile?.name || "Unknown",
      timestamp: msg.createdAt,
    }));

    // Create the analysis prompt
    const prompt = `
      Current message to analyze: ${currentMessage.content}
      
      Previous messages:
      ${formattedMessages
        .map(
          (msg) =>
            `[${new Date(msg.timestamp).toLocaleString()}] ${msg.author}: ${
              msg.content
            }`
        )
        .join("\n")}
    `;

    // Pass both the prompt and contextual information to the LLM
    return await analyzeLLM(prompt, contextualPrompt);
  } catch (error) {
    console.error("Error analyzing message:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }
    return currentMessage.content;
  }
}
