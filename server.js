import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

HEAD
const GEMINI_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_KEY) {
  console.warn("⚠️  GEMINI_API_KEY is missing from .env — /review will return a simulated response.");
}

const genAI = GEMINI_KEY ? new GoogleGenerativeAI(GEMINI_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-2.5-flash" }) : null;

function simulated(reason) {
  return {
    errors: [`[Simulated] ${reason}`],
    optimization: ["[Simulated] Add GEMINI_API_KEY to .env and restart the server."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    improvedCode: "// Simulation response — configure GEMINI_API_KEY to get a real review.",
    score: 75,
    simulated: true
  };
}

function parseGeminiJson(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? match[0] : cleaned);
}

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 3db12486b5fc272057871d41b9ba08d2db6728ec

app.post("/review", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ error: "No code provided" });
    }

    if (!model) {
      return res.json(simulated("GEMINI_API_KEY not configured."));
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

 HEAD
    const aiResult = await model.generateContent(prompt);
    const text = aiResult.response.text();

    let result;
    try {
      result = parseGeminiJson(text);
    } catch (parseErr) {
      console.error("Failed to parse Gemini JSON:", text);
      result = {
        errors: ["Structural analysis inconclusive — model returned unparseable output."],
        optimization: ["Try re-running the analysis."],
        timeComplexity: "Unknown",
        spaceComplexity: "Unknown",
        improvedCode: text,
        score: 70
      };
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a senior software architect. Respond only with valid JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
3db12486b5fc272057871d41b9ba08d2db6728ec

    const result = JSON.parse(completion.choices[0].message.content);
    res.json(result);
  } catch (err) {
HEAD
    console.error("⚠️ GEMINI ERROR:", err?.message || err);

    const msg = String(err?.message || "");
    if (msg.includes("API key not valid") || msg.includes("API_KEY_INVALID")) {
      return res.json(simulated("Invalid GEMINI_API_KEY."));
    }
    if (msg.includes("not found") || msg.includes("404")) {
      return res.json(simulated("Gemini model not reachable from this key."));
    }

    res.status(500).json({ error: "Gemini analysis failed: " + msg });

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
 3db12486b5fc272057871d41b9ba08d2db6728ec
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Gemini review server running on http://localhost:${PORT}`);
});
