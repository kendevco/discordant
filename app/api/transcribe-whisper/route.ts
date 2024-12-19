import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';

// Add Groq import
import { Groq } from 'groq-sdk';

// Update configuration
const AI_PROVIDER = process.env.AI_PROVIDER || 'openai';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const LOCAL_BASE_URL = process.env.LOCAL_BASE_URL || 'http://localhost:1234/v1';

// Update the AIProvider interface
interface AIProvider {
  transcribeAudioFile(file: File): Promise<OpenAI.Audio.Transcription>;
  refineTranscription(transcription: string): Promise<string>;
  streamingRefineTranscription?(transcription: string): AsyncGenerator<string, void, unknown>;
}

// OpenAI provider
class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: OPENAI_API_KEY, baseURL: OPENAI_BASE_URL });
  }

  async transcribeAudioFile(file: File): Promise<OpenAI.Audio.Transcription> {
    console.log(`Sending file of size ${file.size} bytes to OpenAI API`);
    console.log(`File type: ${file.type}`);

    try {
      const result = await this.client.audio.transcriptions.create({
        file: file,
        model: "whisper-1",
        response_format: "verbose_json",
        timestamp_granularities: ["word"],
        language: "en"
      });
      console.log('OpenAI API response:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('Error in transcribeAudioFile:', error);
      throw error;
    }
  }

  async refineTranscription(transcription: string): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that refines and improves transcriptions. Your task is to correct any errors, improve punctuation, and ensure the text is well-formatted and easy to read. Maintain the original meaning and content of the transcription."
        },
        {
          role: "user",
          content: `Please refine and improve the following transcription:\n\n${transcription}`
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    return completion.choices[0].message.content || transcription;
  }
}

// Groq provider
class GroqProvider implements AIProvider {
  private client: Groq;

  constructor() {
    this.client = new Groq({ apiKey: GROQ_API_KEY });
  }

  async transcribeAudioFile(file: File): Promise<OpenAI.Audio.Transcription> {
    // Note: Groq doesn't have a direct audio transcription API, so we'll need to use OpenAI for this part
    const openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY, baseURL: OPENAI_BASE_URL });
    return openaiClient.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["word"],
      language: "en"
    });
  }

  async refineTranscription(transcription: string): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that refines and improves transcriptions. Your task is to correct any errors, improve punctuation, and ensure the text is well-formatted and easy to read. Maintain the original meaning and content of the transcription."
        },
        {
          role: "user",
          content: `Please refine and improve the following transcription:\n\n${transcription}`
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    return completion.choices[0].message.content || transcription;
  }
}

// Local provider
class LocalProvider implements AIProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: 'dummy', baseURL: LOCAL_BASE_URL });
  }

  async transcribeAudioFile(file: File): Promise<OpenAI.Audio.Transcription> {
    // Implement local transcription if available, or use OpenAI as fallback
    return this.client.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["word"],
      language: "en"
    });
  }

  async refineTranscription(transcription: string): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that refines and improves transcriptions. Your task is to correct any errors, improve punctuation, and ensure the text is well-formatted and easy to read. Maintain the original meaning and content of the transcription."
        },
        {
          role: "user",
          content: `Please refine and improve the following transcription:\n\n${transcription}`
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    return completion.choices[0].message.content || transcription;
  }
}

// Function to get the appropriate AI provider
function getAIProvider(): AIProvider {
  switch (AI_PROVIDER) {
    case 'openai':
      return new OpenAIProvider();
    case 'groq':
      return new GroqProvider();
    case 'local':
      return new LocalProvider();
    default:
      throw new Error(`Unsupported AI provider: ${AI_PROVIDER}`);
  }
}

const aiProvider = getAIProvider();

// Keeping this for potential future use, suppress linter warning
const SUPPORTED_FORMATS = ['flac', 'm4a', 'mp3', 'mp4', 'mpeg', 'mpga', 'oga', 'ogg', 'wav', 'webm'];

const isVercel = process.env.VERCEL === '1';
const isDebug = process.env.NODE_ENV === 'development';

async function saveAudioFile(file: File): Promise<string | null> {
  if (isVercel || !isDebug) {
    return null; // Don't save files on Vercel or in non-debug environments
  }

  const buffer = await file.arrayBuffer();
  const fileName = `audio_${Date.now()}.webm`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const filePath = path.join(uploadDir, fileName);

  try {
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, Buffer.from(buffer));
    return filePath;
  } catch (error) {
    console.error('Error saving audio file:', error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      console.log('Transcription request received');

      try {
        const formData = await req.formData();
        const file = formData.get('audio') as File;

        if (!file) {
          throw new Error('No audio file provided');
        }

        console.log('Original file type:', file.type);
        console.log('Original file size:', file.size);

        const savedFilePath = await saveAudioFile(file);
        if (savedFilePath) {
          console.log('Audio file saved at:', savedFilePath);
        }

        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        console.log('File extension:', fileExtension);

        try {
          const transcription = await aiProvider.transcribeAudioFile(file);
          console.log('Transcription received:', transcription.text);

          const formattedTranscription = formatTranscription(transcription);
          console.log('Formatted transcription:', formattedTranscription);

          // Stream the transcription response directly
          controller.enqueue(encoder.encode(JSON.stringify({
            transcription: formattedTranscription,
            done: true
          }) + '\n'));

        } catch (transcriptionError) {
          console.error('Error during transcription:', transcriptionError);
          controller.enqueue(encoder.encode(JSON.stringify({
            error: `Error during transcription: ${transcriptionError instanceof Error ? transcriptionError.message : 'Unknown error'}`
          }) + '\n'));
        }
      } catch (error: unknown) {
        console.error('Error during processing:', error);
        let errorMessage = 'Processing failed';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        controller.enqueue(encoder.encode(JSON.stringify({ error: errorMessage }) + '\n'));
      } finally {
        console.log('Closing controller');
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/json',
      'Transfer-Encoding': 'chunked',
    },
  });
}

interface ExtendedTranscription extends OpenAI.Audio.Transcription {
  segments?: Array<{ start: number; text: string }>;
}

function formatTranscription(transcription: ExtendedTranscription): string {
  let result = '';
  if (transcription.segments && transcription.segments.length > 0) {
    for (const segment of transcription.segments) {
      const startTime = new Date(segment.start * 1000).toISOString().substr(11, 8);
      result += `${startTime} | ${segment.text}\n`;
    }
  } else {
    result = transcription.text;
  }
  return result;
}
