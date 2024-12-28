import axios from 'axios';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeImage(imageUrl: string, prompt: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: "You are a computer analyzing images. Provide detailed metadata including objects, categories, and any relevant measurements or details. Format response as JSON."
        },
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Image analysis error:", error);
    return null;
  }
}

export async function fetchFileBytes(fileUrl: string) {
  try {
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    return response.data;
  } catch (error) {
    throw error;
  }
}
