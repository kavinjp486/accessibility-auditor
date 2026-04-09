import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import captureScreenshot from "./services/screenshotService.js";
import runAxeAudit from "./services/axeService.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "Accessibility auditor API running"
  });
});

app.post("/audit", async (req, res) => {

  try {

    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        error: "URL is required"
      });
    }

    console.log("Starting audit for:", url);

    const screenshotPath = await captureScreenshot(url);

    const axeResults = await runAxeAudit(url);

    res.json({
      success: true,
      screenshot: screenshotPath,
      violations: axeResults.violations
    });

  } catch (error) {

    console.error("Audit failed:", error);

    res.status(500).json({
      error: "Audit failed",
      details: error.message
    });

  }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});