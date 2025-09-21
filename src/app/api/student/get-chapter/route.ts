import path from "node:path";
import fs from "node:fs/promises";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Clean a single query value
function clean(s?: string | null) {
  if (!s) return "";
  const t = decodeURIComponent(s).trim();
  if (t.includes("..")) return "";
  return t;
}

// Subject/chapter roots (supports your layout with optional "materials")
function chapterRoots(school: string, klass: string, subject: string, chapter: string) {
  const base = path.join(process.cwd(), "content", "Schools", school, `Class-${klass}`, subject, chapter);
  return {
    base,
    materials: path.join(base, "materials"),
  };
}

async function dirExists(p: string) {
  try { return (await fs.stat(p)).isDirectory(); } catch { return false; }
}
async function readTextMaybe(p: string) {
  try { return await fs.readFile(p, "utf-8"); } catch { return null; }
}

const CHAPTER_FILES = [
  "chapter.md",
  "overview.md",
  "study.md",
  "study-plan.md",
  "notes.md",          // last resort
];

function pretty(s: string) {
  return s.replace(/^Chapter-/, "").replace(/-/g, " ");
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const school  = clean(url.searchParams.get("school"));
  const klass   = clean(url.searchParams.get("klass"));
  const subject = clean(url.searchParams.get("subject"));
  const chapter = clean(url.searchParams.get("chapter"));

  const missing = [
    !school && "school",
    !klass && "klass",
    !subject && "subject",
    !chapter && "chapter",
  ].filter(Boolean) as string[];
  if (missing.length) {
    return Response.json({ ok:false, error:`Missing: ${missing.join(", ")}` }, { status:400 });
  }

  const roots = chapterRoots(school, klass, subject, chapter);

  // 1) Read chapter-level study file (try root first, then /materials)
  let study = "";
  for (const fname of CHAPTER_FILES) {
    study ||= (await readTextMaybe(path.join(roots.base, fname))) || "";
    if (!study) study = (await readTextMaybe(path.join(roots.materials, fname))) || "";
    if (study) break;
  }

  // 2) List subtopics (prefer /materials, then root)
  let subtopics: { sub: string; title: string }[] = [];
  for (const root of [roots.materials, roots.base]) {
    if (!(await dirExists(root))) continue;
    const entries = await fs.readdir(root, { withFileTypes: true });
    const subs = entries
      .filter(e => e.isDirectory())
      .map(e => ({ sub: e.name, title: e.name.replace(/^\d+-/, "").replace(/-/g, " ") }));
    if (subs.length) { subtopics = subs; break; }
  }

  if (!study && subtopics.length === 0) {
    return Response.json({
      ok:false,
      error:"No chapter study text or subtopics found.",
      lookedIn:[roots.base, roots.materials],
      expectedFiles: CHAPTER_FILES,
      meta:{ school, klass, subject, chapter }
    }, { status:404 });
  }

  return Response.json({
    ok:true,
    chapterTitle: pretty(chapter),
    study,
    subtopics,
    roots,
    meta:{ school, klass, subject, chapter }
  });
}

export async function POST(req: Request) { return GET(req); }
