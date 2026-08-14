import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import process from "node:process";

const REVIEW_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    isAnalyzable: { type: SchemaType.BOOLEAN },
    triageNote: { type: SchemaType.STRING },

    patternDetected: { type: SchemaType.STRING },
    readabilityScore: { type: SchemaType.INTEGER },
    maintainabilityScore: { type: SchemaType.INTEGER },

    whyItWorks: { type: SchemaType.STRING },
    patternExplanation: { type: SchemaType.STRING },
    interviewIntuition: { type: SchemaType.STRING },
    beginnerFriendlyNote: { type: SchemaType.STRING },

    codingMistakes: { type: SchemaType.STRING },
    namingIssues: { type: SchemaType.STRING },
    missedEdgeCases: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING }
    },
    scalabilityNotes: { type: SchemaType.STRING },

    errors: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    optimization: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },

    oldTimeComplexity: { type: SchemaType.STRING },
    newTimeComplexity: { type: SchemaType.STRING },
    oldSpaceComplexity: { type: SchemaType.STRING },
    newSpaceComplexity: { type: SchemaType.STRING },

    improvedCode: { type: SchemaType.STRING },
    score: { type: SchemaType.INTEGER }
  },
  required: [
    "isAnalyzable",
    "triageNote",
    "patternDetected",
    "readabilityScore",
    "maintainabilityScore",
    "whyItWorks",
    "patternExplanation",
    "interviewIntuition",
    "beginnerFriendlyNote",
    "codingMistakes",
    "namingIssues",
    "missedEdgeCases",
    "scalabilityNotes",
    "errors",
    "optimization",
    "oldTimeComplexity",
    "newTimeComplexity",
    "oldSpaceComplexity",
    "newSpaceComplexity",
    "improvedCode",
    "score"
  ]
};

function normalizeReviewResult(result) {
  return {
    isAnalyzable: typeof result.isAnalyzable === "boolean" ? result.isAnalyzable : true,
    triageNote: typeof result.triageNote === "string" ? result.triageNote : "",

    patternDetected: typeof result.patternDetected === "string" ? result.patternDetected : "Unknown",
    readabilityScore: Number.isFinite(Number(result.readabilityScore)) ? Math.max(0, Math.min(100, Math.round(Number(result.readabilityScore)))) : 0,
    maintainabilityScore: Number.isFinite(Number(result.maintainabilityScore)) ? Math.max(0, Math.min(100, Math.round(Number(result.maintainabilityScore)))) : 0,

    whyItWorks: typeof result.whyItWorks === "string" ? result.whyItWorks : "",
    patternExplanation: typeof result.patternExplanation === "string" ? result.patternExplanation : "",
    interviewIntuition: typeof result.interviewIntuition === "string" ? result.interviewIntuition : "",
    beginnerFriendlyNote: typeof result.beginnerFriendlyNote === "string" ? result.beginnerFriendlyNote : "",

    codingMistakes: typeof result.codingMistakes === "string" ? result.codingMistakes : "",
    namingIssues: typeof result.namingIssues === "string" ? result.namingIssues : "",
    missedEdgeCases: Array.isArray(result.missedEdgeCases) ? result.missedEdgeCases.map(String) : [],
    scalabilityNotes: typeof result.scalabilityNotes === "string" ? result.scalabilityNotes : "",

    errors: Array.isArray(result.errors) ? result.errors.map(String) : [],
    optimization: Array.isArray(result.optimization) ? result.optimization.map(String) : [],

    oldTimeComplexity: typeof result.oldTimeComplexity === "string" ? result.oldTimeComplexity : "Unknown",
    newTimeComplexity: typeof result.newTimeComplexity === "string" ? result.newTimeComplexity : "Unknown",
    oldSpaceComplexity: typeof result.oldSpaceComplexity === "string" ? result.oldSpaceComplexity : "Unknown",
    newSpaceComplexity: typeof result.newSpaceComplexity === "string" ? result.newSpaceComplexity : "Unknown",

    improvedCode: typeof result.improvedCode === "string" ? result.improvedCode : "",
    score: Number.isFinite(Number(result.score)) ? Math.max(0, Math.min(100, Math.round(Number(result.score)))) : 0
  };
}

function createSimulatedReview(reason) {
  return {
    isAnalyzable: true,
    triageNote: "",
    patternDetected: "Simulated Pattern",
    readabilityScore: 70,
    maintainabilityScore: 70,
    whyItWorks: "[Simulated] Configure GEMINI_API_KEY for a real explanation.",
    patternExplanation: "[Simulated] Pattern explanation unavailable offline.",
    interviewIntuition: "[Simulated] Interview intuition unavailable offline.",
    beginnerFriendlyNote: "[Simulated] Beginner note unavailable offline.",
    codingMistakes: "[Simulated] No live analysis performed.",
    namingIssues: "[Simulated] No live analysis performed.",
    missedEdgeCases: ["[Simulated] Configure GEMINI_API_KEY to check real edge cases."],
    scalabilityNotes: "[Simulated] Scalability notes unavailable offline.",
    errors: [`[Simulated] ${reason}`],
    optimization: ["[Simulated] Configure GEMINI_API_KEY to get a real review."],
    oldTimeComplexity: "O(n²)",
    newTimeComplexity: "O(n)",
    oldSpaceComplexity: "O(n)",
    newSpaceComplexity: "O(1)",
    improvedCode: "// Simulation response — configure GEMINI_API_KEY to get a real review.",
    score: 75,
    simulated: true
  };
}

