import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

import captureScreenshot from "./services/screenshotService.js";
import runAxeAudit from "./services/axeService.js";
import getFixSuggestion from "./services/geminiService.js"; //

dotenv.config();
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ ERROR: GEMINI_API_KEY is not defined in .env");
  process.exit(1); // Stop the server if the key is missing
} else {
  console.log("🔑 API Key detected (starts with):", process.env.GEMINI_API_KEY.substring(0, 7));
}

const app = express();
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve screenshots so the frontend can see them
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.post("/audit", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    console.log("🚀 Starting audit for:", url);

    // 1. Capture Screenshot & Run Axe
    const screenshotPath = await captureScreenshot(url);
    const axeResults = await runAxeAudit(url);
    
    // 2. Map through violations and get AI fixes
    // We limit to top 5 to avoid hitting free-tier rate limits during demo
    const violationsWithFixes = await Promise.all(
      axeResults.violations.slice(0, 5).map(async (v) => {
        const aiFixRaw = await getFixSuggestion({
          id: v.id,
          description: v.description,
          html: v.nodes[0].html
        });
        
        // Parse the AI response (Gemini sometimes adds markdown blocks)
        const cleanJson = aiFixRaw.replace(/```json|```/g, "");
        return { ...v, aiSuggestion: JSON.parse(cleanJson) };
      })
    );

    res.json({
      success: true,
      screenshot: `http://localhost:5000/${screenshotPath}`,
      violations: violationsWithFixes,
      score: 100 - (axeResults.violations.length * 3) // Simple score logic
    });

  } catch (error) {
    console.error("❌ Audit failed:", error);
    res.status(500).json({ error: "Audit failed", details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));