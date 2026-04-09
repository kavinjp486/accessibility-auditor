import dotenv from "dotenv";

// Load env
dotenv.config();

export default async function getFixSuggestion(violation) {
  const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;

  if (!apiKey) {
    console.error("❌ ERROR: Missing API Key in geminiService");
    throw new Error("Missing API Key");
  }

  const prompt = `
    You are a WCAG 2.1 AA expert. 
    Fix this HTML violation: ${violation.id}
    Description: ${violation.description}
    Code: ${violation.html}
    
    Return ONLY a valid JSON object with these keys:
    "rule": short rule name,
    "issue": why it failed,
    "fix": the corrected HTML code
  `;

  // THE RAW FETCH - Bypasses all SDK bugs
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      // If it fails now, we will see the EXACT error from Google, not the SDK
      const errorText = await response.text();
      console.error(`❌ GOOGLE API REJECTED IT (Status ${response.status}):`, errorText);
      throw new Error(`API HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the text
    let textResult = data.candidates[0].content.parts[0].text;
    
    // Return it clean
    return textResult;

  } catch (err) {
    console.error("❌ Fetch Error details:", err.message);
    throw new Error("AI Fix Generation Failed");
  }
}