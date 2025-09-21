// FILE: src/lib/paths.ts
// WHY: Central place to build absolute paths for saving content on disk.

import path from "path"; // WHY: Join paths safely across Windows/Linux/Mac

// WHY: All chapter content will live under this folder at the project root.
export const CONTENT_ROOT = path.join(process.cwd(), "content");

// WHY: Build the per-chapter folder path from taxonomy and chapter slug.
export function chapterFolderPath(opts: {
  school: string;
  klass: string;
  subject: string;
  chapterFolder: string; // e.g., "Chapter-01-motion"
}) {
  const { school, klass, subject, chapterFolder } = opts;
  return path.join(
    CONTENT_ROOT,
    "Schools",
    school,
    `Class-${klass}`,
    subject,
    chapterFolder
  );
}
