// FILE: src/app/api/student/list-subjects/route.ts
// WHY: List subjects for a given school/class from content folders.

import { NextResponse } from "next/server";
import { listSubjects } from "@/lib/fs_list";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const school = (url.searchParams.get("school") || "").trim();
  const klass = (url.searchParams.get("klass") || "").trim();
  if (!school || !klass) {
    return NextResponse.json({ error: "Missing school or klass" }, { status: 400 });
  }
  const subjects = await listSubjects(school, klass);
  return NextResponse.json({ ok: true, subjects });
}
