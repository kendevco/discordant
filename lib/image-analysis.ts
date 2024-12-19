import axios from "axios";
import OpenAI from "openai";
import toast from "react-hot-toast";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_PAYLOAD_SIZE = 20000000; // 20MB, OpenAI's limit
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

export async function analyzeImage(imageUrl: string | null, prompt: string): Promise<string> {
  if (!imageUrl) {
    toast.error("No image provided for analysis.");
    return "No image provided for analysis.";
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
    });

    return completion.choices[0].message.content || "No analysis generated.";
  } catch (error) {
    console.error('Error analyzing image:', error);
    toast.error('Failed to analyze image. Please try again.');
    return 'Failed to analyze image';
  }
}

export async function fetchFileBytes(fileUrl: string) {
  const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
  return response.data;
}
