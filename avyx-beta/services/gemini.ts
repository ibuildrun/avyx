
import { GoogleGenAI, Type } from "@google/genai";

export const generateTaskAnalysis = async (taskDescription: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Проанализируй эту задачу по дизайну и дай 3 коротких, мотивирующих совета на русском языке для дизайнера. Тон должен быть дружелюбным и профессиональным. Задача: "${taskDescription}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["tips"]
        }
      }
    });
    
    if (!response.text) throw new Error("Empty response");
    return JSON.parse(response.text.trim());
  } catch (error: any) {
    console.warn("Gemini API Error:", error.message);
    return { tips: [
      "Проанализируй конкурентов перед началом работы", 
      "Уточни предпочтения по цветовой палитре у заказчика", 
      "Начни с создания мудборда для согласования стиля"
    ] };
  }
};

export const generateTaskDescription = async (title: string, category: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Напиши подробное, дружелюбное и профессиональное техническое задание для дизайнера на русском языке. Заголовок: "${title}", Категория: "${category}". Включи пункты: Описание, Пожелания по стилю, Ожидаемый результат.`,
    });
    return response.text;
  } catch (error) {
    return "Не удалось сгенерировать описание. Попробуйте ввести вручную.";
  }
};

export const generatePromoCode = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};
