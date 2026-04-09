import getGeminiResponse from "./geminiService.js";

export async function generateBatchFixes(violations) {

  if (!violations || violations.length === 0) {
    return [];
  }

  const selected = violations.slice(0, 10);

  const formatted = selected.map((v, i) => {

    return `
${i + 1}.
Rule: ${v.id}

Issue:
${v.description}

HTML:
${v.nodes?.[0]?.html || ""}
`;

  }).join("\n");

  const prompt = `
You are a WCAG accessibility expert.

Fix the following accessibility issues.

${formatted}

Return ONLY valid JSON in this format:

[
 {
  "rule": "",
  "issue": "",
  "fix": ""
 }
]
`;

  const response = await getGeminiResponse(prompt);

  console.log("Gemini raw response:", response);

  try {

    const cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);

  } catch (err) {

    console.error("Gemini JSON parse failed");

    return [];

  }

}