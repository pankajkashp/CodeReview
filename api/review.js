import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";
import { analyzeCodeWithGemini } from "../reviewService.js";

dotenv.config();

const app = express();
app.use(cors());

// Part 11: Sensible JSON payload limit for code review
app.use(express.json({ limit: "256kb" }));

// Server-side Supabase client for JWT verification (Part 8 & 9)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServer = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Part 17: Fast Health Check Endpoints (Quick diagnostic without Gemini)
app.get(["/api/health", "/api/review", "/"], (req, res) => {
  res.json({
    status: "ok",
    service: "CodeSage AI Review API",
    authConfigured: !!supabaseServer,
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// Part 8 - 12: Review Endpoint (Zero rate-limiting restriction)
app.post(["/api/review", "/"], async (req, res) => {
  const reqStart = Date.now();

  try {
    // 1. JWT Authentication (Part 8 & 9)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required. Please sign in to review code.",
          retryable: false
        }
      });
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication token missing.",
          retryable: false
        }
      });
    }

    if (!supabaseServer) {
      console.error("[API REVIEW] Supabase server credentials missing from environment.");
      return res.status(500).json({
        success: false,
        error: {
          code: "CONFIG_ERROR",
          message: "Authentication service is misconfigured on the server.",
          retryable: false
        }
      });
    }

    // Verify JWT with Supabase Auth
    const { data: authData, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !authData?.user) {
      const isExpired = authError?.message?.toLowerCase().includes("expired");
      return res.status(401).json({
        success: false,
        error: {
          code: isExpired ? "TOKEN_EXPIRED" : "INVALID_TOKEN",
          message: isExpired
            ? "Your session has expired. Please sign in again."
            : "Invalid authentication token. Please sign in again.",
          retryable: false
        }
      });
    }

    const user = authData.user;

    // 2. Request Size & Input Validation
    const { code } = req.body || {};
    if (!code || typeof code !== "string" || !code.trim()) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_CODE",
          message: "No code provided for review.",
          retryable: false
        }
      });
    }

    // Reject oversized payloads (limit to 50,000 characters ~ 1,500 lines of code)
    if (code.length > 50000) {
      return res.status(400).json({
        success: false,
        error: {
          code: "PAYLOAD_TOO_LARGE",
          message: "Code is too large to review. Please submit a smaller file or focused section.",
          retryable: false
        }
      });
    }

    // 3. Verify Gemini Configuration
    if (!process.env.GEMINI_API_KEY) {
      console.error("[API REVIEW] GEMINI_API_KEY is not configured.");
      return res.status(500).json({
        success: false,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "AI analysis service is temporarily unavailable.",
          retryable: true
        }
      });
    }

    // 4. Run AI Analysis (Immediate dispatch to Gemini, no rate limiting)
    const result = await analyzeCodeWithGemini(code);
    const duration = Date.now() - reqStart;
    console.log(`[API REVIEW] ✅ Review completed for user ${user.id} (${duration}ms)`);

    // Standard Success Contract (Part 12)
    return res.json({
      success: true,
      data: result
    });
  } catch (err) {
    const duration = Date.now() - reqStart;
    const status = err.status && Number.isInteger(err.status) ? err.status : 500;
    const isQuota = status === 429;
    const isTransient = status === 429 || status === 502 || status === 503 || status === 504;

    console.error(`[API REVIEW] ❌ Error (${status}, ${duration}ms):`, err.message || err);

    let errorCode = "ANALYSIS_FAILED";
    if (isQuota) errorCode = "QUOTA_EXCEEDED";
    else if (status === 502 || status === 503) errorCode = "SERVICE_UNAVAILABLE";
    else if (status === 504) errorCode = "TIMEOUT";

    return res.status(status).json({
      success: false,
      error: {
        code: errorCode,
        message: err.message || "Failed to analyze code.",
        retryable: isTransient
      }
    });
  }
});

// For Vercel Serverless Functions, export the Express app
export default app;
