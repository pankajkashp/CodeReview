import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import process from "node:process";

const REVIEW_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    score: {
      type: SchemaType.INTEGER,
      description: "Code quality score between 0 and 100. Optimal, clean code scores 90-100."
    },
    summary: {
      type: SchemaType.STRING,
      description: "Concise summary of code quality and key findings in 1-2 natural sentences."
    },
    hasImprovements: {
      type: SchemaType.BOOLEAN,
      description: "True ONLY if meaningful improvements or bug fixes exist. False if code is already correct and reasonably efficient."
    },
    patternDetected: {
      type: SchemaType.STRING,
      description: "Algorithmic pattern or structure identified (e.g. 'Hash Map / Single Pass', 'Two Pointers')."
    },
    whyBetter: {
      type: SchemaType.STRING,
      description: "Concise 1-2 sentences explaining why the change improves performance/correctness, or why the current solution is already optimal."
    },
    oldTimeComplexity: { type: SchemaType.STRING },
    newTimeComplexity: { type: SchemaType.STRING },
    oldSpaceComplexity: { type: SchemaType.STRING },
    newSpaceComplexity: { type: SchemaType.STRING },
    strengths: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "1-3 concise strengths of the submitted code."
    },
    issues: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          lineRange: { type: SchemaType.STRING, description: "Relevant line numbers, e.g. 'lines 2-4' or 'line 5'." },
          why: { type: SchemaType.STRING, description: "Why this is an issue (1 concise sentence)." },
          suggestion: { type: SchemaType.STRING, description: "Specific actionable fix (1-2 sentences)." },
          before: { type: SchemaType.STRING, description: "Exact snippet from original code." },
          after: { type: SchemaType.STRING, description: "Exact replacement snippet." }
        },
        required: ["title", "lineRange", "why", "suggestion"]
      },
      description: "Meaningful issues found, ordered by priority (bugs > security > performance > edge cases > clarity). Empty array if none."
    },
    missedEdgeCases: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Specific realistic edge cases not handled. Empty array if none."
    },
    improvedCode: {
      type: SchemaType.STRING,
      description: "Full optimized code ONLY when hasImprovements is true. If hasImprovements is false, return empty string ''."
    }
  },
  required: [
    "score",
    "summary",
    "hasImprovements",
    "patternDetected",
    "whyBetter",
    "oldTimeComplexity",
    "newTimeComplexity",
    "oldSpaceComplexity",
    "newSpaceComplexity",
    "strengths",
    "issues",
    "missedEdgeCases",
    "improvedCode"
  ]
};

