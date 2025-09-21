// FILE: src/app/api/admin/create-chapter/route.ts
// WHY: Accepts multipart form, creates chapter folder tree, writes placeholders.

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { slugify } from "@/lib/slug";
import { CONTENT_ROOT, chapterFolderPath } from "@/lib/paths";
import type { ChapterMeta } from "@/types/content";

export const runtime = "nodejs"; // WHY: Route needs fs access

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const school = (form.get("school") as string || "").trim();
    const klass = (form.get("klass") as string || "").trim();
    const subject = (form.get("subject") as string || "").trim();
    const chapterTitle = (form.get("chapterTitle") as string || "").trim();
    const chapterSummary = (form.get("chapterSummary") as string || "").trim();
    const pdf = form.get("pdf") as File | null;
    const subtopicsRaw = (form.get("subtopics") as string) || "[]";

    let subtopics: string[] = [];
    try { subtopics = JSON.parse(subtopicsRaw); } catch { subtopics = []; }

    if (!school || !klass || !subject || !chapterTitle) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (!pdf) {
      return NextResponse.json({ error: "Chapter PDF is required." }, { status: 400 });
    }
    if (!Array.isArray(subtopics) || subtopics.length === 0 || subtopics.some(s => !s?.trim())) {
      return NextResponse.json({ error: "At least one valid subtopic is required." }, { status: 400 });
    }

    const chapterSlug = slugify(chapterTitle);        // e.g., "chapter-01-motion"
    const chapterFolder = `Chapter-${chapterSlug}`;   // e.g., "Chapter-chapter-01-motion"
    const folder = chapterFolderPath({ school, klass, subject, chapterFolder });

    await fs.mkdir(folder, { recursive: true });

    // Save PDF
    const pdfBuffer = Buffer.from(await (pdf as File).arrayBuffer());
    await fs.writeFile(path.join(folder, "chapter.pdf"), pdfBuffer);

    // Metadata (Draft by default — we’ll add a Publish toggle later)
    const now = new Date().toISOString();
    const meta: ChapterMeta = {
      title: chapterTitle,
      summary: chapterSummary,
      status: "Draft",
      version: "v1",
      createdAt: now,
      updatedAt: now,
    };
    await fs.writeFile(path.join(folder, "chapter.meta.json"), JSON.stringify(meta, null, 2), "utf8");

    // Subtopics
    await fs.writeFile(
      path.join(folder, "subtopics.json"),
      JSON.stringify(subtopics.map((s: string) => s.trim()), null, 2),
      "utf8"
    );

    // Placeholders
    await fs.mkdir(path.join(folder, "materials"), { recursive: true });
    for (let i = 0; i < subtopics.length; i++) {
      const index = String(i + 1).padStart(2, "0");
      const sTitle = (subtopics[i] || "").trim();
      const sSlug = slugify(sTitle);
      const sFolder = path.join(folder, "materials", `${index}-${sSlug}`);
      await fs.mkdir(sFolder, { recursive: true });
      await fs.writeFile(path.join(sFolder, "notes.md"), `# ${sTitle}\n\n> Notes will be generated here.\n`, "utf8");
      await fs.writeFile(path.join(sFolder, "quiz.json"), `[]`, "utf8");
    }

    await fs.writeFile(path.join(folder, "study-guide.md"), "# Study Guide\n\n> Will be generated.\n", "utf8");
    await fs.writeFile(path.join(folder, "eoc-qa.md"), "# End of Chapter Q&A\n\n> Will be generated.\n", "utf8");

    return NextResponse.json({ ok: true, folder, message: "Chapter saved. Placeholders created." });
  } catch (err: any) {
    console.error("create-chapter error:", err);
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 });
  }
}