function extractJson(text) {
  const trimmed = String(text || "").trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const firstBrace = trimmed.indexOf("{");
    const lastBrace = trimmed.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
    }

    throw new Error("Gemini returned invalid JSON");
  }
}

export function simulatedReview(reason) {
  return createSimulatedReview(reason);
}

export async function analyzeCodeWithGemini(code) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return createSimulatedReview("GEMINI_API_KEY not configured.");
  }

  // Define preferred models in order of priority
  const modelsToTry = ["gemini-3-flash-preview", "gemini-2.0-flash", "gemini-flash-lite-latest"];
  const genAI = new GoogleGenerativeAI(apiKey);

  for (const modelName of modelsToTry) {
    console.log(`🤖 INITIALIZING ANALYSIS WITH MODEL: ${modelName}`);
    
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: REVIEW_SCHEMA,
        temperature: 0.1
      },
      systemInstruction: `You are a senior software architect and mentor reviewing code for a learning platform. Follow these rules exactly.

TRIAGE (do this first):
- If the code has no meaningful algorithmic structure — a single print/log/console statement, an empty function, boilerplate with no loops/conditionals/data structures — set isAnalyzable to false, explain why in triageNote (one sentence), set score to 0, patternDetected to "None", readabilityScore and maintainabilityScore to 0, and return empty strings/arrays for every other analytical field. Do NOT invent a pattern, complexity, or edge cases for trivial code.
- Otherwise set isAnalyzable to true and triageNote to an empty string, then perform the full analysis below.

FIELD RULES (each field must contain DISTINCT content — never repeat the same sentence across two fields):
- whyItWorks: explain the reasoning behind the pattern/approach used (1-2 sentences). This is about WHY the technique is correct.
- patternExplanation: name the algorithmic pattern and why THIS code matches it specifically (different angle from whyItWorks — focus on pattern recognition, not correctness proof).
- interviewIntuition: how an interviewer would expect the candidate to arrive at this approach out loud.
- beginnerFriendlyNote: a plain-language one-liner a beginner could understand, avoiding jargon.
- codingMistakes: concrete mistakes found in THIS code (not generic advice). If none, say "No significant coding mistakes found."
- namingIssues: comment specifically on variable/function names in THIS code. If names are fine, say so explicitly.
- missedEdgeCases: array of SPECIFIC edge cases this code fails to handle (empty input, nulls, duplicates, overflow, etc.) — only list ones that actually apply.
- scalabilityNotes: how this code behaves as input size grows, referencing the actual complexity found.
- errors: array of concrete bugs, if any.
- optimization: array of concrete optimization suggestions, if any.

Every field above must contain UNIQUE text — do not copy the same sentence into multiple fields.

CODE STYLE for improvedCode: clean, readable, standard professional conventions. For C++, include 'using namespace std;' and use cout/cin/endl without std:: prefix unless necessary. Avoid competitive-programming-style micro-optimizations unless essential. If the code is already optimal, set improvedCode to the same code and state that in optimization.

Respond ONLY with valid JSON matching the schema. No markdown, no commentary outside the JSON.`
    });

    const prompt = `Review the following code. First determine if it is substantial enough to analyze (see TRIAGE rules). If yes, provide a full DSA-focused review: pattern detection, complexity (before/after), readability and maintainability scoring, concrete mistakes, edge cases, and an optimized version.\n\nCode:\n${code}`;

    // Try up to 2 times for each model
    for (let i = 0; i < 2; i++) {
      try {
        const completion = await model.generateContent(prompt);
        const raw = completion.response.text();
        const parsed = extractJson(raw);
        console.log(`✅ SUCCESS WITH ${modelName} ON ATTEMPT ${i + 1}`);
        return normalizeReviewResult(parsed);
      } catch (err) {
        console.warn(`⚠️ MODEL ${modelName} ATTEMPT ${i + 1} FAILED:`, err.message);
        
        // Wait a bit if it's a rate limit or server issue
        if (err.message?.includes("fetch failed") || err.message?.includes("503") || err.message?.includes("429")) {
          await new Promise(r => setTimeout(r, 1000));
          continue;
        }
        
        // If it's a 404 or other permanent error for this model, break and try next model
        break;
      }
    }
  }

  // If even model redundancy fails, return a simulated results as a last resort to "guarantee" no error UI
  console.error("❌ ALL MODELS FAILED. RETURNING SAFE SIMULATED RESPONSE.");
  return createSimulatedReview("API Temporarily Unavailable. Analysis results are estimated.");
}
