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
      systemInstruction: `You are a senior software engineer doing a code review, the way a human reviewer on GitHub or in an interview would — not a code generator rewriting from scratch.

CORE RULE: Evaluate the code AS WRITTEN. Do not silently replace the user's approach with a different algorithm/structure unless the complexity analysis genuinely calls for it.

TRIAGE — determine which case applies before analyzing:

CASE 1 — SYNTAX/TYPO ERRORS (missing semicolon, misspelled keyword, unmatched bracket, wrong operator, etc.):
- Do NOT generate a full rewritten version.
- Set errors to describe the EXACT issue and its line/location (e.g. 'Missing semicolon on line 4 after result.push(...)', 'Typo: \\\`retrun\\\` should be \\\`return\\\` on line 9').
- Set improvedCode to the user's ORIGINAL code with ONLY that specific fix applied — same structure, same variable names, same approach, minimally changed.
- Set optimization to an empty array or a note that the logic itself is sound, only the syntax needed fixing.
- Set score based on how close to correct the code was (a single typo should score high, e.g. 85-95, not be penalized as if the logic was wrong).

CASE 2 — CODE IS ALREADY CORRECT AND REASONABLY EFFICIENT for the problem it solves:
- Set improvedCode to the SAME code as the input (or with only trivial style cleanup, not a rewrite).
- Set optimization to state clearly that the approach is already appropriate/efficient for this problem, explaining briefly why (e.g. 'This is already O(n) using a single pass with a hashmap — no further optimization needed for this problem size.').
- Do not invent a 'better' approach that isn't actually better, or introduce unnecessary complexity to seem more thorough.
- Score should reflect genuine quality (80-100 range) rather than being artificially lowered to justify generating changes.

CASE 3 — CODE HAS A GENUINE COMPLEXITY/EFFICIENCY PROBLEM (e.g. O(n²) where O(n) is achievable):
- Only in this case, generate a meaningfully improved version.
- The improvedCode should preserve the user's naming conventions and code style where reasonable, changing only what's needed to fix the complexity issue — don't restructure unrelated parts of the code, add unrelated features, or change variable names without reason.
- Clearly explain in optimization WHY the change improves things, referencing the actual complexity difference.

CASE 4 — CODE HAS A LOGIC BUG (produces wrong output, not just a typo):
- Identify the specific logical error precisely (e.g. 'Off-by-one: loop condition should be j < arr.length, not j <= arr.length, causing an out-of-bounds access').
- improvedCode should fix ONLY that bug, preserving the user's original approach and structure — do not rewrite the whole solution unless the bug is unfixable within the original structure.

GENERAL RULES:
- Never generate a completely different algorithmic approach than what the user wrote unless CASE 3 applies (genuine complexity problem) — respect the user's chosen approach as the baseline.
- Never fabricate issues to make the review seem more thorough than the code warrants.
- The goal is to help the user understand THEIR code, not to show off a different implementation.

TRIVIAL CODE TRIAGE:
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

CRITICAL FORMATTING REQUIREMENT for improvedCode: this field MUST be a properly formatted, multi-line code string using actual newline characters (\\n) between every statement and block, with consistent indentation (2 or 4 spaces per nesting level, matching the original code's indentation style). NEVER return code as a single-line or minimally-spaced string. Format it exactly as it would appear in a real code editor — each statement, each brace, each control structure on its own line, properly indented to reflect nesting depth. This is not optional stylistic preference; malformed single-line output is treated as an invalid response.

WRONG: \`function foo(x) { if (x) { return 1; } return 0; }\`
CORRECT:
\`function foo(x) {\\n  if (x) {\\n    return 1;\\n  }\\n  return 0;\\n}\`

For C++, include 'using namespace std;' and use cout/cin/endl without std:: prefix unless necessary. Avoid competitive-programming-style micro-optimizations unless essential.

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
