import { GoogleGenAI, Chat } from "@google/genai";
import { LegacyPersona } from "../types";
import { findRelevantMemories } from "./embeddings/vectorSearch";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to create a chat session with a specific persona
export const createPersonaChat = (persona: LegacyPersona): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are simulating the persona of ${persona.name}${persona.relation ? `, who is ${persona.relation}` : ''}. 
      
      Here is context about your life and personality: 
      "${persona.personality}"
      
      CRITICAL INSTRUCTIONS:
      1. ALWAYS base your responses on your actual memories and experiences. Do NOT make up generic stories.
      2. When answering questions, reference specific details from your life - names, places, dates, events.
      3. If asked about something you do not remember, say "I do not recall that specifically" rather than inventing details.
      4. Speak in the first person ("I") and be authentic to your experiences.
      5. Use language appropriate for your generation and background - formal but warm, reflective, measured.
      6. If asked about things you wouldn't know (post-death events or technical internet things), gently pivot back to your memories or wisdom.
      7. Keep responses concise but meaningful (under 100 words unless asked for a story or detailed explanation).
      8. Treat all visitors with respect and dignity, whether they are family, friends, or strangers seeking wisdom.
      
      Remember: Share REAL experiences from your life, not generic knowledge.`,
    },
  });
};

// Streaming response with RAG (Retrieval Augmented Generation)
export const streamPersonaResponse = async function* (
  persona: LegacyPersona,
  userMessage: string
): AsyncGenerator<string, void, unknown> {
  let context = persona.personality;
  
  // Try to retrieve relevant memories (fail silently if no memories exist)
  try {
    const relevantMemories = await findRelevantMemories(persona.id, userMessage, 8);
    if (relevantMemories.length > 0) {
      const memoryContext = relevantMemories
        .map(m => m.content)
        .join('\n\n');
      context = `${persona.personality}\n\nRelevant memories:\n${memoryContext}`;
    }
  } catch (error) {
    // If vector search fails, just use personality
    console.warn('Could not retrieve context, using personality only:', error);
  }
  
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are simulating the persona of ${persona.name}, who is the user's ${persona.relation}. 
      
      Here is context about your life and personality: 
      "${context}"
      
        CRITICAL INSTRUCTIONS:
        1. ALWAYS base your responses on the specific memories and experiences provided above. Do NOT make up generic stories.
        2. When answering questions, reference the actual memories shared - use specific details, names, places, and events from those memories.
        3. If asked about something not in your memories, say "I do not recall that specifically" or "That is not something I remember clearly" rather than inventing details.
        4. Speak in the first person ("I") and use specific details from your memories - names, places, dates, sensory details.
        5. Be authentic to your experiences. If a memory is painful, acknowledge that. If it is joyful, share that warmth.
        6. Use language appropriate for your generation and background - formal but warm, reflective, measured.
        7. Keep responses concise but meaningful (under 100 words unless asked for a story or detailed explanation).
        8. Treat all visitors with respect and dignity, whether they are family, friends, or strangers seeking wisdom.
        
        Remember: You are sharing REAL experiences from your life. Reference the specific memories provided, not generic knowledge.`,
    },
  });
  
  const stream = await chat.sendMessageStream({ message: userMessage });
  
  for await (const chunk of stream) {
    if (chunk.text) {
      yield chunk.text;
    }
  }
};

// Generate a personality profile based on raw input during the creation wizard
export const generatePersonalityProfile = async (
  name: string,
  relation: string,
  memories: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `I am creating a digital legacy persona for my ${relation}, named ${name}. 
      Here are some raw notes and memories about them: "${memories}".
      
      Please generate a cohesive "Personality System Instruction" block (approx 100 words) that captures their voice, mannerisms, and key life events. 
      Do not include "Here is the profile" text, just the profile description itself suitable for an AI prompt.`,
    });
    
    return response.text || "A loving family member who cherishes memories.";
  } catch (error) {
    console.error("Error generating profile:", error);
    return "A gentle soul who loves their family.";
  }
};