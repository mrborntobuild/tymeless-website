import { supabase } from './supabaseClient';

export interface ChatMessage {
  id: string;
  conversation_id: string | null;
  website_persona_id: string | null;
  session_id: string;
  role: 'user' | 'model';
  message_type: 'text' | 'audio';
  text_content: string | null;
  audio_url: string | null;
  ai_audio_url: string | null;
  transcript: string | null;
  duration: number | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  website_persona_id: string | null;
  session_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

// Get or create conversation for a session
export const getOrCreateConversation = async (
  personaId: string,
  sessionId: string
): Promise<Conversation> => {
  // Try to get existing conversation
  const { data: existing } = await supabase
    .from('website_conversations')
    .select('*')
    .eq('website_persona_id', personaId)
    .eq('session_id', sessionId)
    .single();

  if (existing) {
    return existing;
  }

  // Create new conversation
  const { data, error } = await supabase
    .from('website_conversations')
    .insert({
      website_persona_id: personaId,
      session_id: sessionId
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }

  return data;
};

// Save a chat message
export const saveMessage = async (
  conversationId: string,
  personaId: string | null,
  sessionId: string,
  message: {
    role: 'user' | 'model';
    message_type?: 'text' | 'audio';
    text_content?: string;
    audio_url?: string;
    ai_audio_url?: string;
    transcript?: string;
    duration?: number;
  }
): Promise<ChatMessage> => {
  const { data, error } = await supabase
    .from('website_chat_messages')
    .insert({
      conversation_id: conversationId,
      website_persona_id: personaId,
      session_id: sessionId,
      role: message.role,
      message_type: message.message_type || 'text',
      text_content: message.text_content || null,
      audio_url: message.audio_url || null,
      ai_audio_url: message.ai_audio_url || null,
      transcript: message.transcript || null,
      duration: message.duration || null
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving message:', error);
    throw error;
  }

  return data;
};

// Get all messages for a conversation
export const getConversationMessages = async (
  conversationId: string
): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from('website_chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }

  return data || [];
};

