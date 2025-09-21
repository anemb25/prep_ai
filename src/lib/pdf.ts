// FILE: src/lib/pdf.ts
// WHY: Extract text from saved chapter.pdf for grounding, using a dynamic import for CommonJS pkg.

import fs from "fs/promises";
import path from "path";
import { chapterFolderPath } from "@/lib/paths";

export async function readChapterText(opts: {
  school: string;
  klass: string;
  subject: string;
  chapterFolder: string; // e.g., "Chapter-chapter-01-motion"
}) {
  // WHY: Resolve absolute path to the saved chapter.pdf
  const folder = chapterFolderPath(opts);
  const pdfPath = path.join(folder, "chapter.pdf");

  // WHY: Read file as Buffer for pdf-parse
  const buffer = await fs.readFile(pdfPath);

  // ✅ IMPORTANT: Dynamic import so Next’s ESM bundler handles this CommonJS module safely
  const { default: pdfParse } = await import("pdf-parse");

  // WHY: Parse all pages into plain text (pdf-parse returns { text, ... })
  const data = await pdfParse(buffer);

  return data?.text || "";
}
