import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export default async function getFixSuggestion(violation) {

  const prompt = `
You are a WCAG accessibility expert.

Violation rule: ${violation.id}

Description: ${violation.description}

HTML:
${violation.html}

Return JSON only:

{
 "rule": "",
 "issue": "",
 "fix": ""
}
`;

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt
  });

  return result.text;
}