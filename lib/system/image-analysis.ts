import axios from "axios";

export async function analyzeImage(imageUrl: string, prompt: string) {
  try {
    const messages = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this image and return a JSON object with:
              - description: detailed description
              - objects: array of identified objects
              - categories: ["food_journal", "expense_tracker", "home_inventory"]
              - metadata: any extracted location or timestamp data
              Context: ${prompt}`,
          },
          {
            type: "image_url",
            image_url: { url: imageUrl },
          },
        ],
      },
    ];

    const response = await axios.post(
      `${process.env.GROQ_BASE_URL}/chat/completions`,
      {
        model: process.env.MODEL_VISION || "llama-3.2-11b-vision-preview",
        messages,
        max_tokens: 1000,
        temperature: 0.5,
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
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
