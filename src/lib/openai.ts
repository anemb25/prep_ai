// FILE: src/lib/openai.ts
import OpenAI from "openai";

export function getOpenAI() {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) {
    throw new Error("OPENAI_API_KEY is missing. Add it to .env.local and restart dev server.");
  }
  return new OpenAI({ apiKey: key });
}
