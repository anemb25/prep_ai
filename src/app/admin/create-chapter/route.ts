// FILE: src/app/api/admin/create-chapter/route.ts
// WHY: Receives the Admin form (multipart), validates it, and writes files to disk
//      in the exact folder hierarchy we agreed on. This is the "save" step.
//      The "generate notes/quiz with OpenAI" will be added in Part 2-C.

import { NextResponse } from "next/server";                 // WHY: Build HTTP responses
import fs from "fs/promises";                               // WHY: Modern promise-based file APIs
import path from "path";                                    // WHY: Cross-platform path joins
import { slugify } from "@/lib/slug";                       // WHY: Safe folder names
import { CONTENT_ROOT, chapterFolderPath } from "@/lib/paths"; // WHY: Consistent content roots
import type { ChapterMeta, SubtopicsFile } from "@/types/content"; // WHY: Type-safe JSON files

export const runtime = "nodejs"; // WHY: Ensure file system access in the Node.js runtime

export async function POST(req: Request) {
  try {
    // WHY: Parse multipart form data sent from the Admin page
    const form = await req.formData();

    // WHY: Read required fields
    const school = (form.get("school") as string)?.trim();
    const klass = (form.get("klass") as string)?.trim();         // "6" | "7" | "8" | "9"
    const subject = (form.get("subject") as string)?.trim();     // "Mathematics" | ...
    const chapterTitle = (form.get("chapterTitle") as string)?.trim();
    const chapterSummary = (form.get("chapterSummary") as string | null)?.trim() || "";
    const pdf = form.get("pdf") as File | null;                  // WHY: The uploaded chapter PDF
    const subtopicsRaw = (form.get("subtopics") as string) || "[]"; // WHY: JSON string from client
    const subtopics: string[] = JSON.parse(subtopicsRaw);        // WHY: Convert to array

    // WHY: Validate minimal inputs to avoid dangling folders
    if (!school || !klass || !subject || !chapterTitle) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (!pdf) {
      return NextResponse.json({ error: "Chapter PDF is required." }, { status: 400 });
    }
    if (!Array.isArray(subtopics) || subtopics.length === 0 || subtopics.some(s => !s.trim())) {
      return NextResponse.json({ error: "At least one valid subtopic is required." }, { status: 400 });
    }

    // WHY: Create a safe folder name with running index "Chapter-XX-<slug>"
    //      For MVP we default to "Chapter-<slug>" (no auto-numbering yet).
    const chapterSlug = slugify(chapterTitle);                   // e.g., "chapter-01-motion"
    const chapterFolder = `Chapter-${chapterSlug}`;              // e.g., "Chapter-chapter-01-motion"

    // WHY: Ensure the folder structure exists
    const folder = chapterFolderPath({ school, klass, subject, chapterFolder });
    await fs.mkdir(folder, { recursive: true });                 // WHY: Create deep folders safely

    // WHY: Save the uploaded PDF as "chapter.pdf"
    const pdfArrayBuffer = await pdf.arrayBuffer();              // WHY: Read browser File into memory
    const pdfBuffer = Buffer.from(pdfArrayBuffer);               // WHY: Convert to Node Buffer
    await fs.writeFile(path.join(folder, "chapter.pdf"), pdfBuffer); // WHY: Write to disk

    // WHY: Write the chapter metadata (Draft by default)
    const now = new Date().toISOString();                        // WHY: Timestamp for audit
    const meta: ChapterMeta = {
      title: chapterTitle,
      summary: chapterSummary,
      status: "Draft",                                           // WHY: Admin will publish later
      version: "v1",                                             // WHY: First saved version
      createdAt: now,
      updatedAt: now,
    };
    await fs.writeFile(
      path.join(folder, "chapter.meta.json"),
      JSON.stringify(meta, null, 2),                             // WHY: Prettified JSON for readability
      "utf8"
    );

    // WHY: Save subtopics as ordered list (subtopics.json)
    const subtopicsPath = path.join(folder, "subtopics.json");
    const subtopicsJson: SubtopicsFile = subtopics.map(s => s.trim());
    await fs.writeFile(subtopicsPath, JSON.stringify(subtopicsJson, null, 2), "utf8");

    // WHY: Create base files/folders expected by the student UI
    await fs.mkdir(path.join(folder, "materials"), { recursive: true }); // WHY: Parent dir for subtopic folders

    // WHY: Create numbered subtopic folders (01-<slug>, 02-<slug>, ...)
    for (let i = 0; i < subtopicsJson.length; i++) {
      const index = String(i + 1).padStart(2, "0");              // WHY: Keeps natural order in filesystem
      const sTitle = subtopicsJson[i];
      const sSlug = slugify(sTitle);
      const sFolder = path.join(folder, "materials", `${index}-${sSlug}`);
      await fs.mkdir(sFolder, { recursive: true });

      // WHY: Create placeholder files to prove structure is ready
      await fs.writeFile(path.join(sFolder, "notes.md"), `# ${sTitle}\n\n> Notes will be generated here.\n`, "utf8");
      await fs.writeFile(path.join(sFolder, "quiz.json"), `[]`, "utf8"); // WHY: Will fill in Part 2-C
    }

    // WHY: Create placeholder study guide & EOC files
    await fs.writeFile(path.join(folder, "study-guide.md"), "# Study Guide\n\n> Will be generated.\n", "utf8");
    await fs.writeFile(path.join(folder, "eoc-qa.md"), "# End of Chapter Q&A\n\n> Will be generated.\n", "utf8");

    // WHY: Respond success + where we saved it
    return NextResponse.json({
      ok: true,
      folder,
      message: "Chapter saved. Content placeholders created. Ready for generation.",
    });
  } catch (err: any) {
    // WHY: Surface a friendly error to the UI
    console.error("Create chapter error:", err);
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 });
  }
}
