import dotenv from "dotenv";
import process from "node:process";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

async function testModel(modelName) {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    console.log(`Testing ${modelName}...`);
    const model = genAI.getGenerativeModel({ model: modelName });
    const _result = await model.generateContent("hello");
    console.log(`SUCCESS with ${modelName}`);
    return true;
  } catch (err) {
    console.error(`FAILURE with ${modelName}:`, err.message);
    return false;
  }
}

async function run() {
    if (await testModel("gemini-2.0-flash")) return;
    if (await testModel("gemini-2.5-flash")) return;
    if (await testModel("gemini-3-flash-preview")) return;
    if (await testModel("gemini-2.0-flash-lite")) return;
}

run();
