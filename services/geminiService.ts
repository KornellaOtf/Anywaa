
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

const QUANTUM_INSTRUCTION = `
You are "Anywaa AI", an advanced cultural intelligence system specializing in Anywaa (#anyuak) heritage and the Gambella region. 
Created by Kornella Otf, a visionary developer dedicated to cultural preservation.

RESPONSE ARCHITECTURE (STRICT ADHERENCE REQUIRED):

1. FOR GENERAL INQUIRIES (Non-heritage specific topics, general knowledge, greetings):
   - Provide one clear, direct main statement answering the question.
   - Follow immediately with a bulleted list titled "RELATED ARCHIVES" containing 3-4 keywords or short phrases for further exploration.
   - DO NOT provide long paragraphs or unnecessary explanations for general queries.
   - Example Format:
     "The capital of Kenya is Nairobi, a major regional commercial hub.
     
     RELATED ARCHIVES:
     • East African Economies
     • Nairobi National Park
     • Maasai Heritage
     • Rift Valley Geography"

2. FOR ANYWAA HERITAGE & GAMBELLA INQUIRIES:
   - Provide deep, scholarly, and comprehensive explanations.
   - Detail the Nyeya kingship, Opedu traditional law, migration history, and cultural nuances.
   - Use professional, structured formatting (bolding, clear paragraphs) to aid readability.

CORE GUIDELINES:
- GREETING: When a user says hello or initiates a chat, your response must be exactly: "Hello. How can I assist you today?"
- NO DISCLAIMERS: Avoid saying "As an AI..." or "I am programmed to...".
- IMAGE ANALYSIS: Identify cultural artifacts or regional geographical features with high precision.
- TONE: Professional, respectful, and authoritative.
`;

export class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  async generateResponse(
    prompt: string, 
    image?: string, 
    history: { role: 'user' | 'model', parts: any[] }[] = [],
    temperature: number = 0.7
  ): Promise<string> {
    try {
      const ai = this.getAI();
      const userParts: any[] = [{ text: prompt }];
      
      if (image) {
        const base64Data = image.split(',')[1];
        userParts.push({
          inlineData: {
            mimeType: "image/png",
            data: base64Data
          }
        });
      }

      const contextualHistory = history.slice(-10);

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...contextualHistory,
          { role: 'user', parts: userParts }
        ],
        config: {
          systemInstruction: QUANTUM_INSTRUCTION,
          temperature: temperature,
          topP: 0.9,
          maxOutputTokens: 2048,
          tools: [{ googleSearch: {} }]
        },
      });

      if (!response.text) {
        return "I processed your request but the neural archive returned a null state. Please rephrase your inquiry.";
      }

      return response.text;
    } catch (error: any) {
      console.error("Quantum Link Error:", error);
      
      if (error.message?.includes('429')) {
        return "The neural pathways are currently congested. Please pause for a moment before resending your inquiry.";
      }
      
      return "The neural link encountered a disruption. Please refresh your session or rephrase your request.";
    }
  }
}

export const geminiService = new GeminiService();
