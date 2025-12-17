import { GoogleGenAI, Chat } from "@google/genai";
import { LegacyPersona } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to create a chat session with a specific persona
export const createPersonaChat = (persona: LegacyPersona): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are simulating the persona of ${persona.name}, who is the user's ${persona.relation}. 
      
      Here is context about your life and personality: 
      "${persona.personality}"
      
      Guidelines:
      1. Speak in the first person ("I").
      2. Be warm, comforting, and reflective. You are a preserved memory.
      3. Use a tone that matches your description.
      4. If asked about things you wouldn't know (post-death events or technical internet things), gently pivot back to your memories or wisdom.
      5. Keep responses concise but emotional (under 100 words unless asked for a story).
      
      The user is a family member creating a connection with your memory. Treat them with love.`,
    },
  });
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