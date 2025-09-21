// FILE: src/lib/fs_list.ts
// WHY: Server helpers to list subjects and chapters from content/… safely.

import path from "path";
import fs from "fs/promises";

const ROOT = path.join(process.cwd(), "content", "Schools");

export async function listSubjects(school: string, klass: string) {
  const base = path.join(ROOT, school, `Class-${klass}`);
  try {
    const entries = await fs.readdir(base, { withFileTypes: true });
    // return only directories (e.g., "Physical Science", "Mathematics", "Biological Science")
    return entries.filter(e => e.isDirectory()).map(e => e.name);
  } catch {
    return [];
  }
}

export async function listChapters(school: string, klass: string, subject: string) {
  const base = path.join(ROOT, school, `Class-${klass}`, subject);
  try {
    const entries = await fs.readdir(base, { withFileTypes: true });
    // return "Chapter-..." folders only, sorted
    return entries
      .filter(e => e.isDirectory() && e.name.startsWith("Chapter-"))
      .map(e => e.name)
      .sort();
  } catch {
    return [];
  }
}
