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

function rootFor(school: string, klass: string, subject: string) {
  // Matches your structure
  return path.join(process.cwd(), "content", "Schools", school, `Class-${klass}`, subject);
}

function prettyChapter(s: string) {
  return s.replace(/^Chapter-/, "").replace(/-/g, " ");
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const school  = clean(url.searchParams.get("school"));
  const klass   = clean(url.searchParams.get("klass"));
  const subject = clean(url.searchParams.get("subject"));

  const missing = [
    !school && "school", !klass && "klass", !subject && "subject"
  ].filter(Boolean) as string[];
  if (missing.length) {
    return Response.json({ ok: false, error: `Missing: ${missing.join(", ")}` }, { status: 400 });
  }

  const base = rootFor(school, klass, subject);
  let entries: any[] = [];
  try {
    entries = await fs.readdir(base, { withFileTypes: true });
  } catch {
    return Response.json({ ok: false, error: "Subject not found.", base }, { status: 404 });
  }

  const chapters = entries
    .filter((e) => e.isDirectory() && e.name.toLowerCase().startsWith("chapter-"))
    .map((e) => ({ chapter: e.name, title: prettyChapter(e.name) }));

  return Response.json({ ok: true, chapters, base });
}
