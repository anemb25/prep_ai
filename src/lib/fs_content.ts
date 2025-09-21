// FILE: src/lib/fs_content.ts
// WHY (file): Centralized, server-only utilities to read our generated content from disk.
// WHY (file): We keep filesystem logic here so routes/components can stay simple.

import path from "path";                     // WHY: Cross-platform safe path joins
import fs from "fs/promises";                // WHY: Promise-based filesystem API

// WHY: Root folder where admin-created content lives (gitignored).
const CONTENT_ROOT = path.join(process.cwd(), "content");

/**
 * WHY: Build absolute path to a subject folder:
 * content/Schools/{School}/Class-{klass}/{Subject}
 */
export function subjectFolderPath(
  school: string,
  klass: string,
  subject: string
) {
  return path.join(CONTENT_ROOT, "Schools", school, `Class-${klass}`, subject);
}

/**
 * WHY: Read a JSON file if it exists, or return null without throwing.
 */
async function readJsonIfExists<T = any>(absPath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(absPath, "utf8"); // WHY: Read as text
    return JSON.parse(raw) as T;                    // WHY: Parse to object
  } catch {
    return null;                                    // WHY: File missing or bad JSON → soft fail
  }
}

/**
 * WHY: List chapters for a subject by scanning folders under the subject path
 * and reading each folder’s chapter.meta.json.
 */
export async function listChapters(
  school: string,
  klass: string,
  subject: string
) {
  const folder = subjectFolderPath(school, klass, subject); // WHY: Where chapters live

  // WHY: Try reading the directory; if missing, return empty list gracefully
  let entries: { name: string; isDir: boolean }[] = [];
  try {
    const dirents = await fs.readdir(folder, { withFileTypes: true });
    entries = dirents
      .filter((d) => d.isDirectory())
      .map((d) => ({ name: d.name, isDir: d.isDirectory() }));
  } catch {
    return []; // WHY: Subject folder not found yet
  }

  // WHY: For each chapter folder, read its metadata (title, summary, status)
  const chapters = [];
  for (const e of entries) {
    const chapterFolder = path.join(folder, e.name);
    const metaPath = path.join(chapterFolder, "chapter.meta.json");
    const meta = await readJsonIfExists<{
      title: string;
      summary?: string;
      status?: "Draft" | "Published";
      version?: string;
      createdAt?: string;
      updatedAt?: string;
    }>(metaPath);

    // WHY: Skip if no metadata (incomplete save) or status is Draft (student shouldn’t see)
    if (!meta || meta.status !== "Published") continue;

    chapters.push({
      folderName: e.name,         // e.g., "Chapter-chapter-01-motion"
      title: meta.title || e.name,
      summary: meta.summary || "",
      status: meta.status || "Draft",
      version: meta.version || "v1",
      updatedAt: meta.updatedAt || "",
      // WHY: Slug for the student route. We reuse the folder name to locate files later.
      slug: e.name,
    });
  }

  // WHY: Sort chapters by folder name (keeps natural order if names are prefixed)
  chapters.sort((a, b) => a.folderName.localeCompare(b.folderName));
  return chapters;
}
