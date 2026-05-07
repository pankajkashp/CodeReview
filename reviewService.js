import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import process from "node:process";

const REVIEW_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    errors: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING }
    },
    optimization: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING }
    },
    oldTimeComplexity: { type: SchemaType.STRING },
    newTimeComplexity: { type: SchemaType.STRING },
    oldSpaceComplexity: { type: SchemaType.STRING },
    newSpaceComplexity: { type: SchemaType.STRING },
    improvedCode: { type: SchemaType.STRING },
    score: { type: SchemaType.INTEGER }
  },
  required: [
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
    errors: Array.isArray(result.errors) ? result.errors.map(String) : [],
    optimization: Array.isArray(result.optimization) ? result.optimization.map(String) : [],
    oldTimeComplexity: typeof result.oldTimeComplexity === "string" ? result.oldTimeComplexity : (typeof result.timeComplexity === "string" ? result.timeComplexity : "Unknown"),
    newTimeComplexity: typeof result.newTimeComplexity === "string" ? result.newTimeComplexity : (typeof result.timeComplexity === "string" ? result.timeComplexity : "Unknown"),
    oldSpaceComplexity: typeof result.oldSpaceComplexity === "string" ? result.oldSpaceComplexity : (typeof result.spaceComplexity === "string" ? result.spaceComplexity : "Unknown"),
    newSpaceComplexity: typeof result.newSpaceComplexity === "string" ? result.newSpaceComplexity : (typeof result.spaceComplexity === "string" ? result.spaceComplexity : "Unknown"),
    improvedCode: typeof result.improvedCode === "string" ? result.improvedCode : "",
    score: Number.isFinite(Number(result.score)) ? Math.max(0, Math.min(100, Math.round(Number(result.score)))) : 0
  };
}

function createSimulatedReview(reason) {
  return {
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
      systemInstruction: "You are a senior software architect. Analyze the code for bugs, optimization, and complexity. Identify both the original (older) complexity and the new (optimized) complexity. For the improvedCode field, provide well-formatted, indented code with appropriate newlines. Respond ONLY with valid JSON."
    });

    const prompt = `Analyze the following code for DSA integrity and optimization. Provide the original time/space complexity and the new optimized time/space complexity:\n\n${code}`;

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
