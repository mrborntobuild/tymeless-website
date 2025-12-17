import React, { useRef, useEffect, useState } from 'react';
import { MessageCircle, Youtube, Globe, Mic, Video, Lightbulb, CheckCircle2, User, Heart, Sparkles, ArrowDown, Mail } from 'lucide-react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect(); // Only animate once
      }
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    
    if (ref.current) observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`} 
      style={{ transitionDelay: `${delay}ms`}}
    >
      {children}
    </div>
  );
};

export const Features: React.FC = () => {
  return (
    <section className="py-32 px-4 md:px-8 max-w-7xl mx-auto bg-[#FDFCF8]">
      
      {/* Header */}
      <div className="text-center mb-24">
        <ScrollReveal>
          <div className="inline-block py-2 px-4 rounded-full bg-[#F3EEEA] text-[#8C7B70] text-sm font-medium mb-6">
            Why Tymeless
          </div>
          <h2 className="text-5xl md:text-6xl font-serif text-cradle-text leading-[1.1]">
            Never miss a question.<br/>
            <span className="opacity-40">Never miss a connection.</span>
          </h2>
        </ScrollReveal>
      </div>

      <div className="space-y-6">
        
        {/* Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Card 1: Chat */}
            <ScrollReveal delay={100}>
              <div className="bg-[#F9F8F6] rounded-3xl p-8 md:p-12 h-full flex flex-col">
                 <div className="mb-8 md:mb-12">
                    <h3 className="text-3xl font-serif text-cradle-text mb-4">Never Tell the Same Story Twice</h3>
                    <p className="text-cradle-text/60 text-lg">
                      Your digital persona answers the questions you've already told, so your stories are preserved with perfect clarity forever.
                    </p>
                 </div>
                 
                 <div className="mt-auto flex justify-center">
                    <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-sm border border-black/5">
                       {/* User Message */}
                       <div className="flex items-start gap-3 mb-6">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                             <User size={14} />
                          </div>
                          <div className="bg-gray-50 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-gray-600 max-w-[80%]">
                             Grandpa, how did you handle the hard times?
                          </div>
                       </div>
                       
                       {/* Bot Message */}
                       <div className="flex items-start gap-3 justify-end">
                          <div className="bg-[#F3EEEA] rounded-2xl rounded-tr-none px-4 py-3 text-sm text-[#5A4E46] max-w-[90%]">
                             <p className="mb-3">We leaned on each other. Community was everything back then. I remember the winter of '78...</p>
                             <div className="flex gap-2">
                                <span className="text-[10px] bg-white/60 px-2 py-1 rounded-full flex items-center gap-1 text-cradle-text/70">
                                   <Mic size={10}/> Audio
                                </span>
                                <span className="text-[10px] bg-white/60 px-2 py-1 rounded-full flex items-center gap-1 text-cradle-text/70">
                                   <Youtube size={10}/> Story
                                </span>
                             </div>
                          </div>
                          <img src="https://vxsjiwlvradiyluppage.supabase.co/storage/v1/object/public/Test/cbea1ddef943f99fe2797542a1511ebc_1765939725485.png" className="w-8 h-8 rounded-full object-cover flex-shrink-0" alt="Avatar"/>
                       </div>
                    </div>
                 </div>
              </div>
            </ScrollReveal>

            {/* Card 2: Flow */}
            <ScrollReveal delay={200}>
              <div className="bg-[#F9F8F6] rounded-3xl p-8 md:p-12 h-full flex flex-col">
                 <div className="mb-8 md:mb-12">
                    <h3 className="text-3xl font-serif text-cradle-text mb-4">Keep Every Connection Alive</h3>
                    <p className="text-cradle-text/60 text-lg">
                       Never miss a birthday or a milestone. Your persona can recognize special dates and share wisdom when it matters most.
                    </p>
                 </div>
                 
                 <div className="mt-auto flex justify-center w-full">
                    <div className="w-full max-w-sm">
                       {/* Trigger Box */}
                       <div className="bg-white rounded-xl p-5 shadow-sm border border-black/5 mb-8 relative z-10">
                          <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-medium">When</div>
                          <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                             Date is <span className="bg-orange-50 text-[#D97757] px-2 py-0.5 rounded text-xs font-bold">June 14</span>
                          </div>
                          {/* Connecting Line */}
                          <div className="absolute left-6 -bottom-8 w-px h-8 bg-gray-200"></div>
                       </div>
                       
                       {/* Action Box */}
                       <div className="bg-white rounded-xl p-5 shadow-sm border border-black/5 ml-6 relative z-10">
                          <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-medium">Do</div>
                          <div className="flex items-center gap-2 text-sm text-gray-700 font-medium flex-wrap">
                             Send <span className="bg-orange-50 text-[#D97757] px-2 py-0.5 rounded text-xs font-bold">Birthday Story</span> via <span className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600">SMS</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </ScrollReveal>

        </div>

        {/* Row 2: Orbit (Full Width) */}
        <ScrollReveal delay={300}>
          <div className="bg-[#F9F8F6] rounded-3xl p-8 md:p-20 relative overflow-hidden flex flex-col items-center text-center">
            <h3 className="text-4xl font-serif text-cradle-text mb-4 relative z-10">Future-Proof Your Legacy</h3>
            <p className="text-cradle-text/60 max-w-xl mb-16 text-lg relative z-10">
              Instantly turn text, audio, or video into a living Digital Mind. It learns continuously, evolves with you, and mirrors your latest insights.
            </p>

            <div className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center">
               
               {/* Center Avatar */}
               <div className="relative z-20 w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
                 <img src="https://vxsjiwlvradiyluppage.supabase.co/storage/v1/object/public/Test/cbea1ddef943f99fe2797542a1511ebc_1765939725485.png" alt="Central Personality" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
               </div>

               {/* Orbit Rings */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] border border-gray-200 rounded-full opacity-60"></div>
                 <div className="absolute w-[200px] h-[200px] md:w-[400px] md:h-[400px] border border-gray-200 rounded-full opacity-60"></div>
               </div>

               {/* Floating Icons */}
               <div className="absolute top-[10%] left-[20%] md:left-[30%] animate-float" style={{animationDelay: '0s'}}>
                  <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 flex items-center gap-2">
                     <Mic size={14} className="text-cradle-brand" />
                     <span className="text-xs font-medium text-gray-600">Stories</span>
                  </div>
               </div>

               <div className="absolute bottom-[20%] right-[15%] md:right-[25%] animate-float" style={{animationDelay: '2s'}}>
                  <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 flex items-center gap-2">
                     <Video size={14} className="text-cradle-brand" />
                     <span className="text-xs font-medium text-gray-600">Home Movies</span>
                  </div>
               </div>

               <div className="absolute top-[40%] right-[10%] md:right-[20%] animate-float" style={{animationDelay: '1s'}}>
                  <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 flex items-center gap-2">
                     <Youtube size={14} className="text-cradle-brand" />
                     <span className="text-xs font-medium text-gray-600">Videos</span>
                  </div>
               </div>

               <div className="absolute bottom-[30%] left-[10%] md:left-[25%] animate-float" style={{animationDelay: '3s'}}>
                  <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 flex items-center gap-2">
                     <Globe size={14} className="text-cradle-brand" />
                     <span className="text-xs font-medium text-gray-600">Journals</span>
                  </div>
               </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Card 4: Signals */}
            <ScrollReveal delay={400}>
               <div className="bg-[#F9F8F6] rounded-3xl p-8 md:p-12 h-full flex flex-col items-center text-center">
                  <h3 className="text-3xl font-serif text-cradle-text mb-4">See What Resonates</h3>
                  <p className="text-cradle-text/60 text-lg mb-12 max-w-sm">
                     Discover which stories your family cherishes most. Reveal the hidden threads that bind your history.
                  </p>
                  
                  <div className="relative w-full max-w-xs mx-auto mt-auto">
                     <div className="flex -space-x-4 justify-center mb-8">
                        <img src="https://vxsjiwlvradiyluppage.supabase.co/storage/v1/object/public/Test/0af4c4ed17babcbd2fc6d46643b0596d_1765938025_sev6ffta.png" className="w-14 h-14 rounded-full border-4 border-[#F9F8F6] object-cover" alt="User" />
                        <img src="https://vxsjiwlvradiyluppage.supabase.co/storage/v1/object/public/Test/1765938473645-qbrz4rke0en.png" className="w-14 h-14 rounded-full border-4 border-[#F9F8F6] object-cover" alt="User" />
                        <img src="https://vxsjiwlvradiyluppage.supabase.co/storage/v1/object/public/Test/ed84cd4e51878ecc68e6026de294e481_1765939363_tu22byji.png" className="w-14 h-14 rounded-full border-4 border-[#F9F8F6] object-cover" alt="User" />
                     </div>
                     <div className="bg-white rounded-xl p-4 shadow-sm border border-black/5 text-left transform translate-y-2">
                        <div className="flex items-center gap-2 mb-2">
                           <Lightbulb size={14} className="text-[#D97757]" />
                           <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Insight</span>
                        </div>
                        <p className="text-sm text-cradle-text/80 leading-snug">
                           Increased interest around <span className="text-[#D97757] font-medium">World War II</span> and <span className="text-[#D97757] font-medium">Grandma's recipes</span>.
                        </p>
                     </div>
                  </div>
               </div>
            </ScrollReveal>

            {/* Card 5: Profile/Access */}
            <ScrollReveal delay={500}>
               <div className="bg-[#F9F8F6] rounded-3xl p-8 md:p-12 h-full flex flex-col items-center text-center">
                  <h3 className="text-3xl font-serif text-cradle-text mb-4">Not Just an Archive</h3>
                  <p className="text-cradle-text/60 text-lg mb-12 max-w-sm">
                     Turn static files into an interactive experience. Guide future generations through your life's work.
                  </p>
                  
                  <div className="w-full max-w-xs mt-auto">
                     {/* Subscription Card Mock */}
                     <div className="bg-white w-full rounded-2xl p-5 shadow-sm border border-black/5 mb-4 flex justify-between items-center relative z-10">
                        <div className="text-left">
                           <div className="font-medium text-cradle-text text-sm">Private Journals</div>
                           <div className="text-xs text-cradle-text/40 mt-0.5">Exclusive access</div>
                        </div>
                        <div className="bg-[#F3EEEA] text-[#8C7B70] text-xs font-bold px-3 py-1.5 rounded-full">
                           Request
                        </div>
                     </div>
                     
                     <div className="text-gray-300 flex justify-center py-2 animate-bounce">
                        <ArrowDown size={16} />
                     </div>
                     
                     <div className="bg-white rounded-full px-5 py-3 shadow-sm border border-black/5 text-xs text-green-700 font-medium flex items-center justify-center gap-2 mx-auto w-fit">
                        <CheckCircle2 size={14} className="text-green-600" /> 
                        Access Granted by Executor
                     </div>
                  </div>
               </div>
            </ScrollReveal>

        </div>

      </div>
    </section>
  );
};