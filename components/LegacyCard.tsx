import React from 'react';
import { LegacyPersona } from '../types';
import { Mic, MessageCircle } from 'lucide-react';

interface LegacyCardProps {
  persona: LegacyPersona;
  onClick: (persona: LegacyPersona) => void;
}

const LegacyCard: React.FC<LegacyCardProps> = ({ persona, onClick }) => {
  return (
    <div 
      onClick={() => onClick(persona)}
      className="group relative h-[420px] w-full md:w-[340px] flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
    >
      {/* Background Image */}
      <img 
        src={persona.imageUrl} 
        alt={persona.name} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Gradient Overlay - Warm/Reddish tone matching reference */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#5a3e2b] via-[#8c4b2c]/40 to-transparent opacity-90" />
      
      {/* Preview Badge - Top Left */}
      <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-sm text-xs font-medium text-white shadow-sm">
        Preview
      </div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        
        {/* Voice Preserved Pill */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 mb-3 w-fit">
           <Mic size={12} className="text-white" />
           <span className="text-xs font-medium text-white">Voice Preserved</span>
        </div>

        <div className="flex flex-col mb-1">
          <h3 className="text-3xl font-serif font-medium leading-tight mb-1">
            {persona.name}
          </h3>
           {/* Age displayed instead of relation */}
          <p className="text-white/80 text-sm font-medium">
            {persona.age}
          </p>
        </div>
        
        {/* Hover interaction - Resume Conversation */}
        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-white/90">
           <MessageCircle size={18} />
           <span>Resume Conversation</span>
        </div>
      </div>
    </div>
  );
};

export default LegacyCard;