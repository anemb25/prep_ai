// FILE: src/lib/fs_subtopic.ts
// WHY: Server-only util to load notes.md and quiz.json for one subtopic folder.

import path from "path";
import fs from "fs/promises";

const CONTENT_ROOT = path.join(process.cwd(), "content");

export function subtopicFolderPath(opts: {
  school: string; klass: string; subject: string;
  chapterFolder: string;   // e.g., "Chapter-chapter-01-motion"
  subtopicFolder: string;  // e.g., "01-inertia"
}) {
  return path.join(
    CONTENT_ROOT,
    "Schools",
    opts.school,
    `Class-${opts.klass}`,
    opts.subject,
    opts.chapterFolder,
    "materials",
    opts.subtopicFolder
  );
}

async function readTextIfExists(absPath: string) {
  try { return await fs.readFile(absPath, "utf8"); } catch { return ""; }
}
async function readJsonIfExists<T=any>(absPath: string): Promise<T|null> {
  try { return JSON.parse(await fs.readFile(absPath, "utf8")); } catch { return null; }
}

export async function readSubtopicBundle(opts: {
  school: string; klass: string; subject: string;
  chapterFolder: string; subtopicFolder: string;
}) {
  const folder = subtopicFolderPath(opts);
  const notes = await readTextIfExists(path.join(folder, "notes.md"));
  const quiz  = (await readJsonIfExists<any[]>(path.join(folder, "quiz.json"))) || [];
  return { folder, notes, quiz };
}
