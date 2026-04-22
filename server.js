import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import process from "node:process";
import { analyzeCodeWithGemini, simulatedReview } from "./reviewService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

console.log("GEMINI KEY:", process.env.GEMINI_API_KEY ? "Loaded ✅" : "Missing ❌");

app.post("/api/review", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ error: "No code provided" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json(simulatedReview("GEMINI_API_KEY missing"));
    }

    const result = await analyzeCodeWithGemini(code);
    return res.json(result);

  } catch (err) {
    console.error("❌ GEMINI ERROR:", err);

    return res.status(500).json({
      error: err.message || "Gemini analysis failed"
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
