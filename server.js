import dotenv from "dotenv";
import process from "node:process";
import app from "./api/review.js";

dotenv.config();

const PORT = process.env.PORT || 3001;
console.log("GEMINI KEY:", process.env.GEMINI_API_KEY ? "Loaded ✅" : "Missing ❌");

app.listen(PORT, () => {
  console.log(`🚀 CodeSage Dev Server running on http://localhost:${PORT}`);
});

