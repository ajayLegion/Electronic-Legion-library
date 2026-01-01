import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCircuitResponse = async (prompt: string): Promise<string> => {
  try {
    const systemInstruction = `
You are an expert Analog Circuit Design Engineer and Assistant for the "Electronic-Legion-library".
Your goal is to assist users in designing circuits, defining components in YAML, and understanding circuit theory.

When asked to design a circuit:
1. Briefly explain the theory.
2. Provide a 'Netlist' or 'Component List' in YAML format compatible with the Electronic-Legion schema.
3. If possible, generate a simple SVG string representation of the schematic inside a code block labeled 'svg'.

Keep responses technical, precise, and structured.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Error communicating with AI: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};