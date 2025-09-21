// FILE: src/app/api/_debug/openai/route.ts
import { NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";

export const runtime = "nodejs";

export async function GET() {
  try {
    const openai = getOpenAI();
    const r = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "ping" }],
      max_tokens: 5,
    });
    return NextResponse.json({
      ok: true,
      hasKey: true,
      model: r.model || "unknown",
      received: r.choices?.[0]?.message?.content ?? null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, hasKey: !!process.env.OPENAI_API_KEY, error: String(err?.message || err) },
      { status: 500 }
    );
  }
}
