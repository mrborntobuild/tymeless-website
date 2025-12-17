import React from 'react';
import { ArrowRight } from 'lucide-react';

export const CallToAction: React.FC = () => {
  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto bg-[#FDFCF8]">
      
      {/* Banner */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-[#FF8C61] via-[#EF5F43] to-[#D93025] px-6 py-24 md:py-32 text-center text-white shadow-2xl shadow-orange-900/20">
         
         {/* Decorative Blur */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/30 blur-[120px] rounded-full"></div>
            <div className="absolute top-1/2 right-0 w-2/3 h-full bg-black/10 blur-[100px] rounded-full"></div>
         </div>

         <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <div className="mb-8 opacity-90">
               <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M10 10C10 10 20 20 10 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M30 10C30 10 20 20 30 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="20" cy="20" r="3" fill="currentColor"/>
               </svg>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif font-medium mb-8 tracking-tight">
               Create your Digital Legacy
            </h2>
            <p className="text-white/95 text-lg md:text-xl font-normal mb-12 max-w-xl mx-auto leading-relaxed">
               Ready to turn your life stories into an eternal gift? Join the families building bridges to the future on Cradle.
            </p>
            <button className="bg-white text-[#D93025] px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg hover:shadow-xl">
               Get Started
            </button>
         </div>
      </div>

    </section>
  );
};