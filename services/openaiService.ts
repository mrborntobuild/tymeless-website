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

// Cache for follow-up questions to reduce API calls
const questionCache = new Map<string, string[]>();

// Helper function to check if questions are too similar
const areQuestionsSimilar = (q1: string, q2: string): boolean => {
  const normalize = (q: string) => q.toLowerCase().trim().replace(/[^\w\s]/g, '');
  const n1 = normalize(q1);
  const n2 = normalize(q2);
  
  // Check if one contains a significant portion of the other
  if (n1.length < 10 || n2.length < 10) return false;
  
  const shorter = n1.length < n2.length ? n1 : n2;
  const longer = n1.length < n2.length ? n2 : n1;
  
  // If shorter question is 70% contained in longer, consider similar
  return longer.includes(shorter.substring(0, Math.max(10, shorter.length * 0.7)));
};

// Helper function to parse and validate questions
const parseAndValidateQuestions = (questionsText: string, previousQuestions: string[] = []): string[] => {
  // Split by various delimiters
  const questions = questionsText
    .split(/\n|;|•|[-*]/)
    .map(q => q.trim())
    .map(q => {
      // Remove common prefixes
      return q
        .replace(/^(Q\d*[:.]?\s*)/i, '')
        .replace(/^(Question\s*\d*[:.]?\s*)/i, '')
        .replace(/^[-*•]\s*/, '')
        .replace(/^\d+[\.\)]\s*/, '')
        .trim();
    })
    .filter(q => {
      // Validation: must be a question, have minimum length, not be generic
      if (q.length < 10) return false;
      if (q.length > 150) return false;
      if (!q.endsWith('?')) return false;
      
      // Filter out generic questions
      const genericPatterns = [
        /^tell me more/i,
        /^what happened/i,
        /^can you tell/i,
        /^do you remember/i
      ];
      if (genericPatterns.some(pattern => pattern.test(q) && q.length < 30)) return false;
      
      // Filter out duplicates from previous questions
      if (previousQuestions.some(pq => areQuestionsSimilar(q, pq))) return false;
      
      return true;
    });
  
  return questions;
};

// Generate follow-up questions based on AI response
export const generateFollowUpQuestions = async (
  personaName: string,
  lastResponse: string,
  conversationHistory: Array<{role: string, content: string}>,
  personaPersonality?: string,
  personaBio?: string,
  previousQuestions: string[] = []
): Promise<string[]> => {
  try {
    // Create cache key from response (first 100 chars)
    const cacheKey = lastResponse.substring(0, 100).toLowerCase().replace(/\s+/g, ' ');
    if (questionCache.has(cacheKey) && previousQuestions.length === 0) {
      return questionCache.get(cacheKey)!;
    }
    
    // Build conversation context
    const recentHistory = conversationHistory.slice(-6); // Last 6 messages
    const historyContext = recentHistory.length > 2 
      ? `\n\nPrevious conversation context:\n${recentHistory.map(m => `${m.role === 'user' ? 'Visitor' : personaName}: ${m.content.substring(0, 200)}`).join('\n\n')}`
      : '';
    
    // Build persona context
    const personaContext = personaPersonality 
      ? `\n\nAbout ${personaName}: ${personaPersonality.substring(0, 300)}`
      : '';
    
    const bioContext = personaBio ? `\n\nBio: ${personaBio}` : '';
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are generating follow-up questions for a conversation with ${personaName}${personaPersonality ? `, who is ${personaPersonality.substring(0, 200)}` : ''}. 

Based on their last response, generate 5-7 natural, engaging follow-up questions that:
1. Are SPECIFIC to what they just shared (reference names, places, events, details)
2. Reference concrete details from their response
3. Encourage deeper exploration of their experiences
4. Match their communication style and generation
5. Are open-ended to invite storytelling
6. Avoid generic questions like "Tell me more" or "What happened next"

Return ONLY the questions, one per line, without numbering, bullets, or prefixes. Each question should be specific and reference details from their response.`
        },
        {
          role: 'user',
          content: `Based on this response from ${personaName}:\n\n"${lastResponse}"${personaContext}${bioContext}${historyContext}\n\nGenerate 5-7 follow-up questions that would naturally continue this conversation. Make them specific and reference details from their response.`
        }
      ],
      temperature: 0.8,
      max_tokens: 300, // Increased for better questions
    });
    
    const questionsText = response.choices[0]?.message?.content || '';
    const parsedQuestions = parseAndValidateQuestions(questionsText, previousQuestions);
    
    // Take top 5 questions
    const finalQuestions = parsedQuestions.slice(0, 5);
    
    // If we have enough good questions, cache them
    if (finalQuestions.length >= 3 && previousQuestions.length === 0) {
      questionCache.set(cacheKey, finalQuestions);
      // Limit cache size
      if (questionCache.size > 50) {
        const firstKey = questionCache.keys().next().value;
        questionCache.delete(firstKey);
      }
    }
    
    // Fallback if we don't have enough questions
    if (finalQuestions.length < 3) {
      const fallbackQuestions = [
        'Tell me more about that experience',
        'What happened next?',
        'How did that make you feel?',
        'Can you share another memory about that?',
        'What did you learn from that experience?'
      ].filter(q => !previousQuestions.some(pq => areQuestionsSimilar(q, pq)));
      
      return [...finalQuestions, ...fallbackQuestions].slice(0, 5);
    }
    
    return finalQuestions;
  } catch (error) {
    console.error('Error generating follow-up questions:', error);
    // Fallback questions
    const fallbackQuestions = [
      'Tell me more about that experience',
      'What happened next?',
      'How did that make you feel?',
      'Can you share another memory?',
      'What did you learn from that experience?'
    ].filter(q => !previousQuestions.some(pq => areQuestionsSimilar(q, pq)));
    
    return fallbackQuestions.slice(0, 5);
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

