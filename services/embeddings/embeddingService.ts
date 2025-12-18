import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';

// Choose which API to use based on environment variable
const useOpenAI = import.meta.env.VITE_USE_OPENAI === 'true';

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY || '';
const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY || '';

const geminiAI = useOpenAI ? null : new GoogleGenAI({ apiKey: geminiApiKey });
const openai = useOpenAI ? new OpenAI({ 
  apiKey: openaiApiKey,
  dangerouslyAllowBrowser: true // Required for browser usage - API key will be exposed in client bundle
}) : null;

// Generate embedding for text
export const generateEmbedding = async (text: string): Promise<number[]> => {
  try {
    if (useOpenAI && openai) {
      // Use OpenAI embeddings
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small', // or 'text-embedding-ada-002'
        input: text,
      });
      
      return response.data[0].embedding;
    } else if (geminiAI) {
      // Use Gemini embeddings
      const result = await geminiAI.models.embedContent({
        model: 'text-embedding-004',
        content: text,
      });
      
      return result.embedding.values;
    } else {
      throw new Error('No embedding API configured');
    }
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
};

