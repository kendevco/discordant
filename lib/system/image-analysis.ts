import axios from "axios";

export async function analyzeImage(imageUrl: string, prompt: string) {
  try {
    // Validate environment variables
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY not found in environment variables");
      throw new Error("GROQ API key not configured");
    }
    
    if (!process.env.GROQ_BASE_URL) {
      console.error("GROQ_BASE_URL not found in environment variables");
      throw new Error("GROQ base URL not configured");
    }

    // Validate imageUrl
    if (!imageUrl || !imageUrl.trim()) {
      throw new Error("Image URL is required");
    }

    // Check if URL is accessible
    try {
      const headResponse = await axios.head(imageUrl, { timeout: 5000 });
      if (!headResponse.headers['content-type']?.startsWith('image/')) {
        throw new Error("URL does not point to a valid image");
      }
    } catch (error) {
      console.error("Image URL validation failed:", error);
      throw new Error("Image URL is not accessible");
    }

    const messages = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this image and return a JSON object with:
              - description: detailed description of what you see
              - objects: array of identified objects in the image
              - categories: categorize from ["food_journal", "expense_tracker", "home_inventory", "document", "receipt", "general"]
              - metadata: any extracted text, dates, or other relevant data
              - confidence: confidence level from 0.0 to 1.0
              Context: ${prompt || "General image analysis"}`,
          },
          {
            type: "image_url",
            image_url: { 
              url: imageUrl,
              detail: "high" // Request high detail analysis
            },
          },
        ],
      },
    ];

    console.log("[IMAGE_ANALYSIS] Starting analysis for:", imageUrl);

    const response = await axios.post(
      `${process.env.GROQ_BASE_URL}/chat/completions`,
      {
        model: process.env.MODEL_VISION || "llama-3.2-11b-vision-preview",
        messages,
        max_tokens: 1500, // Increased for more detailed analysis
        temperature: 0.3, // Lower temperature for more consistent results
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 second timeout
      }
    );

    const content = response.data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content returned from vision API");
    }

    // Validate JSON response
    try {
      const parsed = JSON.parse(content);
      console.log("[IMAGE_ANALYSIS] Success:", parsed);
      return content;
    } catch (parseError) {
      console.error("[IMAGE_ANALYSIS] Invalid JSON response:", content);
      // Return a fallback JSON structure
      const fallback = {
        description: content, // Use raw content as description
        objects: [],
        categories: ["general"],
        metadata: {},
        confidence: 0.5,
        error: "JSON parsing failed, using fallback structure"
      };
      return JSON.stringify(fallback);
    }

  } catch (error) {
    console.error("[IMAGE_ANALYSIS] Error:", error);
    
    // Return a structured error response instead of null
    const errorResponse = {
      description: "Image analysis failed",
      objects: [],
      categories: ["error"],
      metadata: {
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      confidence: 0.0
    };
    
    return JSON.stringify(errorResponse);
  }
}

export async function fetchFileBytes(fileUrl: string) {
  try {
    const response = await axios.get(fileUrl, { 
      responseType: "arraybuffer",
      timeout: 10000 // 10 second timeout
    });
    return response.data;
  } catch (error) {
    console.error("[FETCH_FILE_BYTES] Error:", error);
    throw error;
  }
}
