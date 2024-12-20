import axios from "axios";
import toast from "react-hot-toast";

// Add debug logging for API key
const apiKey = process.env.OPENAI_API_KEY;
console.log("OpenAI API Key format check:", {
  length: apiKey?.length,
  prefix: apiKey?.substring(0, 8),
  isDefined: !!apiKey,
});

const MAX_PAYLOAD_SIZE = 20000000; // 20MB, OpenAI's limit
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

export async function analyzeImage(
  imageUrl: string | null,
  prompt: string
): Promise<string> {
  if (!imageUrl) {
    console.error("No image provided for analysis.");
    return "No image provided for analysis.";
  }

  const currentKey = process.env.OPENAI_API_KEY;
  console.log("Current API key in function:", {
    length: currentKey?.length,
    prefix: currentKey?.substring(0, 8),
    isDefined: !!currentKey,
  });

  if (!currentKey) {
    console.error("OpenAI API key is not configured");
    return "Image analysis is not available at the moment.";
  }

  try {
    console.log("Attempting OpenAI API call with model: gpt-4o-mini");
    console.log("Image URL:", imageUrl);

    // Verify image URL is accessible
    try {
      const response = await axios.head(imageUrl);
      const contentType = response.headers["content-type"];
      if (!contentType?.startsWith("image/")) {
        throw new Error("URL does not point to a valid image");
      }
    } catch (error) {
      console.error("Error verifying image URL:", error);
      return "Unable to access the image. Please ensure it is publicly accessible.";
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
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
                  detail: "low",
                },
              },
            ],
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentKey}`,
        },
      }
    );

    if (!response.data.choices?.[0]?.message?.content) {
      throw new Error("No analysis generated");
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error analyzing image:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
      if ("response" in error) {
        // @ts-ignore
        console.error("API Response:", error.response?.data);
      }
    }
    return "Failed to analyze image. Please try again later.";
  }
}

export async function fetchFileBytes(fileUrl: string) {
  const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
  return response.data;
}
