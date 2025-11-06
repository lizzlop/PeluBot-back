import OpenAI from "openai";

export const createOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY no encontrada en variables de entorno");
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};
