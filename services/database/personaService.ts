import { supabase } from './supabaseClient';
import { LegacyPersona } from '../../types';

export const getPersonas = async (): Promise<LegacyPersona[]> => {
  // Check if Supabase is configured
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://placeholder.supabase.co') {
    console.warn('Supabase not configured, using fallback data');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('website_personas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching personas:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((p: any) => ({
      id: p.id,
      name: p.name,
      relation: p.relation || '',
      age: p.age || '',
      imageUrl: p.image_url || '',
      bio: p.bio || '',
      personality: p.personality || '',
      sampleQuestions: p.sample_questions || []
    }));
  } catch (error) {
    console.error('Error fetching personas:', error);
    return [];
  }
};

