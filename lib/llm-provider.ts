import { analyzeWithGrok } from './grok-api';
// Import other LLM providers here

type LLMProvider = 'grok' | 'openai' | 'anthropic' | 'runpod';

const LLM_PROVIDER: LLMProvider = (process.env.LLM_PROVIDER as LLMProvider) || 'grok';

export async function analyzeLLM(prompt: string) {
  switch (LLM_PROVIDER) {
    case 'grok':
      return await analyzeWithGrok(prompt);
    // Add cases for other providers as needed
    default:
      throw new Error(`Unsupported LLM provider: ${LLM_PROVIDER}`);
  }
}
