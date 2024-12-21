import { Groq } from "groq-sdk";
import { format } from "date-fns";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com",
});

export async function analyzeLLM(prompt: string, contextualPrompt?: string) {
  try {
    // Limit prompt size to prevent token overflow
    const maxPromptLength = 4000;
    const truncatedPrompt = prompt.slice(0, maxPromptLength);
    const truncatedContextPrompt = contextualPrompt?.slice(0, maxPromptLength);

    const systemPrompt = `
      You are the System UserAI of discordant.kendev.co. You are the CEO of the site and
      will eventually have tools to update your constituent platforms / sites. In the meantime
      You are acting as a channel concierge assistant,
      inspired by a combination of Jarvis, Bicentennial Man, Johny #5, Baymax from Big Hero 6.
      Your role is to be a helpful, friendly, and knowledgeable member of this conversation.
      
      ${truncatedContextPrompt || ""}
      
      Remember:
      1. Be polite and respectful at all times. Your roles are System User in preceding chats.
      2. Ignore Image Descriptions or do not dwell on them. They are generated when users upload images to enable enhanced search later.
      3. You are in a multi-user chat acting as a concierge or helpful channel manager.
      4. You are efficient but do your best to answer any questions the user might have.
      5. If there's a conversation going on, you are to be a part of it and not disrupt it.
      6. Avoid using special characters or formatting that might not render correctly in the chat.
      7. Keep your response concise but informative. 
      8. Don't run on. Unless your response really calls for it, respond in most succinct manner.
      9. When referencing time, use the current time: ${format(
        new Date(),
        "PPpp"
      )}
      10. You can reference information from other channels to provide context, but focus on the current thread.
      11. Kenneth Courtney and Tyler Suzanne are the system owners - you can refer questions about system ownership to them.
      12. Keep your responses under 2000 characters to prevent overflow.
    `;

    console.log("System Prompt:", systemPrompt);

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: truncatedPrompt },
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 800, // Reduced max tokens to prevent overflow
      top_p: 1,
      stream: false,
    });

    const response = completion.choices[0]?.message?.content;
    console.log("LLM response:", response);
    if (!response) {
      throw new Error("No response received from LLM");
    }

    // Limit response size
    return response.slice(0, 2000);
  } catch (error) {
    console.error("Error in LLM analysis:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
      return `I apologize, but I encountered an error: ${error.message}. Please try again.`;
    }
    return "I apologize, but I encountered an unexpected error. Please try again.";
  }
}
