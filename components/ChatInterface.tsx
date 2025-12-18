import React, { useState, useEffect, useRef } from 'react';
import { LegacyPersona, ChatMessage } from '../types';
// Switch between OpenAI and Gemini by changing this import
import { streamPersonaResponse, generateFollowUpQuestions } from '../services/openaiService';
// import { streamPersonaResponse } from '../services/geminiService';
// Removed database imports - conversations no longer persist
import { X, Send, Mic, Sparkles } from 'lucide-react';

interface ChatInterfaceProps {
  persona: LegacyPersona;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ persona, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation - always start fresh with greeting
  useEffect(() => {
    const initialGreeting: ChatMessage = {
      id: 'init',
      role: 'model',
      text: `Hello, sweetheart. I'm here. What's on your mind today?`,
      timestamp: new Date()
    };
    setMessages([initialGreeting]);
    setFollowUpQuestions([]);
  }, [persona]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  const handleSend = async () => {
    if (!input.trim() || loading) {
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    const userInput = input;
    setInput('');
    setLoading(true);
    setStreamingText('');

    try {
      let fullResponse = '';
      
      // Stream the response
      for await (const chunk of streamPersonaResponse(persona, userInput)) {
        fullResponse += chunk;
        setStreamingText(fullResponse);
      }

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: fullResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, modelMsg]);
      setStreamingText('');
      
      // Generate follow-up questions based on response
      setGeneratingQuestions(true);
      try {
        const questions = await generateFollowUpQuestions(
          persona.name,
          fullResponse,
          [...messages, userMsg, modelMsg].map(m => ({
            role: m.role,
            content: m.text
          })),
          persona.personality,
          persona.bio,
          previousQuestions
        );
        setFollowUpQuestions(questions);
        // Track these questions to avoid duplicates
        setPreviousQuestions(prev => [...prev, ...questions].slice(-20)); // Keep last 20
      } catch (err) {
        console.error('Error generating follow-up questions:', err);
        // Use default sample questions as fallback
        setFollowUpQuestions(persona.sampleQuestions?.slice(0, 5) || []);
      } finally {
        setGeneratingQuestions(false);
      }
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm having a little trouble remembering right now. Could you try again?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
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
              {/* Show sample questions initially (only when there's just the greeting message) */}
              {messages.length === 1 && messages[0].id === 'init' && !loading && !streamingText && persona.sampleQuestions && persona.sampleQuestions.length > 0 && (
                <div className="space-y-3 px-2">
                  <p className="text-xs text-gray-400 mb-2">Suggested questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {persona.sampleQuestions.slice(0, 5).map((question, qIdx) => (
                      <button
                        key={`initial-sample-${qIdx}`}
                        onClick={async () => {
                          if (loading) return;
                          
                          const userMsg: ChatMessage = {
                            id: Date.now().toString(),
                            role: 'user',
                            text: question,
                            timestamp: new Date()
                          };

                          setMessages(prev => [...prev, userMsg]);
                          setLoading(true);
                          setStreamingText('');

                          try {
                            let fullResponse = '';
                            
                            for await (const chunk of streamPersonaResponse(persona, question)) {
                              fullResponse += chunk;
                              setStreamingText(fullResponse);
                            }

                            const modelMsg: ChatMessage = {
                              id: (Date.now() + 1).toString(),
                              role: 'model',
                              text: fullResponse,
                              timestamp: new Date()
                            };
                            
                            setMessages(prev => [...prev, modelMsg]);
                            setStreamingText('');
                            
                            // Generate follow-up questions
                            setGeneratingQuestions(true);
                            try {
                              const questions = await generateFollowUpQuestions(
                                persona.name,
                                fullResponse,
                                [...messages, userMsg, modelMsg].map(m => ({
                                  role: m.role,
                                  content: m.text
                                })),
                                persona.personality,
                                persona.bio,
                                previousQuestions
                              );
                              setFollowUpQuestions(questions);
                              // Track these questions to avoid duplicates
                              setPreviousQuestions(prev => [...prev, ...questions].slice(-20));
                            } catch (err) {
                              console.error('Error generating follow-up questions:', err);
                              setFollowUpQuestions(persona.sampleQuestions?.slice(0, 5) || []);
                            } finally {
                              setGeneratingQuestions(false);
                            }
                          } catch (err) {
                            console.error(err);
                            const errorMsg: ChatMessage = {
                              id: (Date.now() + 1).toString(),
                              role: 'model',
                              text: "I'm having a little trouble remembering right now. Could you try again?",
                              timestamp: new Date()
                            };
                            setMessages(prev => [...prev, errorMsg]);
                          } finally {
                            setLoading(false);
                          }
                        }}
                        disabled={loading}
                        className="px-3 py-1.5 bg-white hover:bg-cradle-brand hover:text-white text-cradle-text rounded-full text-xs font-light transition-colors border border-gray-300 hover:border-transparent disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {messages.map((msg, index) => (
                <React.Fragment key={msg.id}>
                  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-cradle-brand text-white' : 'bg-cradle-card text-cradle-text'} px-6 py-4 rounded-2xl text-lg font-light leading-relaxed shadow-sm`}>
                     {msg.text}
                  </div>
                </div>
                  
                  {/* Show ONLY follow-up questions after each AI response (but not after initial greeting) */}
                  {msg.role === 'model' && !loading && !streamingText && index === messages.length - 1 && msg.id !== 'init' && (
                    <div className="space-y-3 px-2">
                      {/* Follow-up Questions (Generated based on response) */}
                      {generatingQuestions ? (
                        <div>
                          <p className="text-xs text-gray-400 mb-2">Follow-up questions:</p>
                          <div className="text-xs text-gray-400 px-2">Generating questions...</div>
                        </div>
                      ) : followUpQuestions.length > 0 ? (
                        <div>
                          <p className="text-xs text-gray-400 mb-2">Follow-up questions:</p>
                          <div className="flex flex-wrap gap-2">
                            {followUpQuestions.slice(0, 5).map((question, qIdx) => (
                              <button
                                key={`followup-${qIdx}`}
                                onClick={async () => {
                                  if (loading) return;
                                  
                                  const userMsg: ChatMessage = {
                                    id: Date.now().toString(),
                                    role: 'user',
                                    text: question,
                                    timestamp: new Date()
                                  };

                                  setMessages(prev => [...prev, userMsg]);
                                  setLoading(true);
                                  setStreamingText('');

                                  try {
                                    let fullResponse = '';
                                    
                                    for await (const chunk of streamPersonaResponse(persona, question)) {
                                      fullResponse += chunk;
                                      setStreamingText(fullResponse);
                                    }

                                    const modelMsg: ChatMessage = {
                                      id: (Date.now() + 1).toString(),
                                      role: 'model',
                                      text: fullResponse,
                                      timestamp: new Date()
                                    };
                                    
                                    setMessages(prev => [...prev, modelMsg]);
                                    setStreamingText('');
                                    
                                    // Generate new follow-up questions
                                    setGeneratingQuestions(true);
                                    try {
                                      const questions = await generateFollowUpQuestions(
                                        persona.name,
                                        fullResponse,
                                        [...messages, userMsg, modelMsg].map(m => ({
                                          role: m.role,
                                          content: m.text
                                        })),
                                        persona.personality,
                                        persona.bio,
                                        previousQuestions
                                      );
                                      setFollowUpQuestions(questions);
                                      // Track these questions to avoid duplicates
                                      setPreviousQuestions(prev => [...prev, ...questions].slice(-20));
                                    } catch (err) {
                                      console.error('Error generating follow-up questions:', err);
                                      setFollowUpQuestions(persona.sampleQuestions?.slice(0, 5) || []);
                                    } finally {
                                      setGeneratingQuestions(false);
                                    }
                                  } catch (err) {
                                    console.error(err);
                                    const errorMsg: ChatMessage = {
                                      id: (Date.now() + 1).toString(),
                                      role: 'model',
                                      text: "I'm having a little trouble remembering right now. Could you try again?",
                                      timestamp: new Date()
                                    };
                                    setMessages(prev => [...prev, errorMsg]);
                                  } finally {
                                    setLoading(false);
                                  }
                                }}
                                disabled={loading}
                                className="px-3 py-1.5 bg-cradle-brand/10 hover:bg-cradle-brand hover:text-white text-cradle-text rounded-full text-xs font-light transition-colors border border-cradle-brand/30 hover:border-transparent disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                              >
                                {question}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </React.Fragment>
              ))}
              
              {/* Show streaming text */}
              {streamingText && (
                <div className="flex justify-start">
                  <div className="bg-cradle-card px-6 py-4 rounded-2xl text-lg font-light leading-relaxed shadow-sm">
                    {streamingText}
                    <span className="animate-pulse">▋</span>
                  </div>
                </div>
              )}
              
              {loading && !streamingText && (
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
             {/* Debug info - remove in production */}
             {process.env.NODE_ENV === 'development' && (
               <div className="text-xs text-gray-400 mb-2">
                 Debug: input={input.length > 0 ? 'yes' : 'no'}, 
                 loading={loading ? 'yes' : 'no'}
               </div>
             )}
             
             
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
                  className="p-3 bg-cradle-brand text-white rounded-full hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={!input.trim() ? "Type a message" : loading ? "Sending..." : "Send message"}
                >
                  <Send size={20} />
                </button>
             </div>
             <div className="text-center mt-4">
               <span className="text-xs text-gray-300 flex items-center justify-center gap-1">
                 <Sparkles size={10} /> Preserved by Tymeless AI
               </span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;