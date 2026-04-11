import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ------------------ OPENAI ------------------ */
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

    let finalResult;

    /* ------------------ 🧪 TEST MODE ------------------ */
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith("your_")) {
      console.log("⚠️ TEST MODE (no valid API key)");

      finalResult = {
        errors: ["No major bugs found"],
        optimization: ["Improve naming", "Use modern syntax"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        improvedCode: "// optimized version of your code",
        score: 90
      };
    }

    /* ------------------ 🤖 AI MODE ------------------ */
    else {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are an expert code reviewer. Analyze the provided code thoroughly and return ONLY valid JSON with these fields:
- "errors": Array of strings describing bugs, logic errors, or potential runtime issues. Be specific (e.g. "Missing null check on line 3 could cause NullPointerException").
- "optimization": Array of strings with specific optimization suggestions (e.g. "Replace linear search with binary search for O(log n) lookup").
- "timeComplexity": String with Big-O time complexity (e.g. "O(n)").
- "spaceComplexity": String with Big-O space complexity (e.g. "O(1)").
- "improvedCode": String containing a fully refactored, optimized version of the code with comments.
- "score": Integer 0-100 rating the original code quality.`
          },
          {
            role: "user",
            content: `Analyze this code:\n\n${code}`
          }
        ]
      });

      const output = completion.choices[0].message.content;

      try {
        finalResult = JSON.parse(output);
      } catch {
        finalResult = {
          errors: [],
          optimization: [],
          timeComplexity: "Unknown",
          spaceComplexity: "Unknown",
          improvedCode: output,
          score: 70
        };
      }
    }

    return res.json(finalResult);

  } catch (err) {
    console.error("❌ ERROR:", err.message);
    if (err.message?.includes("429") || err.status === 429) {
      return res.status(429).json({ error: "OpenAI quota exceeded. Please check your billing at platform.openai.com" });
    }
    if (err.message?.includes("401") || err.status === 401) {
      return res.status(401).json({ error: "Invalid OpenAI API key. Please check your .env file." });
    }
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

/* ------------------ HISTORY (TEMP MOCK) ------------------ */
app.get("/history", (req, res) => {
  res.json([]); // no DB for now
});

/* ------------------ START SERVER ------------------ */
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});