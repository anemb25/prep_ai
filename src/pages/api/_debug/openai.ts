// FILE: src/pages/api/_debug/openai.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const key = process.env.OPENAI_API_KEY?.trim();
    if (!key) {
      return res.status(500).json({ ok: false, hasKey: false, error: 'OPENAI_API_KEY missing' });
    }
    const openai = new OpenAI({ apiKey: key });

    const r = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'ping' }],
      max_tokens: 5,
    });

    return res.status(200).json({
      ok: true,
      hasKey: true,
      model: r.model || 'unknown',
      received: r.choices?.[0]?.message?.content ?? null,
    });
  } catch (err: any) {
    return res.status(500).json({
      ok: false,
      hasKey: !!process.env.OPENAI_API_KEY,
      error: String(err?.message || err),
    });
  }
}
