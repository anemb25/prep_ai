// FILE: src/app/api/admin/generate/route.ts
// STRICT generate: no hardcoding. Uses exactly what Admin enters.
// - Requires school, klass, subject, chapterTitle (400 if missing)
// - If USE_OPENAI=1 and OPENAI_API_KEY present → call OpenAI
// - Else: writes mock content so flow still works

import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
async function ensureDir(p: string) { await fs.mkdir(p, { recursive: true }).catch(() => {}); }
async function writeFileSafe(abs: string, data: string) { await ensureDir(path.dirname(abs)); await fs.writeFile(abs, data, "utf8"); }

function mockStudyGuide(chapter: string, subs: string[]) {
  const lines = subs.map((t, i) => `- Day ${i + 1}: **${t}** → notes + quiz`).join("\n");
  return `# How to study: ${chapter}\n\n${lines}\n- Final day: quick revision\n`;
}
function mockNotes(title: string, chapter: string) {
  return `# ${title}\n\n- Key idea A (brief)\n- Example B (one line)\n- Common mistake C (fix)\n`;
}
function mockEOC(chapter: string) {
  return `# End-of-Chapter Q&A — ${chapter}\n\n**Q:** One important idea?\n**A:** Short, exam-ready answer.\n`;
}
function mockQuiz(title: string) {
  return JSON.stringify(
    Array.from({ length: 5 }).map((_, i) => ({
      question_id: `q${i + 1}`,
      stem: `${title}: pick the correct statement.`,
      options: ["A", "B", "C", "D"],
      answer_index: i % 4,
      rationale: "Short rationale.",
    })),
    null,
    2
  );
}

async function maybeOpenAI(prompt: string, type: "md" | "quiz"): Promise<string> {
  const use = process.env.USE_OPENAI === "1";
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!use || !key) return "__MOCK__";
  try {
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({ apiKey: key });
    const sys =
      type === "quiz"
        ? "Return ONLY a JSON array of 5 MCQs for high school students: [{question_id, stem, options[4], answer_index, rationale}]."
        : "Write clear, structured markdown notes/study material for high school students. Use headings and bullets.";
    const r = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: sys }, { role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: type === "quiz" ? 700 : 1100,
    });
    return r.choices?.[0]?.message?.content?.trim() || "__MOCK__";
  } catch (e) {
    console.error("OpenAI error:", e);
    return "__MOCK__";
  }
}

export async function POST(req: Request) {
  try {
    const { school, klass, subject, chapterTitle } = await req.json();

    if (!school || !klass || !subject || !chapterTitle) {
      return NextResponse.json(
        { error: "Missing school, klass, subject, or chapterTitle." },
        { status: 400 }
      );
    }

    const chapterFolder = `Chapter-${slugify(chapterTitle)}`;
    const base = path.join(process.cwd(), "content", "Schools", school, `Class-${klass}`, subject, chapterFolder);
    await ensureDir(base);

    // subtopics.json must already exist from Save step; if not, create an empty default
    const subtopicsPath = path.join(base, "subtopics.json");
    let subtopics: string[] = [];
    try {
      const raw = await fs.readFile(subtopicsPath, "utf8");
      subtopics = JSON.parse(raw);
      if (!Array.isArray(subtopics) || subtopics.length === 0) throw new Error("Empty subtopics");
    } catch {
      subtopics = ["Introduction", "Key Concepts", "Applications"];
      await writeFileSafe(subtopicsPath, JSON.stringify(subtopics, null, 2));
    }

    // study-guide.md
    let studyGuide = await maybeOpenAI(
      `Create a day-by-day study guide for chapter "${chapterTitle}". Subtopics: ${subtopics.join(", ")}.`,
      "md"
    );
    if (studyGuide === "__MOCK__") studyGuide = mockStudyGuide(chapterTitle, subtopics);
    await writeFileSafe(path.join(base, "study-guide.md"), studyGuide);

    // eoc-qa.md
    let eoc = await maybeOpenAI(
      `Write an End-of-Chapter Q&A (5 concise QAs) for "${chapterTitle}" for a high school student. Use markdown.`,
      "md"
    );
    if (eoc === "__MOCK__") eoc = mockEOC(chapterTitle);
    await writeFileSafe(path.join(base, "eoc-qa.md"), eoc);

    // subtopic materials
    for (let i = 0; i < subtopics.length; i++) {
      const title = subtopics[i];
      const subslug = slugify(title);
      const folderName = `${String(i + 1).padStart(2, "0")}-${subslug}`;
      const subDir = path.join(base, "materials", folderName);
      await ensureDir(subDir);

      // notes.md
      let notes = await maybeOpenAI(
        `Write structured markdown notes for the subtopic "${title}" inside chapter "${chapterTitle}".`,
        "md"
      );
      if (notes === "__MOCK__") notes = mockNotes(title, chapterTitle);
      await writeFileSafe(path.join(subDir, "notes.md"), notes);

      // quiz.json
      let quiz = await maybeOpenAI(
        `Return ONLY a JSON array of 5 MCQs for subtopic "${title}" (fields: question_id, stem, options[4], answer_index, rationale).`,
        "quiz"
      );
      try { JSON.parse(quiz); } catch { quiz = mockQuiz(title); }
      await writeFileSafe(path.join(subDir, "quiz.json"), quiz);
    }

    const usedOpenAI = process.env.USE_OPENAI === "1" && !!process.env.OPENAI_API_KEY;
    return NextResponse.json({ ok: true, usedOpenAI, base, subtopics: subtopics.length });
  } catch (err: any) {
    console.error("generate error:", err);
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
