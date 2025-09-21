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

function chapterRoots(school: string, klass: string, subject: string, chapter: string) {
  const base = path.join(process.cwd(), "content", "Schools", school, `Class-${klass}`, subject, chapter);
  // Support optional "materials" layer
  return [path.join(base, "materials"), base];
}

function pretty(s: string) {
  return s.replace(/^\d+-/, "").replace(/-/g, " ");
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const school  = clean(url.searchParams.get("school"));
  const klass   = clean(url.searchParams.get("klass"));
  const subject = clean(url.searchParams.get("subject"));
  const chapter = clean(url.searchParams.get("chapter"));

  const missing = [
    !school && "school", !klass && "klass", !subject && "subject", !chapter && "chapter"
  ].filter(Boolean) as string[];
  if (missing.length) return Response.json({ ok:false, error:`Missing: ${missing.join(", ")}` }, { status:400 });

  for (const base of chapterRoots(school, klass, subject, chapter)) {
    try {
      const entries = await fs.readdir(base, { withFileTypes: true });
      const subs = entries
        .filter((e) => e.isDirectory())
        .map((e) => ({ sub: e.name, title: pretty(e.name) }));
      if (subs.length) return Response.json({ ok: true, subtopics: subs, base });
    } catch {}
  }

  return Response.json({ ok:false, error:"No subtopics found.", tried: chapterRoots(school,klass,subject,chapter) }, { status:404 });
}
