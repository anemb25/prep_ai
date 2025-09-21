// FILE: src/lib/fs_chapter.ts
// WHY: Server-only utilities to load chapter meta, study guide, EOC Q&A, and subtopics.

import path from "path";
import fs from "fs/promises";

const CONTENT_ROOT = path.join(process.cwd(), "content");

async function readText(absPath: string) {
  try { return await fs.readFile(absPath, "utf8"); } catch { return ""; }
}
async function readJson<T=any>(absPath: string): Promise<T|null> {
  try { return JSON.parse(await fs.readFile(absPath, "utf8")); } catch { return null; }
}

export function chapterPath(opts: {
  school: string; klass: string; subject: string; chapterFolder: string;
}) {
  const { school, klass, subject, chapterFolder } = opts;
  return path.join(CONTENT_ROOT, "Schools", school, `Class-${klass}`, subject, chapterFolder);
}

export async function readChapterBundle(opts: {
  school: string; klass: string; subject: string; chapterFolder: string;
}) {
  const base = chapterPath(opts);

  // meta + study guide + EOC
  const meta = await readJson<any>(path.join(base, "chapter.meta.json"));
  const studyGuide = await readText(path.join(base, "study-guide.md"));
  const eocQA = await readText(path.join(base, "eoc-qa.md"));

  // subtopics: prefer subtopics.json order; fall back to materials folder scan
  const subsJson = await readJson<string[]>(path.join(base, "subtopics.json"));
  let subtopics: { order: number; title: string; subtopic_id: string; folderName: string }[] = [];

  const materialsDir = path.join(base, "materials");
  let folders: string[] = [];
  try {
    const entries = await fs.readdir(materialsDir, { withFileTypes: true });
    folders = entries.filter(e => e.isDirectory()).map(e => e.name).sort(); // "01-xylem", "02-phloem"
  } catch { folders = []; }

  if (Array.isArray(subsJson) && subsJson.length && folders.length) {
    subtopics = folders.map((fname, idx) => {
      const label = subsJson[idx] || fname.replace(/^\d+-/, "").replace(/-/g, " ");
      return {
        order: idx + 1,
        title: label,
        subtopic_id: `${idx + 1}`.padStart(2, "0"),
        folderName: fname,
      };
    });
  } else {
    // fallback from folder names
    subtopics = folders.map((fname, idx) => ({
      order: idx + 1,
      title: fname.replace(/^\d+-/, "").replace(/-/g, " "),
      subtopic_id: `${idx + 1}`.padStart(2, "0"),
      folderName: fname,
    }));
  }

  return { base, meta, studyGuide, eocQA, subtopics };
}
