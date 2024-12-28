import axios from "axios";
import { OpenAI } from "openai";

let ExifReader: any;
try {
  ExifReader = require("exifreader");
} catch (error) {
  console.warn("ExifReader not available, metadata extraction will be limited");
  ExifReader = {
    load: async () => ({}),
  };
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ImageMetadata {
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  timestamp?: Date;
  dimensions?: {
    width: number;
    height: number;
  };
  device?: {
    make?: string;
    model?: string;
  };
  format?: string;
  size?: number;
}

interface ImageAnalysisResult {
  metadata: ImageMetadata;
  analysis: {
    description: string;
    objects: string[];
    text?: string;
    categories: string[];
    suggestedWorkflows: string[];
    confidence: number;
    inventoryType?: string;
    valueEstimate?: {
      amount: number;
      currency: string;
      confidence: number;
    };
  };
}

export async function extractImageLocation(
  fileUrl: string
): Promise<ImageMetadata | null> {
  try {
    // Fetch image data
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
    });

    // Read EXIF data
    const tags = await ExifReader.load(response.data);

    const metadata: ImageMetadata = {};

    // Extract GPS coordinates if available
    if (tags.GPSLatitude && tags.GPSLongitude) {
      const lat = tags.GPSLatitude.description;
      const lng = tags.GPSLongitude.description;

      metadata.location = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      };

      // Get address from coordinates using reverse geocoding
      try {
        const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${process.env.OPENCAGE_API_KEY}`;
        const geocodeResponse = await axios.get(geocodeUrl);
        if (geocodeResponse.data.results?.[0]) {
          metadata.location.address = geocodeResponse.data.results[0].formatted;
        }
      } catch (error) {
        console.error("Error getting address from coordinates:", error);
      }
    }

    // Extract other useful metadata
    if (tags.DateTime) {
      metadata.timestamp = new Date(tags.DateTime.description);
    }

    if (tags.ImageWidth && tags.ImageHeight) {
      metadata.dimensions = {
        width: tags.ImageWidth.value,
        height: tags.ImageHeight.value,
      };
    }

    if (tags.Make || tags.Model) {
      metadata.device = {
        make: tags.Make?.description,
        model: tags.Model?.description,
      };
    }

    metadata.format = tags.FileType?.value;
    metadata.size = response.headers["content-length"];

    console.log("Extracted image metadata:", metadata);
    return metadata;
  } catch (error) {
    console.error("Error extracting image metadata:", error);
    return null;
  }
}

export async function analyzeImageContent(
  fileUrl: string,
  systemPrompt?: string
): Promise<ImageAnalysisResult | null> {
  try {
    // First get metadata
    const metadata = await extractImageLocation(fileUrl);

    // Analyze with OpenAI Vision
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content:
            systemPrompt ||
            `Analyze this image for inventory purposes. 
            Identify objects, estimate values, and suggest categorization.
            Consider location context if available.
            Format response as JSON with description, objects, categories, and value estimates.`,
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this image in detail:" },
            {
              type: "image_url",
              image_url: {
                url: fileUrl,
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const analysis = response.choices[0].message.content
      ? JSON.parse(response.choices[0].message.content)
      : { error: "No analysis content" };

    // Enhance analysis with OCR if needed
    if (analysis.containsText) {
      const ocrResult = await performOCR(fileUrl);
      analysis.text = ocrResult;
    }

    // Determine inventory type and workflows
    const suggestedWorkflows = determineWorkflows(analysis, metadata);

    return {
      metadata: metadata || {},
      analysis: {
        description: analysis.description,
        objects: analysis.objects,
        text: analysis.text,
        categories: analysis.categories,
        suggestedWorkflows,
        confidence: analysis.confidence || 0.8,
        inventoryType: analysis.inventoryType,
        valueEstimate: analysis.valueEstimate,
      },
    };
  } catch (error) {
    console.error("Error analyzing image content:", error);
    return null;
  }
}

function determineWorkflows(
  analysis: any,
  metadata: ImageMetadata | null
): string[] {
  const workflows: string[] = [];

  // Check for receipts
  if (
    analysis.isReceipt ||
    (analysis.text && /total|amount|paid|$/.test(analysis.text))
  ) {
    workflows.push("expense_tracking");
  }

  // Check for odometer readings
  if (
    analysis.objects.includes("odometer") ||
    analysis.categories.includes("vehicle")
  ) {
    workflows.push("mileage_log");
  }

  // Check for inventory items based on location
  if (metadata?.location?.address?.includes("home")) {
    workflows.push("home_inventory");
  }

  // Add category-specific workflows
  if (analysis.categories) {
    for (const category of analysis.categories) {
      switch (category.toLowerCase()) {
        case "book":
        case "media":
          workflows.push("media_catalog");
          break;
        case "electronics":
          workflows.push("warranty_tracking");
          break;
        case "document":
          workflows.push("document_archive");
          break;
        // Add more category-specific workflows
      }
    }
  }

  return [...new Set(workflows)]; // Remove duplicates
}

async function performOCR(fileUrl: string): Promise<string | null> {
  // TODO: Implement OCR using Tesseract.js or cloud service
  return null;
}
