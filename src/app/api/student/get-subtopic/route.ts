import path from "node:path";
import fs from "node:fs/promises";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(s?: string | null) {
  if (!s) return "";
  const t = decodeURIComponent(s).trim();
  if (t.includes("..")) return "";
  return t;
}

function candidates(p:{school:string;klass:string;subject:string;chapter:string;sub:string}) {
  const root = process.cwd();
  const b = path.join(root, "content", "Schools", p.school, `Class-${p.klass}`, p.subject, p.chapter);
  return [
    path.join(b, "materials", p.sub),
    path.join(b, p.sub),
  ];
}

async function readTextMaybe(p: string) { try { return await fs.readFile(p, "utf-8"); } catch { return null; } }
async function readJsonMaybe(p: string) { try { return JSON.parse(await fs.readFile(p, "utf-8")); } catch { return null; } }

export async function GET(req: Request) {
  const url = new URL(req.url);
  const p = {
    school:  clean(url.searchParams.get("school")),
    klass:   clean(url.searchParams.get("klass")),
    subject: clean(url.searchParams.get("subject")),
    chapter: clean(url.searchParams.get("chapter")),
    sub:     clean(url.searchParams.get("sub")),
  };
  const missing = Object.entries(p).filter(([_,v]) => !v).map(([k])=>k);
  if (missing.length) return Response.json({ ok:false, error:`Missing: ${missing.join(", ")}`, received:p }, { status:400 });

  for (const base of candidates(p)) {
    const notes = await readTextMaybe(path.join(base, "notes.md"));
    const quizRaw = await readJsonMaybe(path.join(base, "quiz.json"));
    const quiz = Array.isArray(quizRaw?.questions) ? quizRaw.questions : Array.isArray(quizRaw) ? quizRaw : [];
    if (notes || quiz.length) return Response.json({ ok:true, notes: notes||"", quiz, base, meta:p });
  }
  return Response.json({ ok:false, error:"No content found", tried:candidates(p), meta:p }, { status:404 });
}

export async function POST(req: Request) { return GET(req); }
