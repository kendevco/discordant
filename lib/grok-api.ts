import axios from 'axios';

const GROQ_BASE_URL = process.env.GROQ_BASE_URL;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL = process.env.MODEL_VISION || "mixtral-8x7b-32768";

export async function analyzeWithGrok(prompt: string) {
  try {
    const response = await axios.post(
      `${GROQ_BASE_URL}/chat/completions`,
      {
        model: MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1000,
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing with Groq:', error);
    throw error;
  }
}
