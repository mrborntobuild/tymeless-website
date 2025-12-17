import React, { useState, useEffect, useRef } from 'react';
import { LegacyPersona, ChatMessage } from '../types';
import { createPersonaChat } from '../services/geminiService';
import { X, Send, Mic, Sparkles } from 'lucide-react';
import { Chat } from '@google/genai';

interface ChatInterfaceProps {
  persona: LegacyPersona;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ persona, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Chat
    chatSessionRef.current = createPersonaChat(persona);
    
    // Initial greeting
    const initialGreeting: ChatMessage = {
      id: 'init',
      role: 'model',
      text: `Hello, sweetheart. I'm here. What's on your mind today?`,
      timestamp: new Date()
    };
    setMessages([initialGreeting]);
  }, [persona]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessage({ message: userMsg.text });
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: result.text || "I'm having a little trouble remembering right now...",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cradle-text/40 backdrop-blur-sm p-4">
      <div className="bg-cradle-bg w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Sidebar / Visual */}
        <div className="w-full md:w-1/3 bg-cradle-card relative hidden md:block">
          <img 
            src={persona.imageUrl} 
            alt={persona.name} 
            className="w-full h-full object-cover opacity-80 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cradle-text/80 to-transparent flex flex-col justify-end p-8 text-white">
            <h2 className="text-3xl font-serif">{persona.name}</h2>
            <p className="opacity-80 mt-2 text-sm leading-relaxed">{persona.bio}</p>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-6 left-6 p-2 bg-black/20 backdrop-blur rounded-full text-white hover:bg-black/40 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white relative">
            
           {/* Mobile Header */}
           <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img src={persona.imageUrl} className="w-10 h-10 rounded-full object-cover" alt="avatar"/>
                <span className="font-serif font-semibold text-lg">{persona.name}</span>
              </div>
              <button onClick={onClose}><X className="text-gray-400" /></button>
           </div>

           {/* Messages */}
           <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-cradle-brand text-white' : 'bg-cradle-card text-cradle-text'} px-6 py-4 rounded-2xl text-lg font-light leading-relaxed shadow-sm`}>
                     {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                   <div className="bg-cradle-card px-6 py-4 rounded-2xl flex gap-2 items-center">
                     <span className="w-2 h-2 bg-cradle-text/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                     <span className="w-2 h-2 bg-cradle-text/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                     <span className="w-2 h-2 bg-cradle-text/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
           </div>

           {/* Input */}
           <div className="p-6 md:p-8 bg-white border-t border-gray-50">
             <div className="relative flex items-center bg-cradle-card rounded-full px-2 py-2">
                <button className="p-3 text-cradle-text/50 hover:text-cradle-brand hover:bg-white rounded-full transition-colors">
                  <Mic size={20} />
                </button>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={`Talk to ${persona.name.split(' ')[0]}...`}
                  className="flex-1 bg-transparent border-none focus:ring-0 px-4 text-cradle-text placeholder:text-cradle-text/40 font-light text-lg"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="p-3 bg-cradle-brand text-white rounded-full hover:bg-black transition-colors disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
             </div>
             <div className="text-center mt-4">
               <span className="text-xs text-gray-300 flex items-center justify-center gap-1">
                 <Sparkles size={10} /> Preserved by Cradle AI
               </span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;