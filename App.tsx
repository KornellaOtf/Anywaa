
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import PrivacyModal from './components/PrivacyModal';
import { ChatSession, Message, PrivacySettings } from './types';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    allowLocalHistory: true,
    allowGeminiImprovement: true,
    culturalDepth: 'scholarly',
    aiTemperature: 0.7,
    enableQuantumAnimations: true,
    autoPurgeDays: 0,
    developerMode: false,
    personaAdaptation: 'neutral',
    culturalSensitivity: 0.8
  });

  // Load data from localStorage with error handling
  useEffect(() => {
    try {
        const savedSessions = localStorage.getItem('anywaa_quantum_sessions');
        const savedSettings = localStorage.getItem('anywaa_quantum_privacy');
        
        if (savedSessions) {
          const parsed = JSON.parse(savedSessions);
          setSessions(parsed);
          if (parsed.length > 0) {
            setCurrentSessionId(parsed[0].id);
          }
        }
        
        if (savedSettings) {
          setPrivacySettings(prev => ({...prev, ...JSON.parse(savedSettings)}));
        }
    } catch (e) {
        console.error("Session Synchronization Error", e);
    }
  }, []);

  // Save data to localStorage with atomic consistency
  useEffect(() => {
    if (privacySettings.allowLocalHistory) {
      localStorage.setItem('anywaa_quantum_sessions', JSON.stringify(sessions));
    } else {
      localStorage.removeItem('anywaa_quantum_sessions');
    }
    localStorage.setItem('anywaa_quantum_privacy', JSON.stringify(privacySettings));
  }, [sessions, privacySettings]);

  const currentSession = sessions.find(s => s.id === currentSessionId) || null;

  const handleNewChat = useCallback(() => {
    const newSession: ChatSession = {
      id: `quantum_${Date.now()}`,
      title: 'Neural Evolution Initiated',
      messages: [],
      updatedAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  }, []);

  const handleSendMessage = async (text: string, image?: string) => {
    if (!currentSessionId) {
      handleNewChat();
      setTimeout(() => handleSendMessage(text, image), 50);
      return;
    }

    const userMsg: Message = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      text,
      image,
      timestamp: Date.now()
    };

    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        const title = s.messages.length === 0 ? (text.substring(0, 40) || 'Quantum Thread') : s.title;
        return {
          ...s,
          messages: [...s.messages, userMsg],
          updatedAt: Date.now(),
          title
        };
      }
      return s;
    }));

    setIsTyping(true);

    try {
      const history = currentSession?.messages.map(m => {
        const parts: any[] = [{ text: m.text }];
        if (m.image) {
          parts.push({
            inlineData: {
              mimeType: "image/png",
              data: m.image.split(',')[1]
            }
          });
        }
        return {
          role: m.role,
          parts: parts
        };
      }) || [];

      // Pass privacy-controlled temperature and depth (context)
      const responseText = await geminiService.generateResponse(
        text, 
        image, 
        history, 
        privacySettings.aiTemperature
      );
      
      const botMsg: Message = {
        id: `msg_model_${Date.now()}`,
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };

      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            messages: [...s.messages, botMsg],
            updatedAt: Date.now()
          };
        }
        return s;
      }));
    } catch (err) {
      console.error("Neural Interface Failure", err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('WARNING: This will permanently collapse the local cultural memory. Proceed?')) {
      setSessions([]);
      setCurrentSessionId(null);
      localStorage.removeItem('anywaa_quantum_sessions');
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-transparent">
      <Sidebar 
        sessions={sessions} 
        currentSessionId={currentSessionId}
        onSelectSession={setCurrentSessionId}
        onNewChat={handleNewChat}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onClearHistory={handleClearHistory}
      />
      <main className="flex-1 flex flex-col min-w-0 relative">
        <ChatWindow 
          messages={currentSession?.messages || []} 
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
        />
      </main>

      <PrivacyModal 
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        settings={privacySettings}
        onUpdateSettings={setPrivacySettings}
      />
    </div>
  );
};

export default App;
