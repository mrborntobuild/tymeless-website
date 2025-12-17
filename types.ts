export interface LegacyPersona {
  id: string;
  name: string;
  relation: string;
  age: string;
  imageUrl: string;
  bio: string;
  personality: string; // Used for system instruction
  sampleQuestions: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface PreservationFormData {
  name: string;
  relation: string;
  age: string;
  memories: string;
}