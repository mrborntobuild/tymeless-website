import React from 'react';
import Logo from './Logo';

export const CallToAction: React.FC = () => {
  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto bg-[#FDFCF8]">
      
      {/* Banner */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-[#D97757] via-[#C56545] to-[#B85433] px-6 py-24 md:py-32 text-center text-white shadow-2xl shadow-cradle-brand/30">
         
         {/* Decorative Blur */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/30 blur-[120px] rounded-full"></div>
            <div className="absolute top-1/2 right-0 w-2/3 h-full bg-black/10 blur-[100px] rounded-full"></div>
         </div>

         <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <div className="mb-8 opacity-90">
               <Logo size="lg" variant="white" />
            </div>
            <h2 className="text-5xl md:text-7xl font-serif font-medium mb-8 tracking-tight">
               Create your Digital Legacy
            </h2>
            <p className="text-white/95 text-lg md:text-xl font-normal mb-12 max-w-xl mx-auto leading-relaxed">
               Ready to turn your life stories into an eternal gift? Join the families building bridges to the future on Tymeless.
            </p>
            <button className="bg-white text-cradle-brand px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg hover:shadow-xl">
               Get Started
            </button>
         </div>
      </div>

    </section>
  );
};