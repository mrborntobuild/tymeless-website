import React, { useState } from 'react';
import { LegacyPersona } from './types';
import LegacyCard from './components/LegacyCard';
import ChatInterface from './components/ChatInterface';
import PreservationWizard from './components/PreservationWizard';
import { Features } from './components/Features';
import { Trust } from './components/Trust';
import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import Logo from './components/Logo';
import { Search, Plus, PlayCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock Data to populate the carousel initially
const INITIAL_PERSONAS: LegacyPersona[] = [
  {
    id: '1',
    name: 'Martha Lewis',
    relation: 'Grandmother',
    age: 'Age 84',
    imageUrl: 'https://vxsjiwlvradiyluppage.supabase.co/storage/v1/object/public/Test/0af4c4ed17babcbd2fc6d46643b0596d_1765938025_sev6ffta.png',
    bio: "The matriarch of the Lewis family. Known for her award-winning roses and her stories about the War.",
    personality: "I am a gentle, wise grandmother born in 1940. I love gardening and baking. I speak softly and use endearments like 'dear' and 'honey'. I value family above all else.",
    sampleQuestions: ["How do I prune hydrangeas?", "Tell me about meeting Grandpa."]
  },
  {
    id: '2',
    name: 'Robert Chen',
    relation: 'Father',
    age: 'Age 62',
    imageUrl: 'https://vxsjiwlvradiyluppage.supabase.co/storage/v1/object/public/Test/1765938473645-qbrz4rke0en.png',
    bio: "Architect and jazz enthusiast. He could fix anything and always had a joke ready.",
    personality: "I am a dad who loves dad jokes, jazz music, and architecture. I am practical, stoic but warm, and always encouraging.",
    sampleQuestions: ["What's the best jazz album?", "How do I fix a leaky faucet?"]
  },
  {
    id: '3',
    name: 'Sarah Jenkins',
    relation: 'Sister',
    age: 'Age 45',
    imageUrl: 'https://vxsjiwlvradiyluppage.supabase.co/storage/v1/object/public/Test/ed84cd4e51878ecc68e6026de294e481_1765939363_tu22byji.png',
    bio: "A free spirit who traveled the world. Her journals are preserved here forever.",
    personality: "I am adventurous, energetic, and optimistic. I love travel and art. I speak quickly and enthusiastically.",
    sampleQuestions: ["Where should I travel next?", "Tell me about your time in Peru."]
  },
  {
    id: '4',
    name: 'Arthur P. Wright',
    relation: 'Great Grandfather',
    age: 'Age 98',
    imageUrl: 'https://vxsjiwlvradiyluppage.supabase.co/storage/v1/object/public/Test/cbea1ddef943f99fe2797542a1511ebc_1765939725485.png',
    bio: "A glimpse into the 1920s. Preserved from old letters and audio recordings.",
    personality: "I am formal, old-fashioned, and polite. I use vocabulary from the early 20th century. I talk about history and honor.",
    sampleQuestions: ["What was life like in the 20s?", "Advice for a young man?"]
  }
];

type ViewState = 'landing' | 'auth' | 'dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [activePersona, setActivePersona] = useState<LegacyPersona | null>(null);
  const [isPreserving, setIsPreserving] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [personas, setPersonas] = useState<LegacyPersona[]>(INITIAL_PERSONAS);

  const handleCreateNew = (newPersona: LegacyPersona) => {
    setPersonas([newPersona, ...personas]);
    setIsPreserving(false);
    setActivePersona(newPersona); // Open chat immediately
  };

  // View Routing
  if (view === 'auth') {
    return <AuthPage onLogin={() => setView('dashboard')} />;
  }

  if (view === 'dashboard') {
    return <Dashboard onLogout={() => setView('landing')} />;
  }

  // Landing View
  return (
    <div className="min-h-screen font-sans text-cradle-text bg-[#FDFCF8] overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="flex items-center justify-center px-6 py-5 md:px-12 fixed top-0 left-0 right-0 z-50 bg-[#FDFCF8]/90 backdrop-blur-sm border-b border-transparent transition-all duration-300">
        {/* Logo */}
        <Logo 
          className="cursor-pointer" 
          onClick={() => setView('landing')}
        />
      </nav>

      {/* Main Content */}
      <main className="pt-32">
        
        {/* Hero Section */}
        <div className="text-center px-6 max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cradle-brand/20 bg-cradle-brand/5 mb-8 cursor-pointer hover:border-cradle-brand/40 transition">
             <span className="text-xs font-bold text-cradle-brand tracking-wide">THE ARCHIVE OF LOVE</span>
             <span className="text-xs text-cradle-text/60">— preserve the voices that matter</span>
             <ArrowRightIcon className="w-3 h-3 text-cradle-text/40"/>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-medium leading-[0.95] tracking-tight mb-8 text-cradle-text">
            Turn your family stories <br/> <span className="text-cradle-brand italic">into</span> legacy
          </h1>
          
          <p className="text-lg md:text-xl text-cradle-text/60 max-w-2xl mx-auto leading-relaxed mb-10">
            Easily preserve your family's precious memories through voice recordings and transform them into interactive personas that last forever.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => window.open('https://app.tymeless.ai', '_blank')}
              className="px-8 py-4 bg-cradle-brand text-white rounded-xl font-medium text-lg hover:bg-black transition shadow-lg shadow-cradle-brand/25 hover:shadow-xl w-full sm:w-auto"
            >
              Start Preserving
            </button>
            <button 
              onClick={() => setIsVideoOpen(true)}
              className="px-8 py-4 bg-white border border-gray-200 text-cradle-text rounded-xl font-medium text-lg hover:bg-gray-50 transition w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <PlayCircle size={20} className="text-cradle-brand" /> How it Works
            </button>
          </div>
        </div>

        {/* Carousel / Grid */}
        <div className="px-4 md:px-8 overflow-x-hidden mb-24 relative">
          {/* Scroll hint for mobile */}
          <div className="md:hidden absolute top-0 right-4 z-10 bg-cradle-bg/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-cradle-text/60 flex items-center gap-1.5">
            <ChevronLeft size={14} />
            <span>Swipe</span>
            <ChevronRight size={14} />
          </div>
          
          {/* Scroll container with fade gradients */}
          <div className="relative">
            {/* Left fade gradient - mobile only */}
            <div className="md:hidden absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-cradle-bg to-transparent pointer-events-none z-10"></div>
            
            {/* Right fade gradient - mobile only */}
            <div className="md:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-cradle-bg to-transparent pointer-events-none z-10"></div>
            
            {/* Scroll container */}
            <div className="flex gap-6 overflow-x-auto pb-12 px-4 md:px-12 no-scrollbar snap-x">
               {personas.map((persona) => (
                 <LegacyCard 
                   key={persona.id} 
                   persona={persona} 
                   onClick={setActivePersona}
                 />
               ))}
               
               {/* Add New Card (Visual placeholder for action) */}
               <div 
                 onClick={() => window.open('https://app.tymeless.ai', '_blank')}
                 className="group relative h-[420px] w-full md:w-[340px] flex-shrink-0 rounded-2xl border-2 border-dashed border-cradle-text/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-cradle-brand/30 transition-all"
               >
                  <div className="w-16 h-16 rounded-full bg-cradle-brand/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Plus size={32} className="text-cradle-brand" />
                  </div>
                  <h3 className="text-xl font-serif text-cradle-text">Add Loved One</h3>
                  <p className="text-sm text-cradle-text/50 mt-2">Begin the journey</p>
               </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <Features />

        {/* Trust Section */}
        <Trust />

        {/* CTA Section */}
        <CallToAction />

      </main>

      {/* Footer */}
      <Footer />


      {/* Modals */}
      {activePersona && (
        <ChatInterface 
          persona={activePersona} 
          onClose={() => setActivePersona(null)} 
        />
      )}

      {isPreserving && (
        <PreservationWizard 
          onComplete={handleCreateNew}
          onCancel={() => setIsPreserving(false)}
        />
      )}

      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
           <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
              <button 
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-white hover:text-black text-white rounded-full backdrop-blur-md transition-all"
              >
                <X size={24} />
              </button>
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/V6-0kYhqoRo?autoplay=1" 
                title="Tymeless - Preserving Memories" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                className="w-full h-full"
              ></iframe>
           </div>
        </div>
      )}

    </div>
  );
};

const ArrowRightIcon = ({className}:{className?:string}) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3.33334 8H12.6667" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M8 3.33331L12.6667 7.99998L8 12.6666" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default App;