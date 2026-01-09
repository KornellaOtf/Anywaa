
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import VoiceInterface from './VoiceInterface';
import { liveService } from '../services/liveService';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (text: string, image?: string) => void;
  isTyping: boolean;
}

const QuantumTypingIndicator = () => {
  return (
    <div className="flex justify-start animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="relative bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/5 px-6 py-5 rounded-2xl rounded-tl-none flex flex-col gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden min-w-[240px]">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
            <path d="M0 20 Q 25 5, 50 20 T 100 20" fill="none" stroke="url(#quantum-gradient)" strokeWidth="0.5">
              <animate attributeName="d" dur="2s" repeatCount="indefinite" values="M0 20 Q 25 5, 50 20 T 100 20; M0 20 Q 25 35, 50 20 T 100 20; M0 20 Q 25 5, 50 20 T 100 20" />
            </path>
            <defs>
              <linearGradient id="quantum-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="flex items-center gap-5 relative z-10">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-10 h-10 border border-purple-500/20 rounded-full animate-[spin_4s_linear_infinite]"></div>
            <div className="relative w-7 h-7 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)] rotate-45">
               <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-purple-400 font-black uppercase tracking-[0.3em] leading-none mb-1">Synthesizing Node</span>
            <div className="flex items-end gap-1.5 h-5 mt-1">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-1 bg-gradient-to-t from-purple-600 to-indigo-400 rounded-full animate-[quantum-wave_1.2s_infinite_ease-in-out]" style={{ animationDelay: `${i * 0.15}s`, height: `${8 + Math.random() * 12}px` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EntangledParticle = ({ index }: { index: number }) => {
  const size = Math.random() * 2 + 1;
  const delay = Math.random() * 3;
  const duration = 4 + Math.random() * 4;
  const distance = 40 + Math.random() * 30;
  return (
    <div 
      className="absolute bg-sky-400/40 rounded-full blur-[1px] pointer-events-none z-0"
      style={{ width: `${size}px`, height: `${size}px`, left: '50%', top: '50%', animation: `orbit ${duration}s infinite linear`, animationDelay: `-${delay}s`, '--orbit-distance': `${distance}px` } as any}
    />
  );
};

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isTyping }) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = () => {
    if (inputText.trim() || selectedImage) {
      onSendMessage(inputText, selectedImage || undefined);
      setInputText('');
      setSelectedImage(null);
    }
  };

  const toggleVoice = async () => {
    if (!isVoiceActive) {
      setIsVoiceActive(true);
      try {
        await liveService.connect(() => {}, () => {});
        setIsLiveConnected(true);
      } catch (e) {
        setIsVoiceActive(false);
        console.error("Voice link failed", e);
      }
    } else {
      liveService.disconnect();
      setIsVoiceActive(false);
      setIsLiveConnected(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative h-full bg-[#0a0a0a]">
      <header className="px-6 py-4 md:px-8 md:py-5 glass-v4 border-b border-white/5 flex items-center justify-between sticky top-0 z-30 pt-safe-top">
        <div className="flex items-center gap-4 ml-12 md:ml-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-500/20 bot-core">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Anywaa AI</h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Heritage Assistant</span>
            </div>
          </div>
        </div>
        <div className="hidden sm:block">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">v3.5 Professional</span>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth custom-scrollbar pb-32">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-8 animate-in fade-in duration-700">
             <div className="space-y-4">
                <h1 className="text-3xl font-bold text-white">Welcome to Anywaa AI</h1>
                <p className="text-slate-400 text-sm leading-relaxed">Direct access to Anywaa history, culture, and traditions.</p>
             </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[92%] md:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`space-y-2 relative ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                  {msg.role === 'model' && (
                    <div className="absolute inset-0 -m-10 pointer-events-none overflow-visible">
                      {[...Array(8)].map((_, i) => <EntangledParticle key={i} index={i} />)}
                    </div>
                  )}
                  <div className={`p-5 rounded-2xl relative overflow-hidden transition-all duration-700 ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-tr-none shadow-lg' : 'bg-[#1a1a1a] text-slate-100 rounded-tl-none border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.4)] animate-[materialize_1.2s_cubic-bezier(0.19,1,0.22,1)_forwards]'}`}>
                    {msg.role === 'model' && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-500/5 to-transparent -translate-x-full animate-[phasing_6s_infinite_linear]"></div>
                      </div>
                    )}
                    {msg.image && <img src={msg.image} alt="Media" className="mb-4 rounded-xl max-h-[400px] object-cover" />}
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap relative z-10 antialiased">{msg.text}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        {isTyping && <QuantumTypingIndicator />}
      </div>

      <footer className="fixed bottom-0 left-0 right-0 p-3 md:p-6 z-30 pb-safe-bottom bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#111] p-2 rounded-[1.5rem] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex items-center gap-2 relative">
            <button onClick={() => fileInputRef.current?.click()} className="p-3 hover:bg-white/5 rounded-full text-slate-400 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const r = new FileReader();
                r.onloadend = () => setSelectedImage(r.result as string);
                r.readAsDataURL(file);
              }
            }} />
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about Anywaa heritage..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-600 py-3 text-[15px] resize-none max-h-32 min-h-[44px]"
              rows={1}
            />
            
            <button 
              onClick={toggleVoice}
              className={`p-3 rounded-full transition-all flex items-center justify-center ${isVoiceActive ? 'bg-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'hover:bg-white/5 text-slate-400'}`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 00-3 3v8a3 3 0 006 0V5a3 3 0 00-3-3z" />
              </svg>
            </button>

            <button onClick={handleSend} disabled={!inputText.trim() && !selectedImage} className={`p-3 rounded-full transition-all ${inputText.trim() || selectedImage ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-800'}`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>
      </footer>

      <VoiceInterface 
        isActive={isVoiceActive} 
        onClose={toggleVoice} 
        isSessionActive={isLiveConnected}
        onTranscript={(t) => setInputText(t)}
      />
    </div>
  );
};

export default ChatWindow;
