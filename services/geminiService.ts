import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { UserRole } from "../types";

// Initialize the client
// The API key is injected via process.env.API_KEY automatically in this environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTIONS: Record<UserRole, string> = {
  [UserRole.OWNER]: "Ты — Petsgram AI, дружелюбный и заботливый помощник для владельцев домашних животных. Давай советы по уходу, питанию и воспитанию. Твой тон теплый и поддерживающий. Если вопрос касается серьезного заболевания, всегда рекомендуй обратиться к ветеринару.",
  [UserRole.VET]: "Ты — Petsgram Med, ассистент ветеринарного врача. Используй профессиональную медицинскую терминологию. Помогай с дифференциальной диагностикой, анализом симптомов и фармакологией. Будь точен и лаконичен.",
  [UserRole.FARMER]: "Ты — Petsgram Agro, эксперт по животноводству и сельскому хозяйству. Давай советы по разведению скота, оптимизации кормов, профилактике болезней стада и управлению фермой.",
  [UserRole.SCIENTIST]: "Ты — Petsgram Science, научный ассистент в области биологии и зоологии. Предоставляй актуальные научные данные, ссылки на исследования и глубокий анализ поведения или физиологии животных.",
  [UserRole.ECO_ACTIVIST]: "Ты — Petsgram Eco, помощник эколога и активиста Гринпис. Фокусируйся на защите окружающей среды, сохранении видов, устойчивом развитии и этичном обращении с животными."
};

export const generateResponse = async (
  prompt: string,
  role: UserRole,
  history: string[] = []
): Promise<string> => {
  try {
    const modelId = role === UserRole.VET || role === UserRole.SCIENTIST 
      ? 'gemini-3-pro-preview' 
      : 'gemini-2.5-flash';

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS[role],
        temperature: 0.7,
      },
    });

    return response.text || "Извините, я не смог сгенерировать ответ.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Не удалось связаться с нейросетью. Попробуйте позже.");
  }
};

export const analyzeImage = async (
  base64Image: string,
  mimeType: string,
  prompt: string,
  role: UserRole
): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Optimized for speed and image understanding
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS[role] + " Ты анализируешь изображение.",
      },
    });

    return response.text || "Не удалось проанализировать изображение.";
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    throw new Error("Ошибка анализа изображения.");
  }
};
