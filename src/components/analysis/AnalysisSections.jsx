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

function createFeedbackData({ analysis, pattern, readabilityScore, maintainabilityScore }) {
  const errors = Array.isArray(analysis.errors)
    ? analysis.errors.map(String)
    : Array.isArray(analysis.bugs)
      ? analysis.bugs.map(String)
      : [];

  const optimization = Array.isArray(analysis.optimization) ? analysis.optimization.map(String) : [];

  return {
    codingMistakes: analysis.codingMistakes ? [analysis.codingMistakes] : errors,
    namingIssues: analysis.namingIssues ? [analysis.namingIssues] : [],
    missedEdgeCases: Array.isArray(analysis.missedEdgeCases) && analysis.missedEdgeCases.length > 0 
      ? analysis.missedEdgeCases 
      : [],
    scalabilityProblems: analysis.scalabilityNotes ? [analysis.scalabilityNotes] : [],
    bestPractices: [
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

function cleanSourceCode(rawCode) {
  let text = String(rawCode || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  // Only strip surrounding markdown code fences if Gemini returned ```lang ... ```
  const fenceMatch = text.match(/^```[a-zA-Z0-9_-]*\n([\s\S]*?)\n```$/);
  if (fenceMatch) {
    return fenceMatch[1];
  }
  return text;
}

function inlineDiff(before, after) {
  if (before === after) return null;
  let start = 0;
  while (start < before.length && start < after.length && before[start] === after[start]) {
    start++;
  }
  let endB = before.length - 1;
  let endA = after.length - 1;
  while (endB >= start && endA >= start && before[endB] === after[endA]) {
    endB--;
    endA--;
  }
  return {
    prefix: before.slice(0, start),
    del: before.slice(start, endB + 1),
    ins: after.slice(start, endA + 1),
    suffix: before.slice(endB + 1)
  };
}

function computeRealDiff(originalCode, improvedCode, issues = []) {
  const origText = cleanSourceCode(originalCode);
  const imprvText = cleanSourceCode(improvedCode);

  const origLines = origText.split("\n");
  const imprvLines = imprvText.split("\n");
  const n = origLines.length;
  const m = imprvLines.length;

  const isIdentical = origText.trim() === imprvText.trim();
  if (isIdentical) {
    const alignedRows = origLines.map((line, idx) => ({
      type: "unchanged",
      isIndentOnly: false,
      origLineNum: idx + 1,
      imprvLineNum: idx + 1,
      origText: line,
      imprvText: line
    }));

    return {
      identical: true,
      hasChanges: false,
      origLines,
      imprvLines,
      alignedRows,
      hunks: [],
      stats: {
        totalChanged: 0,
        modified: 0,
        added: 0,
        removed: 0,
        originalLines: n,
        optimizedLines: m,
        summaryText: "0 lines changed (Identical)"
      }
    };
  }

  // DP LCS with trimmed comparison for matching
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      const match = origLines[i].trimEnd() === imprvLines[j].trimEnd();
      dp[i][j] = match ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  let i = 0, j = 0;
  const matches = [];
  while (i < n && j < m) {
    if (origLines[i].trimEnd() === imprvLines[j].trimEnd()) {
      matches.push({ origIdx: i, imprvIdx: j });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      i++;
    } else {
      j++;
    }
  }

  const alignedRows = [];
  let lastOrig = 0, lastImprv = 0;
  let modifiedCount = 0, addedCount = 0, removedCount = 0;

  function processGap(origStart, origEnd, imprvStart, imprvEnd) {
    const oCount = origEnd - origStart;
    const iCount = imprvEnd - imprvStart;
    const minCount = Math.min(oCount, iCount);

    for (let k = 0; k < minCount; k++) {
      const oIdx = origStart + k;
      const iIdx = imprvStart + k;
      const oText = origLines[oIdx];
      const iText = imprvLines[iIdx];
      const isIndentOnly = oText.trim() === iText.trim() && oText !== iText;
      const inline = inlineDiff(oText, iText);

      alignedRows.push({
        type: "modified",
        isIndentOnly,
        origLineNum: oIdx + 1,
        imprvLineNum: iIdx + 1,
        origText: oText,
        imprvText: iText,
        inline
      });
      modifiedCount++;
    }

    if (oCount > iCount) {
      for (let k = minCount; k < oCount; k++) {
        const oIdx = origStart + k;
        alignedRows.push({
          type: "removed",
          isIndentOnly: false,
          origLineNum: oIdx + 1,
          imprvLineNum: null,
          origText: origLines[oIdx],
          imprvText: ""
        });
        removedCount++;
      }
    } else if (iCount > oCount) {
      for (let k = minCount; k < iCount; k++) {
        const iIdx = imprvStart + k;
        alignedRows.push({
          type: "added",
          isIndentOnly: false,
          origLineNum: null,
          imprvLineNum: iIdx + 1,
          origText: "",
          imprvText: imprvLines[iIdx]
        });
        addedCount++;
      }
    }
  }

  for (const mItem of matches) {
    processGap(lastOrig, mItem.origIdx, lastImprv, mItem.imprvIdx);
    alignedRows.push({
      type: "unchanged",
      isIndentOnly: false,
      origLineNum: mItem.origIdx + 1,
      imprvLineNum: mItem.imprvIdx + 1,
      origText: origLines[mItem.origIdx],
      imprvText: imprvLines[mItem.imprvIdx]
    });
    lastOrig = mItem.origIdx + 1;
    lastImprv = mItem.imprvIdx + 1;
  }
  processGap(lastOrig, n, lastImprv, m);

  // Group into discrete change hunks for Focused Changes View (Task 10)
  const hunks = [];
  let currentHunk = null;
  const CONTEXT_LINES = 2;

  alignedRows.forEach((row, rowIndex) => {
    if (row.type !== "unchanged") {
      if (!currentHunk) {
        const startCtx = Math.max(0, rowIndex - CONTEXT_LINES);
        const precedingRows = alignedRows.slice(startCtx, rowIndex).filter(r => r.type === "unchanged");
        currentHunk = {
          startRowIndex: startCtx,
          rows: [...precedingRows, row],
          changedRowsCount: 1,
          origStartLine: row.origLineNum,
          origEndLine: row.origLineNum,
          imprvStartLine: row.imprvLineNum,
          imprvEndLine: row.imprvLineNum
        };
      } else {
        currentHunk.rows.push(row);
        currentHunk.changedRowsCount++;
        if (row.origLineNum) {
          if (!currentHunk.origStartLine) currentHunk.origStartLine = row.origLineNum;
          currentHunk.origEndLine = row.origLineNum;
        }
        if (row.imprvLineNum) {
          if (!currentHunk.imprvStartLine) currentHunk.imprvStartLine = row.imprvLineNum;
          currentHunk.imprvEndLine = row.imprvLineNum;
        }
      }
    } else if (currentHunk) {
      const trailingCount = currentHunk.rows.filter(r => r.type === "unchanged" && r.origLineNum > currentHunk.origEndLine).length;
      if (trailingCount < CONTEXT_LINES) {
        currentHunk.rows.push(row);
      } else {
        hunks.push(currentHunk);
        currentHunk = null;
      }
    }
  });
  if (currentHunk) {
    hunks.push(currentHunk);
  }

  // Correlate hunks with AI issues (Task 9 & Task 10)
  const correlatedHunks = hunks.map((hunk, index) => {
    const matchedIssue = issues.find(issue => {
      if (!issue.lineRange) return false;
      const numMatch = String(issue.lineRange).match(/\d+/g);
      if (!numMatch) return false;
      const start = parseInt(numMatch[0], 10);
      const end = numMatch[1] ? parseInt(numMatch[1], 10) : start;
      return (
        (hunk.origStartLine <= end && hunk.origEndLine >= start) ||
        Math.abs((hunk.origStartLine || 0) - start) <= 2
      );
    });

    const title = matchedIssue?.title || `Optimization / Refactor`;
    const lineLabel = hunk.origStartLine
      ? (hunk.origStartLine === hunk.origEndLine ? `Line ${hunk.origStartLine}` : `Lines ${hunk.origStartLine}–${hunk.origEndLine}`)
      : (hunk.imprvStartLine === hunk.imprvEndLine ? `Line ${hunk.imprvStartLine}` : `Lines ${hunk.imprvStartLine}–${hunk.imprvEndLine}`);

    const beforeSnippet = hunk.rows
      .filter(r => r.type === "removed" || r.type === "modified")
      .map(r => r.origText)
      .join("\n");

    const afterSnippet = hunk.rows
      .filter(r => r.type === "added" || r.type === "modified")
      .map(r => r.imprvText)
      .join("\n");

    return {
      hunkId: `change-${index + 1}`,
      changeNumber: index + 1,
      title,
      lineLabel,
      origStartLine: hunk.origStartLine,
      origEndLine: hunk.origEndLine,
      whyChange: matchedIssue?.why || "Improves execution efficiency and algorithmic structure.",
      whyBetter: matchedIssue?.suggestion || "Optimizes resource utilization and avoids redundant iterations.",
      rows: hunk.rows,
      beforeSnippet,
      afterSnippet,
      issue: matchedIssue
    };
  });

  const totalChanged = modifiedCount + addedCount + removedCount;
  const summaryParts = [];
  if (modifiedCount > 0) summaryParts.push(`${modifiedCount} modified`);
  if (addedCount > 0) summaryParts.push(`+${addedCount} added`);
  if (removedCount > 0) summaryParts.push(`-${removedCount} removed`);

  return {
    identical: totalChanged === 0,
    hasChanges: totalChanged > 0,
    origLines,
    imprvLines,
    alignedRows,
    hunks: correlatedHunks,
    stats: {
      totalChanged,
      modified: modifiedCount,
      added: addedCount,
      removed: removedCount,
      originalLines: n,
      optimizedLines: m,
      summaryText: totalChanged === 0
        ? "No lines changed"
        : `${totalChanged} line${totalChanged === 1 ? "" : "s"} changed (${summaryParts.join(", ")})`
    }
  };
}

function safeSyntaxHighlight(text, language = "javascript", inline = null, mode = "normal") {
  if (inline) {
    const prefixHtml = safeSyntaxHighlight(inline.prefix, language);
    const suffixHtml = safeSyntaxHighlight(inline.suffix, language);

    if (mode === "del" && inline.del) {
      return `${prefixHtml}<span class="diff-inline-del">${escapeHtml(inline.del)}</span>${suffixHtml}`;
    }
    if (mode === "ins" && inline.ins) {
      return `${prefixHtml}<span class="diff-inline-ins">${escapeHtml(inline.ins)}</span>${suffixHtml}`;
    }
  }

  const keywords = {
    javascript: /\b(const|let|var|function|return|if|else|for|while|switch|case|break|continue|class|new|import|from|export|try|catch|throw|async|await|Map|Set|Array|Object|null|true|false|undefined)\b/g,
    python: /\b(def|return|if|elif|else|for|while|in|class|import|from|try|except|with|as|True|False|None|and|or|not|lambda|pass|set|dict|list)\b/g,
    cpp: /\b(int|long|double|float|bool|char|void|return|if|else|for|while|class|struct|auto|const|std|vector|map|set|unordered_map|unordered_set|string|include|using|namespace|true|false|new|delete)\b/g,
    java: /\b(public|private|protected|class|static|void|return|if|else|for|while|new|import|package|true|false|null|final|int|double|float|boolean|String|System|out|println|Map|HashMap|Set|HashSet|List|ArrayList)\b/g
  };

  const kw = keywords[language] || keywords.javascript;
  const num = /\b\d+(?:\.\d+)?\b/g;
  const str = /("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`)/g;
  const cmt = /(\/\/.*$|#.*$)/g;

  const tokens = [];
  let masked = String(text || "");

  masked = masked.replace(cmt, (m) => {
    const id = `__CMT_${tokens.length}__`;
    tokens.push(`<span class="token token-comment">${escapeHtml(m)}</span>`);
    return id;
  });

  masked = masked.replace(str, (m) => {
    const id = `__STR_${tokens.length}__`;
    tokens.push(`<span class="token token-string">${escapeHtml(m)}</span>`);
    return id;
  });

  let escaped = escapeHtml(masked);
  escaped = escaped.replace(kw, (m) => `<span class="token token-keyword">${m}</span>`);
  escaped = escaped.replace(num, (m) => `<span class="token token-number">${m}</span>`);

  tokens.forEach((tok, idx) => {
    escaped = escaped.replace(new RegExp(`__CMT_${idx}__|__STR_${idx}__`, "g"), tok);
  });

  return escaped;
}

function syntaxHighlight(line, language = "javascript") {
  return safeSyntaxHighlight(line, language);
}

export function buildAnalysisViewModel({ analysis = {}, originalCode = "" }) {
  const code = String(originalCode || "");
  const language = detectLanguageLabel(code);
  const pattern = detectPattern(code);
  const rawImproved = typeof analysis.improvedCode === "string" ? analysis.improvedCode.trim() : "";
  const optimizedCode = rawImproved || code;
  const score = Number.isFinite(Number(analysis.score)) ? Math.max(0, Math.min(100, Math.round(Number(analysis.score)))) : 0;
  const timeComplexity = analysis.newTimeComplexity || analysis.oldTimeComplexity || "Unknown";
  const spaceComplexity = analysis.newSpaceComplexity || analysis.oldSpaceComplexity || "Unknown";
  const readabilityScore = estimateReadability(code, analysis);
  const maintainabilityScore = estimateMaintainability(code, analysis, pattern);
  const diff = computeRealDiff(code, optimizedCode, analysis.issues || []);
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
  // Derive Key Findings (Part 3)
  const rawIssues = Array.isArray(analysis?.issues) ? analysis.issues : [];
  const findings = rawIssues.map((issue, idx) => {
    const textToScan = `${issue.title || ""} ${issue.why || ""} ${issue.suggestion || ""}`.toLowerCase();
    let severity = "MEDIUM";
    if (
      textToScan.includes("o(n^2)") ||
      textToScan.includes("o(n²)") ||
      textToScan.includes("o(2^n)") ||
      textToScan.includes("quadratic") ||
      textToScan.includes("infinite") ||
      textToScan.includes("security") ||
      textToScan.includes("leak") ||
      textToScan.includes("crash") ||
      textToScan.includes("vulnerability")
    ) {
      severity = "HIGH";
    } else if (
      textToScan.includes("naming") ||
      textToScan.includes("style") ||
      textToScan.includes("convention") ||
      textToScan.includes("readability")
    ) {
      severity = "LOW";
    }

    const matchedHunk = diff.hunks.find((h) => h.issue === issue || (issue.lineRange && String(issue.lineRange).includes(String(h.origStartLine))));
    const hunkId = matchedHunk ? matchedHunk.hunkId : (diff.hunks[idx] ? diff.hunks[idx].hunkId : (diff.hunks[0]?.hunkId || null));

    let complexityDelta = null;
    if (analysis?.oldTimeComplexity && analysis?.newTimeComplexity && analysis.oldTimeComplexity !== analysis.newTimeComplexity) {
      complexityDelta = `${analysis.oldTimeComplexity} → ${analysis.newTimeComplexity}`;
    }

    return {
      id: `finding-${idx + 1}`,
      severity,
      title: issue.title || "Logic Observation",
      lineRange: issue.lineRange ? (String(issue.lineRange).toLowerCase().startsWith("line") ? issue.lineRange : `Lines ${issue.lineRange}`) : "",
      why: issue.why || "Improves execution efficiency and robustness.",
      suggestion: issue.suggestion || "",
      complexityDelta: idx === 0 ? complexityDelta : null,
      hunkId
    };
  });

  const timeComplexityDelta =
    analysis?.oldTimeComplexity && analysis?.newTimeComplexity && analysis.oldTimeComplexity !== analysis.newTimeComplexity
      ? `${analysis.oldTimeComplexity} → ${analysis.newTimeComplexity}`
      : null;

  const spaceComplexityDelta =
    analysis?.oldSpaceComplexity && analysis?.newSpaceComplexity && analysis.oldSpaceComplexity !== analysis.newSpaceComplexity
      ? `${analysis.oldSpaceComplexity} → ${analysis.newSpaceComplexity}`
      : null;

  const mainWeakness =
    findings.length > 0
      ? (findings[0].severity === "HIGH" ? `${findings[0].title} is the primary weakness.` : findings[0].why || findings[0].title)
      : (diff.hasChanges ? "Optimization opportunities detected." : "Code is efficient with no major flaws.");

  return {
    originalCode: code,
    optimizedCode,
    score,
    timeComplexity,
    spaceComplexity,
    timeComplexityDelta,
    spaceComplexityDelta,
    mainWeakness,
    findings,
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
        copy: analysis.whyItWorks || pattern.explanation
      },
      {
        id: "pattern",
        label: "Pattern used",
        copy: analysis.patternExplanation || `${pattern.title} is a ${pattern.category.toLowerCase()} pattern that becomes useful when repeated work is the main problem.`
      },
      {
        id: "intuition",
        label: "Interview intuition",
        copy: analysis.interviewIntuition || pattern.interview
      },
      {
        id: "beginner",
        label: "Beginner-friendly",
        copy: analysis.beginnerFriendlyNote || pattern.beginner
      }
    ],
    feedback: createFeedbackData({
      analysis,
      pattern,
      readabilityScore,
      maintainabilityScore
    }),
    learning: createLearningData(pattern),
    suggestions: createSuggestions({ language, pattern, originalCode: code }),
    summaryText:
      analysis.summary ||
      (score > 0
        ? `AI review complete with a ${score}/100 score. The code most closely matches a ${pattern.title.toLowerCase()} pattern.`
        : `AI review complete. The code most closely matches a ${pattern.title.toLowerCase()} pattern.`),
    diffStats: {
      originalLines: diff.stats.originalLines,
      optimizedLines: diff.stats.optimizedLines,
      changedLines: diff.stats.totalChanged,
      breakdown: diff.stats.summaryText
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

function MetricCard({ label, value, status, statusColor, accent = "primary", icon }) {
  return (
    <article className={`metric-card metric-card-${accent}`}>
      <span className="metric-label">{icon && <span className="metric-icon">{icon}</span>}{label}</span>
      <strong className="metric-value">{value}</strong>
      {status && <span className="metric-status" style={{ color: statusColor }}>{status}</span>}
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

function CodeComparisonHero({ model, onCopyOriginal, onCopyOptimized, copyState }) {
  const diff = model.diff || {};
  const alignedRows = diff.alignedRows || [];
  const isNoChanges = diff.identical || !diff.hasChanges || model.analysis?.hasImprovements === false;

  const origLineCount = (model.originalCode || "").split("\n").length;
  const optLineCount = (model.optimizedCode || "").split("\n").length;

  const displayRows = React.useMemo(() => {
    if (alignedRows.length > 0) return alignedRows;
    const lines = (model.originalCode || "").split("\n");
    return lines.map((l, i) => ({
      type: "unchanged",
      origLineNum: i + 1,
      imprvLineNum: i + 1,
      origText: l,
      imprvText: l
    }));
  }, [alignedRows, model.originalCode]);

  return (
    <section className="code-comparison-hero-card" aria-label="Code Comparison">
      <div className="comparison-headers-grid">
        <div className="code-panel-header left">
          <div className="cph-main">
            <span className="cph-dot orig-dot">●</span>
            <span className="cph-title">ORIGINAL CODE</span>
          </div>
          <div className="cph-meta">
            <span className="cph-lang">{model.language}</span>
            <span className="cph-count">{origLineCount} lines</span>
          </div>
        </div>

        <div className="code-panel-header right">
          <div className="cph-main">
            <span className="cph-dot imprv-dot">●</span>
            <span className="cph-title">{isNoChanges ? "CURRENT CODE (ALREADY OPTIMAL)" : "IMPROVED CODE"}</span>
          </div>
          <div className="cph-meta">
            <span className="cph-lang">{model.language}</span>
            <span className="cph-count">{optLineCount} lines</span>
          </div>
        </div>
      </div>

      <div className="comparison-scroll-viewport">
        {displayRows.map((row, idx) => {
          const isMod = row.type === "modified";
          const isDel = row.type === "removed";
          const isAdd = row.type === "added";
          const isIndent = row.isIndentOnly;

          const leftClass = isDel ? "cell-removed" : isMod ? (isIndent ? "cell-indent" : "cell-modified") : "cell-clean";
          const rightClass = isAdd ? "cell-added" : isMod ? (isIndent ? "cell-indent" : "cell-modified") : "cell-clean";

          return (
            <div key={`cmp-row-${idx}`} className={`comparison-row ${row.type}`}>
              {/* Left Column (Original) */}
              <div className={`comparison-cell left ${leftClass} ${!row.origLineNum ? "cell-empty" : ""}`}>
                <span className="cell-gutter">
                  <span className="gutter-num">{row.origLineNum || ""}</span>
                  <span className="gutter-marker">{isDel ? "-" : isMod ? "●" : ""}</span>
                </span>
                <span
                  className="cell-code"
                  dangerouslySetInnerHTML={{
                    __html: row.origLineNum
                      ? safeSyntaxHighlight(row.origText, model.language, isMod ? row.inline : null, "del")
                      : ""
                  }}
                />
              </div>

              {/* Right Column (Improved) */}
              <div className={`comparison-cell right ${rightClass} ${!row.imprvLineNum ? "cell-empty" : ""}`}>
                <span className="cell-gutter">
                  <span className="gutter-num">{row.imprvLineNum || ""}</span>
                  <span className="gutter-marker">{isAdd ? "+" : isMod ? "●" : ""}</span>
                </span>
                <span
                  className="cell-code"
                  dangerouslySetInnerHTML={{
                    __html: row.imprvLineNum
                      ? safeSyntaxHighlight(row.imprvText, model.language, isMod ? row.inline : null, "ins")
                      : ""
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SideBySideDiffView({ alignedRows, language, onCopyOriginal, onCopyOptimized, copyState }) {
  return (
    <div className="diff-full-container">
      <div className="diff-full-header">
        <div className="diff-full-col-title left">
          <span>ORIGINAL CODE</span>
          <button type="button" className={`ghost-button ${copyState === "Original copied" ? "copied" : ""}`} onClick={onCopyOriginal}>
            {copyState === "Original copied" ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className="diff-full-col-title right">
          <span>OPTIMIZED CODE</span>
          <button type="button" className={`ghost-button ${copyState === "Optimized copied" ? "copied" : ""}`} onClick={onCopyOptimized}>
            {copyState === "Optimized copied" ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <div className="diff-scroll-shell">
        {alignedRows.map((row, idx) => {
          const isMod = row.type === "modified";
          const isDel = row.type === "removed";
          const isAdd = row.type === "added";
          const isIndent = row.isIndentOnly;

          const leftClass = isDel
            ? "cell-removed"
            : isMod
              ? (isIndent ? "cell-indent" : "cell-modified")
              : "";
          const rightClass = isAdd
            ? "cell-added"
            : isMod
              ? (isIndent ? "cell-indent" : "cell-modified")
              : "";

          return (
            <div key={`sbs-${idx}`} className="diff-side-row">
              {row.origLineNum ? (
                <div className={`diff-side-cell left ${leftClass}`}>
                  <span className="diff-cell-num">{row.origLineNum}</span>
                  <span
                    className="diff-cell-code"
                    dangerouslySetInnerHTML={{
                      __html: safeSyntaxHighlight(row.origText, language, isMod ? row.inline : null, "del")
                    }}
                  />
                </div>
              ) : (
                <div className="diff-side-cell left diff-empty-cell" />
              )}

              {row.imprvLineNum ? (
                <div className={`diff-side-cell right ${rightClass}`}>
                  <span className="diff-cell-num">{row.imprvLineNum}</span>
                  <span
                    className="diff-cell-code"
                    dangerouslySetInnerHTML={{
                      __html: safeSyntaxHighlight(row.imprvText, language, isMod ? row.inline : null, "ins")
                    }}
                  />
                </div>
              ) : (
                <div className="diff-side-cell right diff-empty-cell" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UnifiedDiffView({ alignedRows, language }) {
  return (
    <div className="diff-unified-container">
      <div className="diff-scroll-shell">
        {alignedRows.map((row, idx) => {
          if (row.type === "unchanged") {
            return (
              <div key={`uni-${idx}`} className="diff-unified-row row-unchanged">
                <span className="unified-num-orig">{row.origLineNum}</span>
                <span className="unified-num-imprv">{row.imprvLineNum}</span>
                <span className="unified-marker">&nbsp;</span>
                <span
                  className="unified-code"
                  dangerouslySetInnerHTML={{ __html: safeSyntaxHighlight(row.origText, language) }}
                />
              </div>
            );
          }

          if (row.type === "modified") {
            return (
              <React.Fragment key={`uni-mod-${idx}`}>
                <div className="diff-unified-row row-removed">
                  <span className="unified-num-orig">{row.origLineNum}</span>
                  <span className="unified-num-imprv"></span>
                  <span className="unified-marker">-</span>
                  <span
                    className="unified-code"
                    dangerouslySetInnerHTML={{
                      __html: safeSyntaxHighlight(row.origText, language, row.inline, "del")
                    }}
                  />
                </div>
                <div className="diff-unified-row row-added">
                  <span className="unified-num-orig"></span>
                  <span className="unified-num-imprv">{row.imprvLineNum}</span>
                  <span className="unified-marker">+</span>
                  <span
                    className="unified-code"
                    dangerouslySetInnerHTML={{
                      __html: safeSyntaxHighlight(row.imprvText, language, row.inline, "ins")
                    }}
                  />
                </div>
              </React.Fragment>
            );
          }

          if (row.type === "removed") {
            return (
              <div key={`uni-rem-${idx}`} className="diff-unified-row row-removed">
                <span className="unified-num-orig">{row.origLineNum}</span>
                <span className="unified-num-imprv"></span>
                <span className="unified-marker">-</span>
                <span
                  className="unified-code"
                  dangerouslySetInnerHTML={{ __html: safeSyntaxHighlight(row.origText, language) }}
                />
              </div>
            );
          }

          if (row.type === "added") {
            return (
              <div key={`uni-add-${idx}`} className="diff-unified-row row-added">
                <span className="unified-num-orig"></span>
                <span className="unified-num-imprv">{row.imprvLineNum}</span>
                <span className="unified-marker">+</span>
                <span
                  className="unified-code"
                  dangerouslySetInnerHTML={{ __html: safeSyntaxHighlight(row.imprvText, language) }}
                />
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

function KeyFindingsSection({ findings = [], onJumpToHunk }) {
  if (!findings || findings.length === 0) return null;

  return (
    <section className="key-findings-section" id="key-findings">
      <div className="findings-header">
        <div className="findings-title-group">
          <span className="findings-eyebrow">KEY FINDINGS</span>
          <h2>Critical Observations & Bottlenecks</h2>
        </div>
        <span className="findings-count-badge">
          {findings.length} {findings.length === 1 ? "Finding" : "Findings"}
        </span>
      </div>

      <div className="findings-grid">
        {findings.map((item) => {
          const sev = (item.severity || "HIGH").toUpperCase();
          const sevClass = sev === "HIGH" ? "sev-high" : sev === "MEDIUM" ? "sev-med" : "sev-low";

          return (
            <article key={item.id} className={`finding-card ${sevClass}`}>
              <div className="finding-card-header">
                <div className="finding-badge-group">
                  <span className={`finding-sev-tag ${sevClass}`}>[{sev}]</span>
                  <span className="finding-title">{item.title}</span>
                  {item.lineRange && <span className="finding-lines">{item.lineRange}</span>}
                </div>
                {item.hunkId && (
                  <button
                    type="button"
                    className="finding-jump-btn"
                    onClick={() => onJumpToHunk?.(item.hunkId)}
                  >
                    View change →
                  </button>
                )}
              </div>

              <div className="finding-body-compact">
                <div className="finding-block">
                  <span className="finding-block-label">Why this change was needed:</span>
                  <p className="finding-block-text">{item.why || "Identified performance, logic or structural issue in the original code."}</p>
                </div>

                {item.suggestion && (
                  <div className="finding-block">
                    <span className="finding-block-label label-better">Why the new approach is better:</span>
                    <p className="finding-block-text">{item.suggestion}</p>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function FullCodeView({ originalCode, optimizedCode, language, onCopyOriginal, onCopyOptimized, copyState, alignedRows = [] }) {
  const origLines = String(originalCode || "").split("\n");
  const optLines = String(optimizedCode || "").split("\n");

  // Map alignedRows by improved line number for precise changed/added line detection
  const optRowMap = React.useMemo(() => {
    const map = new Map();
    if (Array.isArray(alignedRows)) {
      alignedRows.forEach((row) => {
        const lineNum = row?.imprvLineNum ?? row?.optLineNum;
        if (lineNum != null) {
          map.set(lineNum, row);
        }
      });
    }
    return map;
  }, [alignedRows]);

  const changedLineCount = React.useMemo(() => {
    let count = 0;
    for (let i = 1; i <= optLines.length; i++) {
      const r = optRowMap.get(i);
      if (r && (r.type === "added" || r.type === "modified")) count++;
    }
    return count;
  }, [optLines, optRowMap]);

  return (
    <div className="full-code-container">
      <div className="full-code-single-card">
        <div className="full-code-header">
          <div className="full-code-header-left">
            <span className="full-code-title">
              <span className="fc-dot">●</span> COMPLETE CORRECTED SOURCE FILE
            </span>
            <span className="full-code-meta">
              {optLines.length} lines {changedLineCount > 0 && <>· <strong style={{ color: "#00E5FF" }}>{changedLineCount} lines updated</strong></>}
            </span>
          </div>
          <div className="full-code-header-right">
            <button
              type="button"
              className={`primary-button ${copyState === "Optimized copied" ? "copied" : ""}`}
              style={{ fontSize: "0.72rem", padding: "6px 16px" }}
              onClick={onCopyOptimized}
              title="Copy the entire corrected file to paste directly into your editor"
            >
              {copyState === "Optimized copied" ? "✓ COPIED ENTIRE FILE" : "COPY IMPROVED CODE"}
            </button>
            <button
              type="button"
              className={`ghost-button ${copyState === "Original copied" ? "copied" : ""}`}
              style={{ fontSize: "0.72rem", padding: "6px 14px" }}
              onClick={onCopyOriginal}
              title="Copy original code for reference"
            >
              {copyState === "Original copied" ? "✓ Copied" : "Copy Original"}
            </button>
          </div>
        </div>

        <div className="full-code-body">
          {optLines.map((line, i) => {
            const lineNum = i + 1;
            const rowInfo = optRowMap.get(lineNum);
            const isAdded = rowInfo?.type === "added";
            const isModified = rowInfo?.type === "modified";
            const isChanged = isAdded || isModified;
            const lineClass = isAdded ? "code-row-added" : isModified ? "code-row-modified" : "code-row-clean";
            const gutterMarker = isAdded ? "+" : isModified ? "●" : "";

            return (
              <div key={`fc-line-${i}`} className={`code-row ${lineClass}`}>
                <span className="code-line-gutter">
                  <span className="code-line-number">{lineNum}</span>
                  <span className="code-gutter-marker">{gutterMarker}</span>
                </span>
                <span
                  className="code-line-content"
                  dangerouslySetInnerHTML={{
                    __html: safeSyntaxHighlight(line, language, isChanged ? rowInfo?.inline : null, "ins")
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CodeDiffViewer({ model, onCopyOriginal, onCopyOptimized, copyState }) {
  const [viewMode, setViewMode] = React.useState("fullcode");
  const [copiedHunk, setCopiedHunk] = React.useState(null);
  const copyTimerRef = React.useRef(null);

  const diff = model.diff || {};
  const hunks = diff.hunks || [];
  const alignedRows = diff.alignedRows || [];
  const isNoChanges = diff.identical || !diff.hasChanges || model.analysis?.hasImprovements === false;

  const copyText = async (text, id) => {
    if (!text) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopiedHunk(id);
      window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopiedHunk(null), 2000);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  return (
    <SectionShell
      eyebrow="CODE CHANGES"
      title={isNoChanges ? "CODE COMPARISON" : `${hunks.length} ${hunks.length === 1 ? "CHANGE RECOMMENDED" : "CHANGES RECOMMENDED"}`}
      description="Review exact before/after lines with token-level inline diffs."
      className="diff-section"
    >
      {/* If code is already optimal or no changes required (Task 15 & Task 16) */}
      {isNoChanges ? (
        <div className="diff-no-changes-card">
          <span className="no-changes-badge">✓ CODE LOOKS GOOD</span>
          <h3>No meaningful code changes recommended.</h3>
          <p>
            {model.analysis?.summary || "Your current approach is already efficient for this problem. It is correct and follows solid engineering practices."}
          </p>
          <div className="no-changes-metrics">
            <span>Time Complexity: <strong>{model.timeComplexity}</strong></span>
            <span>Space Complexity: <strong>{model.spaceComplexity}</strong></span>
          </div>
          <div className="no-changes-actions">
            <button
              type="button"
              className={`ghost-button ${viewMode === "fullcode" ? "active" : ""}`}
              onClick={() => setViewMode(viewMode === "fullcode" ? "focused" : "fullcode")}
            >
              {viewMode === "fullcode" ? "Hide Code Inspection" : "Inspect Full Code"}
            </button>
          </div>

          {viewMode === "fullcode" && (
            <div style={{ marginTop: "24px", textAlign: "left" }}>
              <FullCodeView
                originalCode={model.originalCode}
                optimizedCode={model.optimizedCode}
                language={model.language}
                onCopyOriginal={onCopyOriginal}
                onCopyOptimized={onCopyOptimized}
                copyState={copyState}
                alignedRows={alignedRows}
              />
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Toolbar with View Mode Switcher and Global Copy Actions */}
          <div className="diff-toolbar">
            <div className="diff-mode-switcher">
              <button
                type="button"
                className={`diff-mode-btn ${viewMode === "fullcode" ? "active" : ""}`}
                onClick={() => setViewMode("fullcode")}
              >
                📄 Full Code
              </button>
              <button
                type="button"
                className={`diff-mode-btn ${viewMode === "focused" ? "active" : ""}`}
                onClick={() => setViewMode("focused")}
              >
                ⚡ Focused Changes ({hunks.length})
              </button>
              <button
                type="button"
                className={`diff-mode-btn ${viewMode === "sideBySide" ? "active" : ""}`}
                onClick={() => setViewMode("sideBySide")}
              >
                ◫ Side-by-Side
              </button>
              <button
                type="button"
                className={`diff-mode-btn ${viewMode === "unified" ? "active" : ""}`}
                onClick={() => setViewMode("unified")}
              >
                ☰ Unified Diff
              </button>
            </div>

            <div className="diff-global-actions">
              <button
                type="button"
                className={`ghost-button ${copyState === "Optimized copied" ? "copied" : ""}`}
                onClick={onCopyOptimized}
              >
                {copyState === "Optimized copied" ? "✓ Copied" : "Copy Improved"}
              </button>
              <button
                type="button"
                className={`ghost-button ${copyState === "Original copied" ? "copied" : ""}`}
                onClick={onCopyOriginal}
              >
                {copyState === "Original copied" ? "✓ Copied" : "Copy Original"}
              </button>
            </div>
          </div>

          {/* VIEW MODE 1: Focused Changes (Task 10) */}
          {viewMode === "focused" && (
            <div className="diff-focused-list">
              {hunks.map((hunk) => (
                <div key={hunk.hunkId} id={hunk.hunkId} className="diff-change-card">
                  <div className="diff-change-header">
                    <div className="diff-change-badge-group">
                      <span className="diff-change-num">CHANGE #{hunk.changeNumber}</span>
                      <span className="diff-change-title">{hunk.title}</span>
                      <span className="diff-change-lines">{hunk.lineLabel}</span>
                    </div>
                    <button
                      type="button"
                      className={`ghost-button ${copiedHunk === hunk.hunkId ? "copied" : ""}`}
                      onClick={() => copyText(hunk.afterSnippet, hunk.hunkId)}
                    >
                      {copiedHunk === hunk.hunkId ? "Copied!" : "Copy Change"}
                    </button>
                  </div>

                  <div className="diff-change-why-box">
                    <span className="why-label">WHY CHANGE THIS?</span>
                    <p>{hunk.whyChange}</p>
                  </div>

                  <div className="diff-change-panes-grid">
                    {/* BEFORE */}
                    <div className="diff-snippet-pane before-pane">
                      <div className="diff-snippet-header">
                        <span>BEFORE</span>
                        <span className="snippet-sub">Original source</span>
                      </div>
                      <div className="code-shell">
                        {hunk.rows.map((row, rIdx) => {
                          if (row.type === "added") return null;
                          const isMod = row.type === "modified";
                          const isDel = row.type === "removed";
                          const lineClass = isMod ? "code-row-modified" : isDel ? "code-row-removed" : "code-row-match";
                          return (
                            <div key={`bf-${rIdx}-${row.origLineNum}`} className={`code-row ${lineClass}`}>
                              <span className="code-line-number">{row.origLineNum || ""}</span>
                              <span
                                className="code-line-content"
                                dangerouslySetInnerHTML={{
                                  __html: safeSyntaxHighlight(row.origText, model.language, isMod ? row.inline : null, "del")
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* AFTER */}
                    <div className="diff-snippet-pane after-pane">
                      <div className="diff-snippet-header">
                        <span>AFTER</span>
                        <span className="snippet-sub">Optimized replacement</span>
                      </div>
                      <div className="code-shell">
                        {hunk.rows.map((row, rIdx) => {
                          if (row.type === "removed") return null;
                          const isMod = row.type === "modified";
                          const isAdd = row.type === "added";
                          const lineClass = isMod ? "code-row-modified" : isAdd ? "code-row-added" : "code-row-match";
                          return (
                            <div key={`af-${rIdx}-${row.imprvLineNum}`} className={`code-row ${lineClass}`}>
                              <span className="code-line-number">{row.imprvLineNum || ""}</span>
                              <span
                                className="code-line-content"
                                dangerouslySetInnerHTML={{
                                  __html: safeSyntaxHighlight(row.imprvText, model.language, isMod ? row.inline : null, "ins")
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="diff-change-better-box">
                    <div className="better-header">
                      <span className="why-label">WHY IS THIS BETTER?</span>
                      <div className="complexity-chip-pill">
                        {model.timeComplexity}
                      </div>
                    </div>
                    <p>{hunk.whyBetter}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW MODE 2: Side-by-Side (Task 11) */}
          {viewMode === "sideBySide" && (
            <SideBySideDiffView
              alignedRows={alignedRows}
              language={model.language}
              onCopyOriginal={onCopyOriginal}
              onCopyOptimized={onCopyOptimized}
              copyState={copyState}
            />
          )}

          {/* VIEW MODE 3: Unified Diff */}
          {viewMode === "unified" && (
            <UnifiedDiffView
              alignedRows={alignedRows}
              language={model.language}
            />
          )}

          {/* VIEW MODE 4: Full Code */}
          {viewMode === "fullcode" && (
            <FullCodeView
              originalCode={model.originalCode}
              optimizedCode={model.optimizedCode}
              language={model.language}
              onCopyOriginal={onCopyOriginal}
              onCopyOptimized={onCopyOptimized}
              copyState={copyState}
              alignedRows={alignedRows}
            />
          )}
        </>
      )}

      {/* Stats Bar */}
      <div className="diff-metrics-footer">
        <div className="diff-metric-pill">
          Original Lines: <strong>{model.diffStats.originalLines}</strong>
        </div>
        <div className="diff-metric-pill">
          Optimized Lines: <strong>{model.diffStats.optimizedLines}</strong>
        </div>
        <div className="diff-metric-pill changed">
          Changed Lines: <strong>{model.diffStats.changedLines}</strong>
        </div>
        <div className="diff-metric-pill" style={{ color: "var(--color-text-secondary)" }}>
          {model.diffStats.breakdown}
        </div>
      </div>
    </SectionShell>
  );
}

function ApproachTabs({ model, onCopy, copyState }) {
  const [active, setActive] = React.useState("brute");
  const current = model.approaches.find((item) => item.id === active) || model.approaches[0];
  const isCopied = copyState === `${current.title} copied`;

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <h3 style={{ margin: 0 }}>{current.title}</h3>
              <button 
                type="button" 
                className={`ghost-button ${isCopied ? "copied" : ""}`}
                style={{ fontSize: '0.65rem', padding: '2px 8px' }}
                onClick={() => onCopy(current.code, `${current.title} copied`)}
              >
                {isCopied ? "Copied!" : "Copy Code"}
              </button>
            </div>
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

function ExplanationTabs({ model, tabs }) {
  const tabList = Array.isArray(tabs)
    ? tabs
    : Array.isArray(model?.explanationTabs)
      ? model.explanationTabs
      : [];

  const [active, setActive] = React.useState("why");
  if (tabList.length === 0) return null;

  const current = tabList.find((item) => item.id === active) || tabList[0] || {};
  const currentCopy = current.copy || "No detailed notes provided.";

  return (
    <SectionShell
      eyebrow="AI Explanation"
      title="Why the Optimization Works"
      description="The review explains the reasoning so the fix is understandable, not just clever."
      className="explanation-section"
    >
      <div className="tab-strip">
        {tabList.map((tab) => (
          <TabButton key={tab.id} active={active === tab.id} onClick={() => setActive(tab.id)}>
            {tab.label}
          </TabButton>
        ))}
      </div>
      <div className="explanation-card">
        <p>{currentCopy}</p>
      </div>
    </SectionShell>
  );
}

function FeedbackPanel({ feedback = {} }) {
  const mistakes = Array.isArray(feedback?.codingMistakes) ? feedback.codingMistakes : [];
  const naming = Array.isArray(feedback?.namingIssues) ? feedback.namingIssues : [];
  const edgeCases = Array.isArray(feedback?.missedEdgeCases) ? feedback.missedEdgeCases : [];
  const scalability = Array.isArray(feedback?.scalabilityProblems) ? feedback.scalabilityProblems : [];
  const bestPractices = Array.isArray(feedback?.bestPractices) ? feedback.bestPractices : [];

  const hasAnyFeedback = mistakes.length > 0 || naming.length > 0 || edgeCases.length > 0 || scalability.length > 0 || bestPractices.length > 0;
  if (!hasAnyFeedback) return null;

  return (
    <SectionShell
      eyebrow="Interview Feedback"
      title="What to Improve"
      description="The feedback is grouped by the kind of signal you would expect in a real interview review."
      className="feedback-section"
    >
      <div className="feedback-grid">
        {mistakes.length > 0 && (
          <div className="feedback-card">
            <span>Coding mistakes</span>
            <ul>
              {mistakes.map((item, idx) => <li key={`cm-${idx}`}>{item}</li>)}
            </ul>
          </div>
        )}
        {naming.length > 0 && (
          <div className="feedback-card">
            <span>Naming issues</span>
            <ul>
              {naming.map((item, idx) => <li key={`nm-${idx}`}>{item}</li>)}
            </ul>
          </div>
        )}
        {edgeCases.length > 0 && (
          <div className="feedback-card">
            <span>Missed edge cases</span>
            <ul>
              {edgeCases.map((item, idx) => <li key={`ec-${idx}`}>{item}</li>)}
            </ul>
          </div>
        )}
        {scalability.length > 0 && (
          <div className="feedback-card">
            <span>Scalability problems</span>
            <ul>
              {scalability.map((item, idx) => <li key={`sc-${idx}`}>{item}</li>)}
            </ul>
          </div>
        )}
      </div>
      {bestPractices.length > 0 && (
        <div className="best-practices-strip">
          {bestPractices.map((item, idx) => (
            <span key={`bp-${idx}`} className="best-practice-pill">{item}</span>
          ))}
        </div>
      )}
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
  const getComplexityStatus = (complexity) => {
    if (!complexity) return { label: "", color: "" };
    const c = complexity.toLowerCase();
    if (c.includes("1") || c.includes("log")) return { label: "EXCELLENT", color: "var(--semantic-success)" };
    if (c.includes("n") && !c.includes("^2")) return { label: "GOOD", color: "#00E5FF" };
    if (c.includes("^2") || c.includes("^3")) return { label: "NEEDS IMPROVEMENT", color: "var(--semantic-warning)" };
    return { label: "CRITICAL", color: "var(--semantic-danger)" };
  };
  const getScoreStatus = (score) => {
    if (score >= 90) return { label: "EXCELLENT", color: "var(--semantic-success)" };
    if (score >= 75) return { label: "GOOD", color: "#00E5FF" };
    if (score >= 50) return { label: "NEEDS IMPROVEMENT", color: "var(--semantic-warning)" };
    return { label: "CRITICAL", color: "var(--semantic-danger)" };
  };

  return (
    <div className="summary-grid">
      <MetricCard
        label="OVERALL SCORE"
        value={model.score || "—"}
        status={getScoreStatus(model.score || 0).label} statusColor={getScoreStatus(model.score || 0).color}
        accent="primary"
      />
      <MetricCard
        label="TIME COMPLEXITY"
        value={model.timeComplexity || "Unknown"}
        status={getComplexityStatus(model.timeComplexity).label} statusColor={getComplexityStatus(model.timeComplexity).color}
        accent="warning"
      />
      <MetricCard
        label="SPACE COMPLEXITY"
        value={model.spaceComplexity || "Unknown"}
        status={getComplexityStatus(model.spaceComplexity).label} statusColor={getComplexityStatus(model.spaceComplexity).color}
        accent="info"
      />
      <MetricCard
        label="READABILITY"
        value={model.readabilityScore || "—"}
        status={getScoreStatus(model.readabilityScore || 0).label} statusColor={getScoreStatus(model.readabilityScore || 0).color}
        accent="success"
      />
      <MetricCard
        label="MAINTAINABILITY"
        value={model.maintainabilityScore || "—"}
        status={getScoreStatus(model.maintainabilityScore || 0).label} statusColor={getScoreStatus(model.maintainabilityScore || 0).color}
        accent="success"
      />
      <MetricCard
        label="PATTERN DETECTED"
        value={model.pattern.title}
        icon="✦ "
        accent="ai"
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

function AdditionalInsightsSection({ model }) {
  const [activeTab, setActiveTab] = React.useState("strengths");
  const edgeCases = Array.isArray(model.analysis?.missedEdgeCases) ? model.analysis.missedEdgeCases : [];
  const strengths = Array.isArray(model.analysis?.strengths) ? model.analysis.strengths : [];
  const whyBetter = model.analysis?.whyBetter || model.analysis?.whyItWorks || "";
  const pattern = model.pattern?.title || "Standard Flow";

  const hasAny = strengths.length > 0 || edgeCases.length > 0 || whyBetter || model.feedback;
  if (!hasAny) return null;

  return (
    <SectionShell
      eyebrow="DEEP ANALYSIS"
      title="Additional Insights & Learning"
      description="Supporting context on edge cases, algorithmic patterns, and code maintainability."
      className="insights-section"
      defaultOpen={false}
    >
      <div className="insights-tabs">
        <button
          type="button"
          className={`insights-tab-btn ${activeTab === "strengths" ? "active" : ""}`}
          onClick={() => setActiveTab("strengths")}
        >
          Strengths & Pattern
        </button>
        {edgeCases.length > 0 && (
          <button
            type="button"
            className={`insights-tab-btn ${activeTab === "edgeCases" ? "active" : ""}`}
            onClick={() => setActiveTab("edgeCases")}
          >
            Edge Cases ({edgeCases.length})
          </button>
        )}
        {model.feedback && (
          <button
            type="button"
            className={`insights-tab-btn ${activeTab === "health" ? "active" : ""}`}
            onClick={() => setActiveTab("health")}
          >
            Code Health Observations
          </button>
        )}
      </div>

      <div className="insights-content">
        {activeTab === "strengths" && (
          <div className="insights-panel">
            {strengths.length > 0 && (
              <div className="insights-block">
                <span className="insights-subheading">Code Strengths</span>
                <ul className="insights-list">
                  {strengths.map((st, i) => (
                    <li key={`st-${i}`}>✓ {st}</li>
                  ))}
                </ul>
              </div>
            )}
            {whyBetter && (
              <div className="insights-block">
                <span className="insights-subheading">Why This Approach Works</span>
                <p className="insights-copy">{whyBetter}</p>
              </div>
            )}
            <div className="insights-block">
              <span className="insights-subheading">Algorithmic Pattern</span>
              <p className="insights-copy">{model.pattern?.explanation || pattern}</p>
            </div>
          </div>
        )}

        {activeTab === "edgeCases" && (
          <div className="insights-panel">
            <span className="insights-subheading">Edge Cases & Boundary Conditions</span>
            <ul className="insights-list edge-case-list">
              {edgeCases.map((ec, i) => (
                <li key={`ec-${i}`}>⚠ {ec}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "health" && model.feedback && (
          <div className="insights-panel">
            <FeedbackPanel feedback={model.feedback} />
          </div>
        )}
      </div>
    </SectionShell>
  );
}

export {
  SectionShell,
  MetricCard,
  HighlightedCode,
  KeyFindingsSection,
  CodeDiffViewer,
  FullCodeView,
  CodeComparisonHero,
  ApproachTabs,
  ExplanationTabs,
  FeedbackPanel,
  LearningPanel,
  SuggestionsPanel,
  SummaryStrip,
  AdditionalInsightsSection,
  ReanalyzePanel,
  detectLanguage,
  detectPattern,
  syntaxHighlight,
  safeSyntaxHighlight
};
