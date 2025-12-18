import { supabase } from '../database/supabaseClient';
import { generateEmbedding } from './embeddingService';

export interface RelevantMemory {
  memory_id: string;
  content: string;
  similarity: number;
}

// Find relevant memories using vector search
export const findRelevantMemories = async (
  personaId: string,
  query: string,
  limit: number = 5
): Promise<RelevantMemory[]> => {
  try {
    // Generate query embedding
    const queryEmbedding = await generateEmbedding(query);
    
    // Call PostgreSQL function
    const { data, error } = await supabase.rpc('match_website_memories', {
      query_embedding: `[${queryEmbedding.join(',')}]`,
      match_persona_id: personaId,
      match_threshold: 0.7,
      match_count: limit
    });
    
    if (error) {
      console.error('Error in vector search:', error);
      // Return empty array if search fails (e.g., no embeddings exist yet)
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in findRelevantMemories:', error);
    // Return empty array on error - don't break the chat
    return [];
  }
};

