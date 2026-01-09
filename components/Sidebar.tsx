
import React, { useState, useEffect } from 'react';
import { ChatSession } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onOpenPrivacy: () => void;
  onClearHistory: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  sessions, 
  currentSessionId, 
  onSelectSession, 
  onNewChat,
  onOpenPrivacy,
  onClearHistory
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("To download: Tap the Share icon (iOS) or Menu icon (Android) and select 'Add to Home Screen'.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="tap-target glass-v4 rounded-2xl p-3 text-sky-400 border border-white/10 shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
          </svg>
        </button>
      </div>

      <div className={`
        fixed inset-y-0 left-0 z-40 w-80 transform transition-transform duration-500 ease-in-out md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col glass-v4 border-r border-white/10 h-full overflow-hidden
      `}>
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-sky-500/10 blur-[100px] rounded-full"></div>
        
        <div className="p-6 relative z-10 pt-20 md:pt-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center border border-white/10 bot-glow">
              <svg className="w-7 h-7 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tighter text-white">Anywaa AI</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Quantum Hub</p>
            </div>
          </div>

          <button 
            onClick={() => { onNewChat(); setIsOpen(false); }}
            className="w-full py-4 px-4 bg-sky-500/10 hover:bg-sky-500/20 transition-all rounded-2xl font-bold flex items-center justify-center gap-3 border border-sky-500/30 overflow-hidden tap-target mb-3"
          >
            <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>New Evolution</span>
          </button>

          <button 
            onClick={handleInstallClick}
            className="w-full py-3 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all rounded-2xl font-bold flex items-center justify-center gap-3 border border-emerald-500/30 text-emerald-400 text-xs uppercase tracking-widest"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download App</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-3 custom-scrollbar">
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500 px-2 mb-4">History Archives</p>
          {sessions.map(session => (
            <button
              key={session.id}
              onClick={() => { onSelectSession(session.id); setIsOpen(false); }}
              className={`w-full text-left p-4 rounded-2xl transition-all border tap-target ${
                currentSessionId === session.id 
                  ? 'bg-sky-500/10 border-sky-500/30 text-white' 
                  : 'text-slate-400 hover:bg-white/5 border-transparent'
              }`}
            >
              <span className="truncate block font-semibold text-sm mb-1">{session.title}</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase">{new Date(session.updatedAt).toLocaleDateString()}</span>
            </button>
          ))}
        </div>

        <div className="p-4 bg-slate-900/40 border-t border-white/5 space-y-2 pb-safe-bottom">
          <button onClick={onOpenPrivacy} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-slate-400 text-xs font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Privacy Shield
          </button>
          <button onClick={onClearHistory} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-slate-500 text-xs font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Purge Synapses
          </button>
        </div>
      </div>

      {isOpen && <div className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default Sidebar;
