import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ------------------ ANALYZE ROUTE ------------------ */
app.post("/review", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "No code provided" });
    }

    const prompt = `Analyze this code and return ONLY valid JSON (no markdown, no backticks). Use this exact shape:
{
  "errors": ["description of each bug or issue"],
  "optimization": ["each optimization suggestion"],
  "timeComplexity": "e.g. O(n)",
  "spaceComplexity": "e.g. O(1)",
  "improvedCode": "the full improved/refactored version of the code",
  "score": 85
}

Code to analyze:
${code}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a senior software architect. Respond only with valid JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    res.json(result);

  } catch (err) {
    console.error("⚠️ OPENAI ERROR:", err);
    
    // Fallback if key is missing or API fails
    if (err.status === 401 || !process.env.OPENAI_API_KEY) {
      return res.json({
        errors: ["[Fallback] Please configure your OPENAI_API_KEY in .env"],
        optimization: ["[Simulated] Use efficient array methods"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        improvedCode: "// Switch from Gemini to OpenAI successful. Please add your key.",
        score: 85,
        simulated: true
      });
    }

    res.status(500).json({ error: "OpenAI analysis failed" });
  }
});

/* ------------------ START SERVER ------------------ */
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});