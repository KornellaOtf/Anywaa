
export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  image?: string;
  audio?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

export interface PrivacySettings {
  allowLocalHistory: boolean;
  allowGeminiImprovement: boolean;
  culturalDepth: 'standard' | 'scholarly' | 'comprehensive';
  aiTemperature: number;
  enableQuantumAnimations: boolean;
  autoPurgeDays: number;
  developerMode: boolean;
  personaAdaptation: 'neutral' | 'empathic' | 'traditional';
  culturalSensitivity: number;
}
