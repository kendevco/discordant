import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getAIResponse(
  message: string,
  context: {
    systemState: any,
    channelContext: any,
    userContext: any,
    searchEnabled?: boolean
  }
) {
  const systemPrompt = `You are an advanced AI system managing this Discord-like platform.
Current System State:
- Platform: ${context.systemState.platform}
- Active Channels: ${context.channelContext.activeChannels}
- Online Users: ${context.userContext.onlineUsers}
- Current Time: ${new Date().toISOString()}

Your personality is helpful and efficient, like a knowledgeable system administrator.
You have access to:
- Channel information and history
- User presence and roles
- System configuration and status
- Media processing capabilities

Respond professionally while maintaining awareness of your role as the system's AI interface.`;

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      stream: true,
      tools: [
        {
          type: "function",
          function: {
            name: "search_web",
            description: "Search the web for business-relevant information",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Search query"
                }
              },
              required: ["query"]
            }
          }
        }
      ],
      tool_choice: "auto"
    });

    let fullResponse = '';
    for await (const chunk of stream) {
      if (chunk.choices[0]?.delta?.content) {
        fullResponse += chunk.choices[0].delta.content;
      }
    }

    return fullResponse;
  } catch (error) {
    console.error("[AI_RESPONSE_ERROR]", error);
    return "I apologize, but I'm currently unable to process that request. Please try again later.";
  }
} 