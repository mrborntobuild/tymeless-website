import React, { useState, useEffect } from 'react';

const GlitchText: React.FC = () => {
  const [text, setText] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  useEffect(() => {
    const generateLine = () => {
      return Array(40).fill(0).map(() => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        // Randomly color some characters red
        return Math.random() > 0.9 ? `<span class="text-red-500 font-bold">${char}</span>` : `<span class="opacity-30">${char}</span>`;
      }).join('');
    };

    const interval = setInterval(() => {
      setText(Array(6).fill(0).map(generateLine).join('<br/>'));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="font-mono text-[10px] leading-tight break-all overflow-hidden h-24 w-full"
      dangerouslySetInnerHTML={{ __html: text }} 
    />
  );
};

const TrustCard: React.FC<{ title: string; body: string; className?: string }> = ({ title, body, className = "" }) => (
  <div className={`bg-[#F9F8F6] p-8 md:p-10 rounded-2xl flex flex-col justify-center h-full min-h-[280px] ${className}`}>
    <h3 className="text-2xl font-serif text-cradle-text mb-4">{title}</h3>
    <p className="text-cradle-text/60 leading-relaxed text-sm md:text-base">{body}</p>
  </div>
);

export const Trust: React.FC = () => {
  return (
    <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto bg-[#FDFCF8]">
      
      {/* Header */}
      <div className="text-center mb-20">
        <div className="inline-block py-1.5 px-4 rounded-full bg-[#F3EEEA] text-[#8C7B70] text-xs font-semibold tracking-wide uppercase mb-6">
          Trust
        </div>
        <h2 className="text-5xl md:text-6xl font-serif text-cradle-text">
          Your mind<br/>
          <span className="italic opacity-60">is Yours.</span>
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          <TrustCard 
            title="Built to protect your legacy" 
            body="Your Cradle maintains integrity over time. Your authenticity stays intact, trusted by your family now—and forever."
          />
          <TrustCard 
            title="Privacy first, always" 
            body="We uphold strict privacy standards. Cradle keeps your conversations private and your stories protected."
          />
        </div>

        {/* Center Column - Image Card */}
        <div className="relative rounded-2xl overflow-hidden min-h-[400px] md:min-h-full group bg-gray-100">
          <img 
            src="https://vxsjiwlvradiyluppage.supabase.co/storage/v1/object/public/Test/fe458aa6f20c125342b94445faa583d7_1765946944519.png" 
            alt="Preserved Persona" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>

          {/* Glitch Overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#FDFCF8] via-[#FDFCF8]/95 to-transparent pt-32 pb-6 px-6">
             <div className="inline-block bg-black/70 backdrop-blur-sm px-2 py-1 mb-3 rounded-sm">
               <span className="text-[10px] uppercase tracking-widest text-white font-bold">Encrypted Memory Core</span>
             </div>
             <GlitchText />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
           <TrustCard 
            title="Complete ownership" 
            body="We believe your mind is your most precious asset. It's securely stored, fully encrypted, and never shared or sold."
          />
           <TrustCard 
            title="You're in control" 
            body="Your Digital Persona speaks only your words. Cradle never improvises without your consent or context."
          />
        </div>

      </div>
    </section>
  );
};