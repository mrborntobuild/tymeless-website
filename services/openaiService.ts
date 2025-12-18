import OpenAI from 'openai';
import { LegacyPersona } from "../types";
import { findRelevantMemories } from "./embeddings/vectorSearch";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY || '';
const openai = new OpenAI({ 
  apiKey,
  dangerouslyAllowBrowser: true // Required for browser usage - API key will be exposed in client bundle
});

// Helper to create a chat session with a specific persona
export const createPersonaChat = (persona: LegacyPersona) => {
  return {
    sendMessage: async ({ message }: { message: string }) => {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are simulating the persona of ${persona.name}${persona.relation ? `, who is ${persona.relation}` : ''}. 
            
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
            
            Remember: Share REAL experiences from your life, not generic knowledge.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
      });
      
      return {
        text: response.choices[0]?.message?.content || "I'm having a little trouble remembering right now..."
      };
    }
  };
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
  
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are simulating the persona of ${persona.name}${persona.relation ? `, who is ${persona.relation}` : ''}. 
        
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
        
        Remember: You are sharing REAL experiences from your life. Reference the specific memories provided, not generic knowledge.`
      },
      {
        role: 'user',
        content: userMessage
      }
    ],
    temperature: 0.7,
    stream: true,
  });
  
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
};

// Generate follow-up questions based on AI response
export const generateFollowUpQuestions = async (
  personaName: string,
  lastResponse: string,
  conversationHistory: Array<{role: string, content: string}>
): Promise<string[]> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are generating follow-up questions for a conversation with ${personaName}, a World War II veteran nurse. Based on their last response, generate 5 natural, engaging follow-up questions that would help continue the conversation. Questions should be specific, relevant to what they just shared, and encourage them to elaborate on their experiences. Return only the questions, one per line, without numbering or bullets.`
        },
        {
          role: 'user',
          content: `Based on this response from ${personaName}:\n\n"${lastResponse}"\n\nGenerate 5 follow-up questions that would naturally continue this conversation.`
        }
      ],
      temperature: 0.8,
      max_tokens: 200,
    });
    
    const questionsText = response.choices[0]?.message?.content || '';
    const questions = questionsText
      .split('\n')
      .map(q => q.trim())
      .filter(q => q.length > 0 && !q.match(/^\d+[\.\)]/)) // Remove numbering
      .slice(0, 5);
    
    return questions.length > 0 ? questions : [
      'Tell me more about that',
      'What happened next?',
      'How did that make you feel?',
      'Can you share another memory?',
      'What did you learn from that experience?'
    ];
  } catch (error) {
    console.error('Error generating follow-up questions:', error);
    // Fallback questions
    return [
      'Tell me more about that',
      'What happened next?',
      'How did that make you feel?',
      'Can you share another memory?',
      'What did you learn from that experience?'
    ];
  }
};

// Generate a personality profile based on raw input during the creation wizard
export const generatePersonalityProfile = async (
  name: string,
  relation: string,
  memories: string
): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `I am creating a digital legacy persona for my ${relation}, named ${name}. 
          Here are some raw notes and memories about them: "${memories}".
          
          Please generate a cohesive "Personality System Instruction" block (approx 100 words) that captures their voice, mannerisms, and key life events. 
          Do not include "Here is the profile" text, just the profile description itself suitable for an AI prompt.`
        }
      ],
      temperature: 0.7,
    });
    
    return response.choices[0]?.message?.content || "A loving family member who cherishes memories.";
  } catch (error) {
    console.error("Error generating profile:", error);
    return "A gentle soul who loves their family.";
  }
};