function normalizeReviewResult(result, originalCode = "") {
  const score = Number.isFinite(Number(result.score))
    ? Math.max(0, Math.min(100, Math.round(Number(result.score))))
    : 0;

  const hasImprovements = Boolean(result.hasImprovements);
  const summary = typeof result.summary === "string" ? result.summary.trim() : "";
  const patternDetected = typeof result.patternDetected === "string" && result.patternDetected.trim()
    ? result.patternDetected.trim()
    : "Linear / Direct";
  const whyBetter = typeof result.whyBetter === "string" ? result.whyBetter.trim() : "";

  const oldTimeComplexity = typeof result.oldTimeComplexity === "string" ? result.oldTimeComplexity : "Unknown";
  const newTimeComplexity = typeof result.newTimeComplexity === "string" ? result.newTimeComplexity : oldTimeComplexity;
  const oldSpaceComplexity = typeof result.oldSpaceComplexity === "string" ? result.oldSpaceComplexity : "Unknown";
  const newSpaceComplexity = typeof result.newSpaceComplexity === "string" ? result.newSpaceComplexity : oldSpaceComplexity;

  const strengths = Array.isArray(result.strengths) ? result.strengths.map(String) : [];
  const missedEdgeCases = Array.isArray(result.missedEdgeCases) ? result.missedEdgeCases.map(String) : [];

  const rawIssues = Array.isArray(result.issues) ? result.issues : [];
  const issues = rawIssues.map((issue) => ({
    title: typeof issue.title === "string" ? issue.title : "Observation",
    lineRange: typeof issue.lineRange === "string" ? issue.lineRange : "",
    why: typeof issue.why === "string" ? issue.why : "",
    suggestion: typeof issue.suggestion === "string" ? issue.suggestion : "",
    before: typeof issue.before === "string" ? issue.before : "",
    after: typeof issue.after === "string" ? issue.after : ""
  }));

  // Conditional improvedCode: if no improvements exist or string is empty, preserve originalCode exactly
  const rawImproved = typeof result.improvedCode === "string" ? result.improvedCode.trim() : "";
  const improvedCode = (hasImprovements && rawImproved) ? result.improvedCode : originalCode;

  // Backward compatibility mappings for existing frontend components
  const errors = issues.map((i) => (i.lineRange ? `[${i.lineRange}] ` : "") + `${i.title}: ${i.why}`);
  const optimization = issues.length > 0
    ? issues.map((i) => `${i.title}: ${i.suggestion}`)
    : (whyBetter ? [whyBetter] : []);

  return {
    score,
    summary,
    hasImprovements,
    patternDetected,
    whyBetter,
    strengths,
    issues,
    missedEdgeCases,
    improvedCode,

    oldTimeComplexity,
    newTimeComplexity,
    oldSpaceComplexity,
    newSpaceComplexity,

    // Legacy fields mapped seamlessly:
    errors,
    optimization,
    whyItWorks: whyBetter || summary,
    patternExplanation: patternDetected,
    interviewIntuition: summary,
    beginnerFriendlyNote: whyBetter || summary,
    codingMistakes: issues.length > 0 ? issues[0].title : "No critical mistakes found.",
    namingIssues: issues.find((i) => /naming|identifier|variable name/i.test(i.title))?.title || "",
    scalabilityNotes: whyBetter || "",
    readabilityScore: Math.max(40, Math.min(100, Math.round(score * 0.95))),
    maintainabilityScore: Math.max(40, Math.min(100, Math.round(score * 0.92))),
    isAnalyzable: true,
    triageNote: ""
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

function parseGeminiError(err) {
  const msg = err?.message || String(err);
  let status = 500;
  let cleanMessage = "Gemini analysis failed.";

  if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("quota")) {
    status = 429;
    cleanMessage = "Gemini API rate limit exceeded (429). Please wait a moment and try again.";
  } else if (msg.includes("503") || msg.includes("UNAVAILABLE") || msg.includes("high demand") || msg.includes("overloaded")) {
    status = 503;
    cleanMessage = "Gemini service temporarily unavailable (503). Please try again shortly.";
  } else if (msg.includes("500") || msg.includes("502") || msg.includes("fetch failed")) {
    status = 502;
    cleanMessage = "Temporary network error communicating with Gemini API. Please retry.";
  } else if (msg.includes("401") || msg.includes("API_KEY_INVALID") || msg.includes("not found")) {
    status = 401;
    cleanMessage = "Invalid or unconfigured GEMINI_API_KEY.";
  } else if (msg.includes("403") || msg.includes("PERMISSION_DENIED")) {
    status = 403;
    cleanMessage = "Permission denied for Gemini API key.";
  } else if (msg.includes("400") || msg.includes("INVALID_ARGUMENT")) {
    status = 400;
    cleanMessage = "Invalid input or code format for Gemini analysis.";
  } else {
    cleanMessage = msg.replace(/\[GoogleGenerativeAI Error\]:\s*/g, "").slice(0, 200);
  }

  const error = new Error(cleanMessage);
  error.status = status;
  error.originalMessage = msg;
  return error;
}

function isTransientError(err) {
  const msg = err?.message || String(err);
  return (
    msg.includes("429") ||
    msg.includes("500") ||
    msg.includes("502") ||
    msg.includes("503") ||
    msg.includes("fetch failed") ||
    msg.includes("high demand") ||
    msg.includes("overloaded") ||
    msg.includes("UNAVAILABLE") ||
    msg.includes("RESOURCE_EXHAUSTED")
  );
}

export async function analyzeCodeWithGemini(code) {
  const reqStart = Date.now();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const err = new Error("GEMINI_API_KEY is not configured on the server.");
    err.status = 401;
    throw err;
  }

  const PRIMARY_MODEL = "gemini-2.5-flash";
  const genAI = new GoogleGenerativeAI(apiKey);

  console.log(`\n[API REVIEW] ⏱️ Request started at ${new Date(reqStart).toISOString()}`);
  console.log(`[API REVIEW] Initializing model: ${PRIMARY_MODEL}`);

  const model = genAI.getGenerativeModel({
    model: PRIMARY_MODEL,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: REVIEW_SCHEMA,
      temperature: 0.1
    },
    systemInstruction: `You are a senior software architect doing a pragmatic, focused code review.
CORE PHILOSOPHY: Make the SMALLEST MEANINGFUL improvement. Never rewrite good code.

SCORING (0 to 100):
- 90 to 100: Code is already correct and reasonably efficient.
- 60 to 85: Code has a meaningful algorithmic bottleneck or noticeable edge-case gap.
- Below 60: Code has a breaking bug, crash, syntax error, or severe security flaw.

REVIEW PRIORITIES (Order of importance):
1. Correctness bugs, off-by-one errors, and runtime crashes.
2. Security vulnerabilities and unsafe handling.
3. Genuine algorithmic bottlenecks (e.g. O(n²) where O(n) is achievable).
4. Critical, realistic edge cases.
5. Code clarity and maintainability.
Do NOT report trivial stylistic preferences, semicolon choices, or micro-optimizations.

CONDITIONAL IMPROVED CODE:
- If the code is already correct and reasonably efficient:
  * set hasImprovements to false
  * set improvedCode to empty string ""
  * set newTimeComplexity and newSpaceComplexity identical to old complexities
  * Do NOT rewrite the code.
- If a genuine algorithmic improvement or bug fix exists:
  * set hasImprovements to true
  * set improvedCode to the user's ORIGINAL code with ONLY the necessary fix applied
  * Preserve original indentation, structure, and variable names where reasonable
  * NEVER claim a complexity improvement (e.g. O(n²) -> O(n)) unless the code change genuinely causes that improvement. Never manufacture complexity claims.

CONCISENESS:
- Write natural, concise explanations (1-2 clear sentences). Avoid academic jargon, fluff, and robotic filler.
- Each issue must identify exact lineRange, what is wrong, why it matters, and a concrete suggestion. Provide exact before/after snippets when applicable.

CRITICAL CODE PRESERVATION:
- Never run destructive formatting on code. Preserve multiline formatting, newlines, and original indentation depth.`
  });

  const tPromptStart = Date.now();
  const prompt = `Review the following code:\n\n${code}`;
  const tPrompt = Date.now() - tPromptStart;

  const maxAttempts = 2; // 1 standard attempt + at most 1 controlled retry for transient errors
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const geminiStart = Date.now();
    console.log(`[API REVIEW] 🚀 Gemini request started (Model: ${PRIMARY_MODEL}, Attempt: ${attempt}/${maxAttempts})`);

    try {
      const completion = await model.generateContent(prompt);
      const geminiDuration = Date.now() - geminiStart;

      const tParseStart = Date.now();
      const raw = completion.response.text();
      const parsed = extractJson(raw);
      const tParse = Date.now() - tParseStart;

      const tNormStart = Date.now();
      const normalized = normalizeReviewResult(parsed, code);
      const tNorm = Date.now() - tNormStart;

      const totalDuration = Date.now() - reqStart;

      console.log(
        `[API TIMINGS] ⏱️ Prompt: ${tPrompt}ms | Gemini: ${geminiDuration}ms | JSON Parse: ${tParse}ms | Normalization: ${tNorm}ms | Total Server: ${totalDuration}ms | Payload: ${raw.length} bytes (Attempts: ${attempt})`
      );

      return normalized;
    } catch (err) {
      const geminiDuration = Date.now() - geminiStart;
      const parsedError = parseGeminiError(err);
      lastError = parsedError;

      console.warn(
        `[API REVIEW] ⚠️ Attempt ${attempt} failed in ${geminiDuration}ms. Status: ${parsedError.status}, Reason: ${parsedError.message}`
      );

      if (attempt < maxAttempts && isTransientError(err)) {
        console.log(`[API REVIEW] 🔄 Transient failure detected (${parsedError.status}). Retrying once after 1000ms...`);
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }

      break;
    }
  }

  const totalDuration = Date.now() - reqStart;
  console.error(`[API REVIEW] ❌ All attempts failed after ${totalDuration}ms. Throwing clean error:`, lastError.message);
  throw lastError;
}

