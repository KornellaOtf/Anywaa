
import React from 'react';
import { PrivacySettings } from '../types';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PrivacySettings;
  onUpdateSettings: (settings: PrivacySettings) => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose, settings, onUpdateSettings }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-morphism w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center border border-white/20 shadow-lg shadow-sky-500/20">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">System Configuration</h2>
              <p className="text-[10px] text-sky-400 uppercase font-bold tracking-[0.2em]">Neural & Privacy Parameters</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* AI Persona Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Persona Adaptation</h3>
            <div className="grid gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Neural Persona Mode</h4>
                    <p className="text-xs text-slate-400">Adapt Anywaa AI's tone of voice to your preference.</p>
                  </div>
                </div>
                <div className="flex gap-1 bg-slate-800 p-1 rounded-xl">
                  {(['neutral', 'empathic', 'traditional'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => onUpdateSettings({...settings, personaAdaptation: mode})}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
                        settings.personaAdaptation === mode 
                          ? 'bg-indigo-500 text-white shadow-lg' 
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Cultural Sensitivity Filter</h4>
                    <p className="text-xs text-slate-400">Adjust the intensity of cultural contextualization.</p>
                  </div>
                  <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md">{Math.round(settings.culturalSensitivity * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.05" 
                  value={settings.culturalSensitivity} 
                  onChange={(e) => onUpdateSettings({...settings, culturalSensitivity: parseFloat(e.target.value)})}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </section>

          {/* Neural Parameters (Existing) */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Neural Parameters</h3>
            <div className="grid gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Creative Variance (Temperature)</h4>
                    <p className="text-xs text-slate-400">Higher values produce more creative, unexpected responses.</p>
                  </div>
                  <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2 py-1 rounded-md">{settings.aiTemperature}</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.1" 
                  value={settings.aiTemperature} 
                  onChange={(e) => onUpdateSettings({...settings, aiTemperature: parseFloat(e.target.value)})}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex-1 pr-4">
                  <h4 className="text-sm font-bold text-slate-200">Cultural Fidelity Depth</h4>
                  <p className="text-xs text-slate-400">Target depth for Anywaa heritage archives.</p>
                </div>
                <div className="flex gap-1 bg-slate-800 p-1 rounded-xl">
                  {['standard', 'scholarly', 'comprehensive'].map((depth) => (
                    <button
                      key={depth}
                      onClick={() => onUpdateSettings({...settings, culturalDepth: depth as any})}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                        settings.culturalDepth === depth 
                          ? 'bg-sky-500 text-white shadow-lg' 
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {depth}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Memory & Privacy (Existing) */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Memory & Privacy</h3>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex-1 pr-4">
                  <h4 className="text-sm font-bold text-slate-200">Local Synapse Storage</h4>
                  <p className="text-xs text-slate-400">Persist session logs in your browser's encrypted vault.</p>
                </div>
                <Toggle 
                  checked={settings.allowLocalHistory} 
                  onChange={(val) => onUpdateSettings({...settings, allowLocalHistory: val})} 
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex-1 pr-4">
                  <h4 className="text-sm font-bold text-slate-200">Auto-Purge Cycles</h4>
                  <p className="text-xs text-slate-400">Automatically collapse old memories after a set period.</p>
                </div>
                <select 
                  className="bg-slate-800 border-none text-xs rounded-lg p-2 text-sky-400 focus:ring-1 focus:ring-sky-500"
                  value={settings.autoPurgeDays}
                  onChange={(e) => onUpdateSettings({...settings, autoPurgeDays: parseInt(e.target.value)})}
                >
                  <option value={0}>Never</option>
                  <option value={7}>7 Days</option>
                  <option value={30}>30 Days</option>
                  <option value={90}>90 Days</option>
                </select>
              </div>
            </div>
          </section>

          {/* Visual Synthesis (Existing) */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Visual Synthesis</h3>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex-1 pr-4">
                  <h4 className="text-sm font-bold text-slate-200">Quantum Materialization</h4>
                  <p className="text-xs text-slate-400">Enable advanced phasing and shimmer animations for AI responses.</p>
                </div>
                <Toggle 
                  checked={settings.enableQuantumAnimations} 
                  onChange={(val) => onUpdateSettings({...settings, enableQuantumAnimations: val})} 
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex-1 pr-4">
                  <h4 className="text-sm font-bold text-slate-200">Developer Diagnostics</h4>
                  <p className="text-xs text-slate-400">Show hidden metadata and response tokens.</p>
                </div>
                <Toggle 
                  checked={settings.developerMode} 
                  onChange={(val) => onUpdateSettings({...settings, developerMode: val})} 
                />
              </div>
            </div>
          </section>

          <div className="bg-sky-500/5 border border-sky-500/20 rounded-2xl p-4 text-center">
            <p className="text-[10px] text-sky-400/80 leading-relaxed italic">
              "Anywaa AI is a bridge between ancestral wisdom and future computation. Your data remains your own, used only to illuminate the path forward."
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-900/80 border-t border-white/10 shrink-0">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 transition-all rounded-2xl font-black text-white shadow-[0_10px_30px_rgba(56,189,248,0.3)] uppercase tracking-[0.2em] text-xs"
          >
            Commit Configurations
          </button>
          <p className="text-center mt-4 text-[9px] text-slate-600 font-bold uppercase tracking-widest">
            Neural Core v3.5.2 • Distributed via Anywaa Mesh
          </p>
        </div>
      </div>
    </div>
  );
};

const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (val: boolean) => void }) => (
  <label className="relative inline-flex items-center cursor-pointer group">
    <input 
      type="checkbox" 
      className="sr-only peer" 
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500 group-active:scale-95 transition-transform shadow-inner"></div>
  </label>
);

export default PrivacyModal;
