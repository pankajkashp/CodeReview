import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import process from "node:process";
import { analyzeCodeWithGemini, simulatedReview } from "../reviewService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.post(["/api/review", "/"], async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ error: "No code provided" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json(simulatedReview("GEMINI_API_KEY not configured."));
    }

    const result = await analyzeCodeWithGemini(code);
    res.json(result);
  } catch (err) {
    console.error("⚠️ GEMINI ERROR:", err);
    
    if (err.status === 401 || err.status === 403 || !process.env.GEMINI_API_KEY) {
      return res.json({
        errors: ["[Fallback] Please configure your GEMINI_API_KEY in Vercel settings"],
        optimization: ["[Simulated] Use efficient array methods"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        improvedCode: "// Gemini integration error. Please check your key.",
        score: 85,
        simulated: true
      });
    }

    res.status(500).json({ error: "Gemini analysis failed" });
  }
});

// For Vercel, we export the app instance
export default app;
