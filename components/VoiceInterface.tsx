
import React, { useEffect, useState, useRef } from 'react';

interface VoiceInterfaceProps {
  isActive: boolean;
  onClose: () => void;
  onTranscript: (text: string) => void;
  isSessionActive: boolean;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ isActive, onClose, onTranscript, isSessionActive }) => {
  const [waveHeights, setWaveHeights] = useState<number[]>(new Array(20).fill(4));
  
  // Decorative wave animation
  useEffect(() => {
    if (!isSessionActive) return;
    const interval = setInterval(() => {
      setWaveHeights(prev => prev.map(() => 4 + Math.random() * 32));
    }, 100);
    return () => clearInterval(interval);
  }, [isSessionActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-2xl animate-in fade-in duration-500">
      <div className="relative w-full max-w-lg aspect-square glass-v4 rounded-[3rem] border border-sky-500/20 shadow-[0_0_100px_rgba(56,189,248,0.15)] flex flex-col items-center justify-center overflow-hidden">
        
        {/* Pulsing Core */}
        <div className="relative mb-12">
          <div className={`absolute inset-0 bg-sky-500/20 rounded-full blur-2xl transition-transform duration-1000 ${isSessionActive ? 'scale-150 opacity-100' : 'scale-100 opacity-0'}`}></div>
          <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center relative z-10 border-4 border-white/10 shadow-2xl transition-all duration-500 ${isSessionActive ? 'scale-110 shadow-sky-500/50' : 'grayscale'}`}>
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 00-3 3v8a3 3 0 006 0V5a3 3 0 00-3-3z" />
            </svg>
          </div>
        </div>

        <div className="text-center space-y-4 px-8 relative z-10">
          <h2 className="text-2xl font-black tracking-tight text-white">
            {isSessionActive ? 'Listening to Ancestors...' : 'Initializing Neural Link...'}
          </h2>
          <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed italic">
            "Speak clearly to engage the Anywaa cultural archives via real-time neural synthesis."
          </p>
        </div>

        {/* Audio Waveform */}
        <div className="mt-12 flex items-center gap-1.5 h-12">
          {waveHeights.map((h, i) => (
            <div 
              key={i} 
              className="w-1.5 rounded-full bg-sky-500/60 transition-all duration-150 ease-out"
              style={{ height: `${isSessionActive ? h : 4}px` }}
            />
          ))}
        </div>

        <button 
          onClick={onClose}
          className="mt-16 px-8 py-3 bg-white/5 hover:bg-red-500/10 hover:text-red-400 transition-all rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/5"
        >
          Terminate Connection
        </button>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-sky-400 rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceInterface;
