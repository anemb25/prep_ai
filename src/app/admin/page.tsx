// FILE: src/app/admin/page.tsx
// Admin Dashboard — matches the reference UI (gradient title, soft card,
// dashed PDF dropzone, add-subtopic link, Save + Generate buttons)
// NOTE: Uses inline SVGs only; no external icon libs.

"use client";

import Link from "next/link";
import { useState } from "react";

type Subject = "Mathematics" | "Biological Science" | "Physical Science";

export default function AdminDashboard() {
  // Form state
  const [school, setSchool] = useState("");
  const [klass, setKlass] = useState("");
  const [subject, setSubject] = useState<Subject>("Physical Science");
  const [chapterTitle, setChapterTitle] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [subs, setSubs] = useState<string[]>([""]);

  // UI state
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  function pushToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  }

  // Actions
  async function onSave() {
    try {
      if (!school || !klass || !subject || !chapterTitle) return pushToast("Fill all required fields.");
      if (!pdfFile) return pushToast("Please choose a PDF.");

      const form = new FormData();
      form.append("school", school);
      form.append("klass", klass);
      form.append("subject", subject);
      form.append("chapterTitle", chapterTitle);
      form.append("chapterSummary", "");
      form.append("pdf", pdfFile);
      form.append("subtopics", JSON.stringify(subs.map((s) => s.trim()).filter(Boolean)));

      setSaving(true);
      const res = await fetch("/api/admin/create-chapter", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Save failed");
      pushToast("✅ Saved. Folders created.");
    } catch (e: any) {
      pushToast(`❌ ${e?.message || "Save failed"}`);
    } finally {
      setSaving(false);
    }
  }

  async function onGenerate() {
    try {
      if (!school || !klass || !subject || !chapterTitle) return pushToast("Fill the form first.");

      setGenerating(true);
      const res = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ school, klass, subject, chapterTitle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Generation failed");
      pushToast("✨ Generated notes, quizzes, study guide & Q&A.");
    } catch (e: any) {
      pushToast(`❌ ${e?.message || "Generation failed"}`);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <main className="admin-landing">
      {/* Soft radial background */}
      <div className="admin-bg" aria-hidden="true">
        <div className="admin-bg__left" />
        <div className="admin-bg__right" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-5 pt-6 pb-20">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 transition hover:text-slate-700">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span className="text-sm">Back to Home</span>
        </Link>

        {/* Title + subtitle */}
        <h1 className="admin-title">Admin Dashboard</h1>
        <p className="admin-sub">Create and manage educational content</p>

        {/* Card */}
        <div className="admin-card">
          {/* School */}
          <label className="admin-label">School</label>
          <input
            className="admin-input"
            placeholder="Enter school name"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
          />

          {/* Class */}
          <label className="admin-label">Class</label>
          <input
            className="admin-input"
            placeholder="Enter class (e.g., Grade 10, Class XII)"
            value={klass}
            onChange={(e) => setKlass(e.target.value)}
          />

          {/* Subject */}
          <label className="admin-label">Subject</label>
          <select className="admin-input" value={subject} onChange={(e) => setSubject(e.target.value as Subject)}>
            <option>Mathematics</option>
            <option>Biological Science</option>
            <option>Physical Science</option>
          </select>

          {/* Chapter Title */}
          <label className="admin-label">Chapter Title</label>
          <input
            className="admin-input"
            placeholder="Enter chapter title"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
          />

          {/* Upload PDF */}
          <label className="admin-label">Upload Chapter PDF</label>
          <label className="admin-drop">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            />
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 16V7m0 0l-3 3m3-3l3 3" />
              <path d="M20 16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2" />
            </svg>
            <span className="ml-2 text-sm text-slate-600">{pdfFile ? pdfFile.name : "Choose PDF file"}</span>
          </label>

          {/* Subtopics */}
          <label className="admin-label">SubTopics</label>
          {subs.map((s, i) => (
            <input
              key={i}
              className="admin-input mb-3"
              placeholder={`Enter subtopic ${i + 1}`}
              value={s}
              onChange={(e) => {
                const next = [...subs];
                next[i] = e.target.value;
                setSubs(next);
              }}
            />
          ))}
          <button
            type="button"
            className="admin-add"
            onClick={() => setSubs((xs) => [...xs, ""])}
          >
            <span className="text-base">＋</span>
            <span>Add another subtopic</span>
          </button>

          {/* Actions */}
          <div className="admin-actions">
            <button type="button" onClick={onSave} disabled={saving} className="btn-save">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
                <path d="M17 21V13H7v8M7 3v5h8" />
              </svg>
              <span>{saving ? "Saving..." : "Save"}</span>
            </button>

            <button type="button" onClick={onGenerate} disabled={generating} className="btn-generate">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2 3 14h7l-1 8L21 8h-7l-1-6z" />
              </svg>
              <span>{generating ? "Generating…" : "Generate"}</span>
            </button>
          </div>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white shadow-xl">
            {toastMsg}
          </div>
        )}
      </div>
    </main>
  );
}
