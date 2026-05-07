/* eslint-disable react-refresh/only-export-components */
import React from "react";

const languageHints = [
  { id: "cpp", match: /#include|std::|cout|cin|vector<|unordered_map|using namespace std/ },
  { id: "java", match: /public class|System\.out|new\s+\w+\(|import java\./ },
  { id: "python", match: /def\s+\w+\(|:\s*$|import\s+\w+|print\(/m },
  { id: "javascript", match: /const\s+\w+|let\s+\w+|function\s+\w+|=>/ }
];

const PATTERN_LIBRARY = {
  "nested-iteration": {
    id: "nested-iteration",
    title: "Nested Iteration",
    category: "Time Complexity",
    intuition: "Repeated scanning creates avoidable O(n^2) work.",
    explanation:
      "The main optimization is to replace repeated scans with a tracked state so each element is processed once.",
    interview:
      "Call out the repeated work first, then show how a hash structure or early exit removes the extra loop.",
    beginner:
      "Think of it like keeping a notebook of what you already saw so you do not search the same rows again.",
    whyBetter:
      "This pattern removes duplicated work and usually cuts runtime from quadratic to linear or near-linear.",
    relatedProblems: ["Two Sum", "Contains Duplicate", "Subarray Sum Equals K"],
    recommendations: [
      "Replace the inner search with a Set or Map.",
      "Return early as soon as the condition is satisfied.",
      "Avoid recomputing values already captured in a lookup table."
    ],
    bruteTemplate: `for item in input:
  for candidate in input:
    if item matches candidate:
      return answer`,
    betterTemplate: `seen = {}
for item in input:
  if item in seen:
    return answer
  seen[item] = true`,
    optimalTemplate: `lookup = new Map()
for item of input:
  if (lookup.has(item)) return answer
  lookup.set(item, true)`
  },
  "hash-lookup": {
    id: "hash-lookup",
    title: "Hash Lookup",
    category: "Membership / Frequency",
    intuition: "Constant-time lookup structures turn repeated checks into one pass.",
    explanation:
      "The strongest improvement is to store seen values in a hash structure so membership checks stay fast.",
    interview:
      "Explain why a Set or Map is a better fit than repeated array scanning for membership checks.",
    beginner:
      "Instead of asking the whole list every time, you keep a quick index of what has already appeared.",
    whyBetter:
      "Hash-based state usually gives the cleanest balance of speed and clarity.",
    relatedProblems: ["Group Anagrams", "Top K Frequent Elements", "Valid Anagram"],
    recommendations: [
      "Use a Set for boolean membership checks.",
      "Use a Map or dictionary for counts or index tracking.",
      "Prefer a single traversal when the lookup is the bottleneck."
    ],
    bruteTemplate: `for each value:
  scan all previous values
  compare one by one`,
    betterTemplate: `seen = new Set()
for value of values:
  if (seen.has(value)) return true
  seen.add(value)`,
    optimalTemplate: `counts = new Map()
for value of values:
  counts.set(value, (counts.get(value) || 0) + 1)`
  },
  "sorting-sweep": {
    id: "sorting-sweep",
    title: "Sort + Sweep",
    category: "Ordering",
    intuition: "One sort can unlock a much simpler sweep or two-pointer pass.",
    explanation:
      "Sorting once creates structure, which makes the following traversal far cheaper and easier to reason about.",
    interview:
      "Show why sorting is acceptable here, then explain how the sweep avoids the original repeated comparisons.",
    beginner:
      "Put the items in order first, then walk through them without restarting from the beginning.",
    whyBetter:
      "A small upfront sort often pays for itself by simplifying the rest of the algorithm.",
    relatedProblems: ["3Sum", "Merge Intervals", "Meeting Rooms"],
    recommendations: [
      "Sort first if relative order is not important.",
      "Use two pointers or interval merging after sorting.",
      "Explain the time tradeoff between the initial sort and the simpler sweep."
    ],
    bruteTemplate: `compare every pair
check every combination
keep the best result`,
    betterTemplate: `sort the input once
use two pointers or a single sweep
avoid restarting the search`,
    optimalTemplate: `sorted = input.sort()
left = 0
right = sorted.length - 1
while (left < right) {
  // sweep efficiently
}`
  },
  "dynamic-programming": {
    id: "dynamic-programming",
    title: "Dynamic Programming",
    category: "State Reuse",
    intuition: "Reuse overlapping subproblems instead of recomputing them.",
    explanation:
      "If the same state is solved many times, caching or tabulation gives a major reduction in repeated work.",
    interview:
      "Name the state, define the transition, then explain whether memoization or bottom-up tabulation is cleaner.",
    beginner:
      "Break the big problem into smaller answers and remember the ones you already solved.",
    whyBetter:
      "DP converts exponential or repeated branching into controlled state transitions.",
    relatedProblems: ["Climbing Stairs", "Coin Change", "House Robber"],
    recommendations: [
      "Define the state clearly before writing code.",
      "Use memoization first if the state graph is easier to visualize.",
      "Prefer bottom-up if the dependency order is obvious."
    ],
    bruteTemplate: `solve the same subproblem repeatedly
recompute every branch from scratch`,
    betterTemplate: `memo = {}
function solve(state) {
  if (memo[state]) return memo[state]
  // compute once
}`,
    optimalTemplate: `dp = new Array(n + 1).fill(0)
for (let i = 1; i <= n; i++) {
  // build from smaller states
}`
  },
  "graph-traversal": {
    id: "graph-traversal",
    title: "Graph Traversal",
    category: "Traversal",
    intuition: "Traverse each node or edge once and keep a visited set.",
    explanation:
      "Traversal problems become much cleaner when you separate exploration from bookkeeping.",
    interview:
      "Point out the traversal order, the visited guard, and why the algorithm will not revisit nodes indefinitely.",
    beginner:
      "Walk the structure methodically and remember where you have already been.",
    whyBetter:
      "Traversal with visited tracking keeps the logic bounded and predictable.",
    relatedProblems: ["Number of Islands", "Course Schedule", "Binary Tree Level Order Traversal"],
    recommendations: [
      "Use DFS or BFS depending on whether depth or breadth matters.",
      "Keep a visited set to prevent cycles and repeated work.",
      "Explain the queue or recursion stack clearly in interviews."
    ],
    bruteTemplate: `explore everything repeatedly
forget visited state
revisit the same nodes`,
    betterTemplate: `visited = new Set()
traverse(node) {
  if (visited.has(node)) return
  visited.add(node)
  // explore neighbors
}`,
    optimalTemplate: `queue = [start]
visited = new Set([start])
while (queue.length) {
  const node = queue.shift()
  // process neighbors once
}`
  },
  linear: {
    id: "linear",
    title: "Linear Scan",
    category: "Baseline",
    intuition: "The best answer is often a clean one-pass traversal.",
    explanation:
      "When the problem does not require extra structure, a single loop with well-named state is often the cleanest solution.",
    interview:
      "Emphasize the invariant you track while scanning once from left to right.",
    beginner:
      "Look through the data once, keep the important information nearby, and return when you can.",
    whyBetter:
      "A disciplined single pass is easier to test, faster to execute, and simpler to maintain.",
    relatedProblems: ["Valid Palindrome", "Best Time to Buy and Sell Stock", "Maximum Subarray"],
    recommendations: [
      "Look for an invariant that can be updated incrementally.",
      "Avoid storing data you can recompute in O(1).",
      "Keep branch logic short and readable."
    ],
    bruteTemplate: `scan the same input multiple times
recalculate values in every pass`,
    betterTemplate: `track the running state in one pass
update the answer as you go`,
    optimalTemplate: `for (const item of input) {
  // update state once
}`
  }
};

const syntaxRules = {
  javascript: {
    comment: /\/\/.*$/gm,
    string: /(`[^`]*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g,
    number: /\b\d+(?:\.\d+)?\b/g,
    keyword: /\b(const|let|var|function|return|if|else|for|while|switch|case|break|continue|class|new|import|from|export|try|catch|throw|async|await|Map|Set|Array|Object|null|true|false)\b/g
  },
  python: {
    comment: /#.*$/gm,
    string: /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g,
    number: /\b\d+(?:\.\d+)?\b/g,
    keyword: /\b(def|return|if|elif|else|for|while|in|class|import|from|try|except|with|as|True|False|None|and|or|not|lambda|pass)\b/g
  },
  cpp: {
    comment: /\/\/.*$/gm,
    string: /(`[^`]*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g,
    number: /\b\d+(?:\.\d+)?\b/g,
    keyword: /\b(int|long|double|float|bool|void|return|if|else|for|while|class|struct|auto|const|std|vector|map|set|unordered_map|string|include|using|namespace|true|false)\b/g
  },
  java: {
    comment: /\/\/.*$/gm,
    string: /(`[^`]*`|"(?:\\.|[^"\\])*")/g,
    number: /\b\d+(?:\.\d+)?\b/g,
    keyword: /\b(public|private|protected|class|static|void|return|if|else|for|while|new|import|package|true|false|null|final|int|double|float|boolean|String|System|out|println)\b/g
  },
  plain: {
    comment: /$/gm,
    string: /$/gm,
    number: /$/gm,
    keyword: /$/gm
  }
};

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function detectLanguage(code = "") {
  const sample = String(code || "");
  const found = languageHints.find((hint) => hint.match.test(sample));
  return found?.id || "javascript";
}

function detectPattern(code = "") {
  const text = String(code || "");
  if (/memo|cache|dp|dynamic/i.test(text)) return PATTERN_LIBRARY["dynamic-programming"];
  if (/for[\s\S]{0,120}for|while[\s\S]{0,120}for|for[\s\S]{0,120}while/i.test(text)) return PATTERN_LIBRARY["nested-iteration"];
  if (/sort|sorted|std::sort|Arrays\.sort|array\.sort/i.test(text)) return PATTERN_LIBRARY["sorting-sweep"];
  if (/map|unordered_map|hashmap|hash map|set|unordered_set|Map\(|new Set|new Map/i.test(text)) return PATTERN_LIBRARY["hash-lookup"];
  if (/dfs|bfs|tree|graph|node|visit|visited|queue|stack/i.test(text)) return PATTERN_LIBRARY["graph-traversal"];
  return PATTERN_LIBRARY.linear;
}

function countIndentationDepth(lines) {
  return lines.reduce((max, line) => {
    const match = String(line).match(/^\s*/);
    const depth = Math.floor((match ? match[0].length : 0) / 2);
    return Math.max(max, depth);
  }, 0);
}

function estimateReadability(code = "", analysis = {}) {
  const lines = String(code || "").split("\n");
  const meaningfulLines = lines.filter((line) => line.trim().length > 0);
  const totalChars = meaningfulLines.reduce((sum, line) => sum + line.length, 0);
  const avgLineLength = meaningfulLines.length ? totalChars / meaningfulLines.length : 0;
  const longLines = meaningfulLines.filter((line) => line.length > 96).length;
  const commentLines = meaningfulLines.filter((line) => /\/\//.test(line) || /^#/.test(line.trim())).length;
  const indentDepth = countIndentationDepth(meaningfulLines);
  const rawScore = 100
    - Math.min(30, Math.max(0, avgLineLength - 60) * 0.7)
    - Math.min(18, longLines * 3)
    - Math.min(15, indentDepth * 2)
    + Math.min(8, commentLines * 1.5);

  const codeScore = Number(analysis.score || 0);
  const blended = Number.isFinite(codeScore) && codeScore > 0 ? (rawScore * 0.6 + codeScore * 0.4) : rawScore;
  return Math.max(42, Math.min(98, Math.round(blended)));
}

function estimateMaintainability(code = "", analysis = {}, pattern = PATTERN_LIBRARY.linear) {
  const lines = String(code || "").split("\n");
  const meaningfulLines = lines.filter((line) => line.trim().length > 0);
  const branchCount = meaningfulLines.filter((line) => /\b(if|else if|switch|case|catch|for|while)\b/.test(line)).length;
  const repeatedIdentifiers = meaningfulLines.reduce((count, line, index, arr) => {
    if (index === 0) return count;
    const prev = arr[index - 1].trim();
    return count + (prev === line.trim() ? 1 : 0);
  }, 0);
  const base = estimateReadability(code, analysis);
  const complexityPenalty = /O\(n[²2]\)|O\(n\^2\)/i.test(`${analysis.oldTimeComplexity || ""} ${analysis.newTimeComplexity || ""}`)
    ? 8
    : 0;
  const patternPenalty = pattern.id === "nested-iteration" ? 6 : 0;
  const score = base - Math.min(14, branchCount * 1.2) - Math.min(10, repeatedIdentifiers * 2) - complexityPenalty - patternPenalty;
  return Math.max(40, Math.min(98, Math.round(score)));
}

function detectLanguageLabel(code = "") {
  return detectLanguage(code);
}

function createComplexityValue(label, fallback, oldValue, newValue) {
  return {
    label,
    fallback,
    oldValue: oldValue || fallback,
    newValue: newValue || fallback
  };
}

function createApproachCards({ originalCode, improvedCode, analysis, pattern }) {
  const source = String(originalCode || "").trim() || pattern.bruteTemplate;
  const optimal = String(improvedCode || "").trim() || pattern.optimalTemplate;
  const better = pattern.betterTemplate || source;

  return [
    {
      id: "brute",
      title: "Brute Force",
      badge: "Baseline",
      complexity: analysis.oldTimeComplexity || "O(n²)",
      space: analysis.oldSpaceComplexity || "O(n)",
      code: source,
      explanation: pattern.explanation,
      whyBetter: "Useful for understanding the problem, but it usually repeats work and increases runtime.",
      accent: "var(--danger)"
    },
    {
      id: "better",
      title: "Better Approach",
      badge: "Refined",
      complexity: analysis.newTimeComplexity || "O(n)",
      space: analysis.newSpaceComplexity || "O(n)",
      code: better,
      explanation: pattern.interview,
      whyBetter: pattern.whyBetter,
      accent: "var(--accent)"
    },
    {
      id: "optimal",
      title: "Optimal Approach",
      badge: "Preferred",
      complexity: analysis.newTimeComplexity || "O(n)",
      space: analysis.newSpaceComplexity || "O(1)",
      code: optimal,
      explanation: pattern.beginner,
      whyBetter: "This version is the best balance of clarity, speed, and interview readiness.",
      accent: "var(--primary)"
    }
  ];
}

function createLearningData(pattern) {
  return {
    category: pattern.category,
    relatedProblems: pattern.relatedProblems,
    recommendations: pattern.recommendations
  };
}

function createFeedbackData({ analysis, pattern, originalCode, readabilityScore, maintainabilityScore }) {
  const errors = Array.isArray(analysis.errors)
    ? analysis.errors.map(String)
    : Array.isArray(analysis.bugs)
      ? analysis.bugs.map(String)
      : [];

  const optimization = Array.isArray(analysis.optimization) ? analysis.optimization.map(String) : [];
  const hasSingleLetterNames = /\b([a-zA-Z])\b/.test(originalCode);

  return {
    codingMistakes: errors.length ? errors : [pattern.explanation],
    namingIssues: hasSingleLetterNames
      ? ["The code uses short names in places where descriptive names would make intent clearer."]
      : ["Variable names are reasonably clear, but a few helper names could be more descriptive."],
    missedEdgeCases: [
      "Check empty input, single-item input, and repeated values.",
      "Make sure the optimized path still behaves correctly with minimal data."
    ],
    scalabilityProblems: [
      analysis.oldTimeComplexity || "The current approach may not scale well on large inputs.",
      "Repeated scanning is the main source of runtime pressure."
    ],
    bestPractices: [
      "Use guard clauses to keep the main logic flat.",
      "Prefer a lookup structure when membership checks repeat.",
      "Keep the optimized flow easy to read for future maintainers."
    ],
    optimization,
    readabilityScore,
    maintainabilityScore,
    pattern
  };
}

function createSuggestions({ language, pattern }) {
  const variableRename = language === "cpp" || language === "java"
    ? "Rename loop counters and scratch variables to express the domain, such as `index`, `currentValue`, or `runningTotal`."
    : "Rename short-lived variables to more descriptive names so the control flow reads like a story.";

  const stlSuggestion = language === "cpp"
    ? "Prefer `std::unordered_map`, `std::unordered_set`, or `std::vector` when you need constant-time lookup and contiguous storage."
    : "Prefer native structures like `Map` and `Set` when the code repeatedly checks membership or counts values.";

  return [
    {
      title: "Variable Renaming",
      detail: variableRename
    },
    {
      title: "Simplification",
      detail: "Extract repeated logic into a helper and use early returns to flatten nested branches."
    },
    {
      title: "Unnecessary Loops",
      detail: "Look for scans that can be merged into a single pass or replaced with a cached lookup."
    },
    {
      title: language === "cpp" ? "STL Improvements" : "Standard Library Improvements",
      detail: stlSuggestion
    },
    {
      title: "Clean Code",
      detail: `Keep the ${pattern.title.toLowerCase()} version focused on one job, with explicit names and minimal branching.`
    }
  ];
}

function buildDiffMap(originalCode = "", improvedCode = "") {
  const originalLines = String(originalCode || "").split("\n");
  const improvedLines = String(improvedCode || "").split("\n");
  const n = originalLines.length;
  const m = improvedLines.length;

  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      dp[i][j] = originalLines[i] === improvedLines[j]
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const matches = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (originalLines[i] === improvedLines[j]) {
      matches.push([i, j]);
      i += 1;
      j += 1;
      continue;
    }

    if (dp[i + 1][j] >= dp[i][j + 1]) {
      i += 1;
    } else {
      j += 1;
    }
  }

  const originalStatus = Array(n).fill("removed");
  const improvedStatus = Array(m).fill("added");

  matches.forEach(([originalIndex, improvedIndex]) => {
    originalStatus[originalIndex] = "match";
    improvedStatus[improvedIndex] = "match";
  });

  return {
    originalLines,
    improvedLines,
    originalStatus,
    improvedStatus,
    changedCount: originalStatus.filter((status) => status !== "match").length + improvedStatus.filter((status) => status !== "match").length
  };
}

function syntaxHighlight(line, language = "javascript") {
  const rules = syntaxRules[language] || syntaxRules.javascript;
  let html = escapeHtml(line);

  html = html.replace(rules.comment, '<span class="token token-comment">$&</span>');
  html = html.replace(rules.string, '<span class="token token-string">$&</span>');
  html = html.replace(rules.number, '<span class="token token-number">$&</span>');
  html = html.replace(rules.keyword, '<span class="token token-keyword">$&</span>');
  return html;
}

export function buildAnalysisViewModel({ analysis = {}, originalCode = "" }) {
  const code = String(originalCode || "");
  const language = detectLanguageLabel(code);
  const pattern = detectPattern(code);
  const optimizedCode = String(analysis.improvedCode || "").trim() || pattern.optimalTemplate;
  const score = Number.isFinite(Number(analysis.score)) ? Math.max(0, Math.min(100, Math.round(Number(analysis.score)))) : 0;
  const timeComplexity = analysis.newTimeComplexity || analysis.oldTimeComplexity || "Unknown";
  const spaceComplexity = analysis.newSpaceComplexity || analysis.oldSpaceComplexity || "Unknown";
  const readabilityScore = estimateReadability(code, analysis);
  const maintainabilityScore = estimateMaintainability(code, analysis, pattern);
  const diff = buildDiffMap(code, optimizedCode);
  const complexityCards = [
    createComplexityValue("Time Complexity", "Unknown", analysis.oldTimeComplexity, analysis.newTimeComplexity),
    createComplexityValue("Space Complexity", "Unknown", analysis.oldSpaceComplexity, analysis.newSpaceComplexity)
  ];

  const approaches = createApproachCards({
    originalCode: code,
    improvedCode: optimizedCode,
    analysis,
    pattern,
    language
  });

  return {
    originalCode: code,
    optimizedCode,
    score,
    timeComplexity,
    spaceComplexity,
    readabilityScore,
    maintainabilityScore,
    pattern,
    language,
    complexityCards,
    diff,
    approaches,
    explanationTabs: [
      {
        id: "why",
        label: "Why it works",
        copy: pattern.explanation
      },
      {
        id: "pattern",
        label: "Pattern used",
        copy: `${pattern.title} is a ${pattern.category.toLowerCase()} pattern that becomes useful when repeated work is the main problem.`
      },
      {
        id: "intuition",
        label: "Interview intuition",
        copy: pattern.interview
      },
      {
        id: "beginner",
        label: "Beginner-friendly",
        copy: pattern.beginner
      }
    ],
    feedback: createFeedbackData({
      analysis,
      pattern,
      originalCode: code,
      readabilityScore,
      maintainabilityScore
    }),
    learning: createLearningData(pattern),
    suggestions: createSuggestions({ language, pattern, originalCode: code }),
    summaryText:
      score > 0
        ? `AI review complete with a ${score}/100 score. The code most closely matches a ${pattern.title.toLowerCase()} pattern.`
        : `AI review complete. The code most closely matches a ${pattern.title.toLowerCase()} pattern.`,
    diffStats: {
      originalLines: diff.originalLines.length,
      optimizedLines: diff.improvedLines.length,
      changedLines: diff.changedCount
    },
    analysis
  };
}

function SectionShell({ title, eyebrow, description, children, className = "", defaultOpen = true }) {
  return (
    <details className={`analysis-section ${className}`} open={defaultOpen}>
      <summary className="analysis-section-summary">
        <div className="summary-copy">
          {eyebrow ? <span className="summary-eyebrow">{eyebrow}</span> : null}
          <strong>{title}</strong>
          {description ? <p>{description}</p> : null}
        </div>
        <span className="summary-toggle" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </summary>
      <div className="analysis-section-body">{children}</div>
    </details>
  );
}

function MetricCard({ label, value, hint, accent = "primary", size = "md" }) {
  return (
    <article className={`metric-card metric-card-${accent} metric-card-${size}`}>
      <span className="metric-label">{label}</span>
      <strong className="metric-value">{value}</strong>
      {hint ? <p className="metric-hint">{hint}</p> : null}
    </article>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button type="button" className={`tab-button ${active ? "active" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

function HighlightedCode({ code = "", language = "javascript", status = "neutral", showLineNumbers = true, className = "" }) {
  const lines = React.useMemo(() => String(code || "").split("\n"), [code]);

  return (
    <pre className={`code-block ${className} code-${status}`}>
      {lines.map((line, index) => (
        <code key={`${index}-${line}`} className={`code-line code-line-${status}`}>
          {showLineNumbers ? <span className="code-line-number">{index + 1}</span> : null}
          <span
            className="code-line-content"
            dangerouslySetInnerHTML={{ __html: syntaxHighlight(line, language) }}
          />
        </code>
      ))}
    </pre>
  );
}

function DiffPane({ title, code, language, statuses, tone, subtitle, onCopy }) {
  const lines = React.useMemo(() => String(code || "").split("\n"), [code]);

  return (
    <div className={`diff-pane diff-pane-${tone}`}>
      <div className="diff-pane-header">
        <div>
          <span className="diff-pane-kicker">{subtitle}</span>
          <strong>{title}</strong>
        </div>
        <button type="button" className="ghost-button" onClick={onCopy}>
          Copy
        </button>
      </div>
      <div className="code-shell">
        {lines.map((line, index) => {
          const lineState = statuses[index] || "neutral";
          return (
            <div key={`${tone}-${index}-${line}`} className={`code-row code-row-${lineState}`}>
              <span className="code-line-number">{index + 1}</span>
              <span className="code-line-content" dangerouslySetInnerHTML={{ __html: syntaxHighlight(line, language) }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CodeDiffViewer({ model, onCopyOriginal, onCopyOptimized }) {
  return (
    <SectionShell
      eyebrow="Before vs After"
      title="Code Comparison"
      description="A line-by-line comparison that shows what was removed, what was added, and where the optimized logic wins."
      className="diff-section"
    >
      <div className="diff-grid">
        <DiffPane
          title="Original Code"
          subtitle="Legacy source"
          code={model.originalCode || ""}
          language={model.language}
          statuses={model.diff.originalStatus}
          tone="original"
          onCopy={onCopyOriginal}
        />
        <DiffPane
          title="Optimized Code"
          subtitle="Refined output"
          code={model.optimizedCode || ""}
          language={model.language}
          statuses={model.diff.improvedStatus}
          tone="optimized"
          onCopy={onCopyOptimized}
        />
      </div>
      <div className="diff-stats">
        <MetricCard label="Original lines" value={model.diffStats.originalLines} hint="Source footprint" accent="neutral" size="sm" />
        <MetricCard label="Optimized lines" value={model.diffStats.optimizedLines} hint="Refined footprint" accent="primary" size="sm" />
        <MetricCard label="Changed lines" value={model.diffStats.changedLines} hint="Diff signal" accent="accent" size="sm" />
      </div>
    </SectionShell>
  );
}

function ApproachTabs({ model }) {
  const [active, setActive] = React.useState("brute");
  const current = model.approaches.find((item) => item.id === active) || model.approaches[0];

  return (
    <SectionShell
      eyebrow="Multiple Approaches"
      title="Solution Paths"
      description="Move across the progression from brute force to the best-fit pattern-driven solution."
      className="approach-section"
    >
      <div className="tab-strip">
        {model.approaches.map((approach) => (
          <TabButton key={approach.id} active={active === approach.id} onClick={() => setActive(approach.id)}>
            {approach.title}
          </TabButton>
        ))}
      </div>
      <div className="approach-card">
        <div className="approach-card-top">
          <div>
            <span className="summary-eyebrow">{current.badge}</span>
            <h3>{current.title}</h3>
          </div>
          <div className="complexity-chip-group">
            <span className="complexity-chip">Time {current.complexity}</span>
            <span className="complexity-chip">Space {current.space}</span>
          </div>
        </div>
        <div className="approach-copy-grid">
          <div className="approach-copy">
            <span className="copy-label">Explanation</span>
            <p>{current.explanation}</p>
          </div>
          <div className="approach-copy">
            <span className="copy-label">Why better</span>
            <p>{current.whyBetter}</p>
          </div>
        </div>
        <div className="approach-code-shell">
          <HighlightedCode code={current.code} language={model.language} status={current.id === "optimal" ? "optimized" : current.id === "better" ? "accent" : "original"} />
        </div>
      </div>
    </SectionShell>
  );
}

function ExplanationTabs({ model }) {
  const [active, setActive] = React.useState("why");
  const current = model.explanationTabs.find((item) => item.id === active) || model.explanationTabs[0];

  return (
    <SectionShell
      eyebrow="AI Explanation"
      title="Why the Optimization Works"
      description="The review explains the reasoning so the fix is understandable, not just clever."
      className="explanation-section"
    >
      <div className="tab-strip">
        {model.explanationTabs.map((tab) => (
          <TabButton key={tab.id} active={active === tab.id} onClick={() => setActive(tab.id)}>
            {tab.label}
          </TabButton>
        ))}
      </div>
      <div className="explanation-card">
        <p>{current.copy}</p>
      </div>
    </SectionShell>
  );
}

function FeedbackPanel({ feedback }) {
  return (
    <SectionShell
      eyebrow="Interview Feedback"
      title="What to Improve"
      description="The feedback is grouped by the kind of signal you would expect in a real interview review."
      className="feedback-section"
    >
      <div className="feedback-grid">
        <div className="feedback-card">
          <span>Coding mistakes</span>
          <ul>
            {feedback.codingMistakes.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className="feedback-card">
          <span>Naming issues</span>
          <ul>
            {feedback.namingIssues.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className="feedback-card">
          <span>Missed edge cases</span>
          <ul>
            {feedback.missedEdgeCases.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className="feedback-card">
          <span>Scalability problems</span>
          <ul>
            {feedback.scalabilityProblems.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
      <div className="best-practices-strip">
        {feedback.bestPractices.map((item) => (
          <span key={item} className="best-practice-pill">{item}</span>
        ))}
      </div>
    </SectionShell>
  );
}

function LearningPanel({ learning }) {
  return (
    <SectionShell
      eyebrow="Learning"
      title="Pattern Awareness"
      description="Use the pattern and nearby problems to turn one review into a reusable mental model."
      className="learning-section"
      defaultOpen={false}
    >
      <div className="learning-grid">
        <div className="learning-card">
          <span>Pattern category</span>
          <strong>{learning.category}</strong>
        </div>
        <div className="learning-card">
          <span>Related DSA problems</span>
          <div className="problem-list">
            {learning.relatedProblems.map((problem) => (
              <span key={problem} className="problem-pill">{problem}</span>
            ))}
          </div>
        </div>
        <div className="learning-card">
          <span>Learning recommendations</span>
          <ul>
            {learning.recommendations.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}

function SuggestionsPanel({ suggestions }) {
  return (
    <SectionShell
      eyebrow="Code Improvement Suggestions"
      title="Clean Code Opportunities"
      description="Small refactors with a large effect on readability, interview clarity, and long-term maintainability."
      className="suggestions-section"
      defaultOpen={false}
    >
      <div className="suggestion-grid">
        {suggestions.map((item) => (
          <article key={item.title} className="suggestion-card">
            <span>{item.title}</span>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

function SummaryStrip({ model }) {
  return (
    <div className="summary-grid">
      <MetricCard
        label="Overall Code Score"
        value={model.score || "—"}
        hint="Quality benchmark"
        accent="primary"
        size="lg"
      />
      <MetricCard
        label="Time Complexity"
        value={model.timeComplexity}
        hint={model.complexityCards[0].oldValue}
        accent="accent"
      />
      <MetricCard
        label="Space Complexity"
        value={model.spaceComplexity}
        hint={model.complexityCards[1].oldValue}
        accent="neutral"
      />
      <MetricCard
        label="Readability Score"
        value={model.readabilityScore}
        hint="How easy this is to read"
        accent="primary"
      />
      <MetricCard
        label="Maintainability Score"
        value={model.maintainabilityScore}
        hint="How easy this is to evolve"
        accent="accent"
      />
      <MetricCard
        label="Pattern Detected"
        value={model.pattern.title}
        hint={model.pattern.category}
        accent="neutral"
      />
    </div>
  );
}

function ReanalyzePanel({ editableCode, setEditableCode, onAnalyze, loading }) {
  return (
    <SectionShell
      eyebrow="Re-analyze"
      title="Update the Source and Run Again"
      description="Keep the editing path available without interrupting the premium review layout."
      className="reanalysis-section"
      defaultOpen={false}
    >
      <div className="reanalyze-grid">
        <textarea
          className="reanalyze-editor"
          value={editableCode}
          onChange={(e) => setEditableCode(e.target.value)}
          placeholder="Paste revised code here..."
        />
        <div className="reanalyze-actions">
          <button type="button" className="primary-button" onClick={() => onAnalyze(editableCode)} disabled={loading || !editableCode.trim()}>
            {loading ? "Analyzing..." : "Run analysis"}
          </button>
          <p>Use this when you want to re-check a modified solution without leaving the page.</p>
        </div>
      </div>
    </SectionShell>
  );
}

export {
  SectionShell,
  MetricCard,
  HighlightedCode,
  CodeDiffViewer,
  ApproachTabs,
  ExplanationTabs,
  FeedbackPanel,
  LearningPanel,
  SuggestionsPanel,
  SummaryStrip,
  ReanalyzePanel,
  detectLanguage,
  detectPattern,
  syntaxHighlight
};
