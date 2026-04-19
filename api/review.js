import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function simulated(reason) {
  return {
    errors: [`[Simulated] ${reason}`],
    optimization: ["[Simulated] Add OPENAI_API_KEY to Vercel environment variables."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    improvedCode: "// Simulation response — configure OPENAI_API_KEY to get a real review.",
    score: 75,
    simulated: true
  };
}

app.post("/api/review", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ error: "No code provided" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.json(simulated("OPENAI_API_KEY not configured."));
    }

    const prompt = `You are a senior software engineer reviewing DSA code.
Analyze the code below and return ONLY valid JSON (no markdown, no backticks, no commentary) matching this exact shape:
{
  "errors": ["each bug, logic issue, or edge-case the code misses"],
  "optimization": ["each concrete optimization or better approach"],
  "timeComplexity": "Big-O time complexity, e.g. O(n log n)",
  "spaceComplexity": "Big-O space complexity, e.g. O(1)",
  "improvedCode": "a fully optimized/refactored version of the code as a string (keep newlines)",
  "score": 0-100 integer rating the original code quality
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
    
    if (err.status === 401 || !process.env.OPENAI_API_KEY) {
      return res.json({
        errors: ["[Fallback] Please configure your OPENAI_API_KEY in Vercel settings"],
        optimization: ["[Simulated] Use efficient array methods"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        improvedCode: "// OpenAI integration error. Please check your key.",
        score: 85,
        simulated: true
      });
    }

    res.status(500).json({ error: "OpenAI analysis failed" });
  }
});

// For Vercel, we export the app instance
export default app;
