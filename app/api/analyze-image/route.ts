import { NextRequest, NextResponse } from "next/server";

const IMAGE_ANALYSIS_PROMPT =
  "Analyze the following image and provide a detailed description of its contents, including any text, objects, people, or notable features:";

export async function POST(req: NextRequest) {
  console.log("Image analysis request received");

  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;
    const instructions = formData.get('instructions') as string;

    if (!image || !instructions) {
      console.error("No image or instructions provided");
      return NextResponse.json(
        { error: "No image or instructions provided" },
        { status: 400 }
      );
    }

    // Convert the image to base64
    const imageBuffer = await image.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const mimeType = image.type;
    const dataURI = `data:${mimeType};base64,${base64Image}`;

    console.log("Sending request to Groq API");
    const response = await fetch(
      `${process.env.GROQ_BASE_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.MODEL_VISION || "mixtral-8x7b-32768",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `${IMAGE_ANALYSIS_PROMPT}\n\nExplain user provided image. User Provided instructions: ${instructions}`,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: dataURI,
                  },
                },
              ],
            },
          ],
          max_tokens: 1000,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API error:", errorData);
      return NextResponse.json(
        { error: "Image analysis failed", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;
    console.log("Analysis received:", analysis);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Error during image analysis:", error);
    return NextResponse.json(
      {
        error: "Image analysis failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
