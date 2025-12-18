import { supabase } from './supabaseClient';
import { LegacyPersona } from '../../types';

export const getPersonas = async (): Promise<LegacyPersona[]> => {
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

