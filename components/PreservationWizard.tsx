import React, { useState } from 'react';
import { generatePersonalityProfile } from '../services/geminiService';
import { LegacyPersona } from '../types';
import { Loader2, ArrowRight, Heart } from 'lucide-react';

interface PreservationWizardProps {
  onComplete: (persona: LegacyPersona) => void;
  onCancel: () => void;
}

const PreservationWizard: React.FC<PreservationWizardProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    age: '',
    memories: ''
  });

  const handleSubmit = async () => {
    setLoading(true);
    const personality = await generatePersonalityProfile(formData.name, formData.relation, formData.memories);
    
    // Create new Persona object
    const newPersona: LegacyPersona = {
      id: Date.now().toString(),
      name: formData.name,
      relation: formData.relation,
      age: formData.age || 'Age Unknown',
      imageUrl: `https://picsum.photos/seed/${formData.name.replace(' ', '')}/400/500`, // Deterministic random image
      bio: "Recently preserved memory.",
      personality: personality,
      sampleQuestions: ["Tell me about your childhood.", "What is your favorite memory of us?"]
    };

    setLoading(false);
    onComplete(newPersona);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cradle-bg/90 backdrop-blur-md p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-stone-100 p-8 md:p-12 relative">
        <button onClick={onCancel} className="absolute top-8 right-8 text-gray-400 hover:text-black">Cancel</button>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-12 h-12 bg-cradle-brand/10 rounded-full flex items-center justify-center mb-6 text-cradle-brand">
              <Heart size={24} fill="currentColor" className="opacity-100"/>
            </div>
            <h2 className="text-3xl font-serif text-cradle-text">Begin Preservation</h2>
            <p className="text-gray-500">We'll help you create a digital presence for your loved one. First, tell us who they are.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  autoFocus
                  className="w-full text-lg border-b border-gray-200 py-2 focus:outline-none focus:border-cradle-brand bg-transparent placeholder:text-gray-300 transition-colors"
                  placeholder="e.g. Eleanor Rigby"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                  <input 
                    className="w-full text-lg border-b border-gray-200 py-2 focus:outline-none focus:border-cradle-brand bg-transparent placeholder:text-gray-300 transition-colors"
                    placeholder="e.g. Grandmother"
                    value={formData.relation}
                    onChange={e => setFormData({...formData, relation: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input 
                    className="w-full text-lg border-b border-gray-200 py-2 focus:outline-none focus:border-cradle-brand bg-transparent placeholder:text-gray-300 transition-colors"
                    placeholder="e.g. Age 84"
                    value={formData.age}
                    onChange={e => setFormData({...formData, age: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              disabled={!formData.name || !formData.relation}
              className="w-full mt-8 bg-cradle-brand text-white py-4 rounded-xl font-medium hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Continue <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-serif text-cradle-text">The Essence</h2>
            <p className="text-gray-500">Share some key traits, memories, or mannerisms. Our AI will use this to shape their voice.</p>
            
            <textarea 
              className="w-full h-40 bg-cradle-card rounded-xl p-4 text-cradle-text focus:outline-none focus:ring-2 focus:ring-cradle-brand/50 resize-none"
              placeholder="She was always gardening. She called everyone 'honey'. She grew up in Chicago during the 50s. She was stern but incredibly loving. She loved to bake cinnamon rolls..."
              value={formData.memories}
              onChange={e => setFormData({...formData, memories: e.target.value})}
            />

            <button 
              onClick={handleSubmit}
              disabled={loading || !formData.memories}
              className="w-full mt-8 bg-cradle-brand text-white py-4 rounded-xl font-medium hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Create Persona'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreservationWizard;