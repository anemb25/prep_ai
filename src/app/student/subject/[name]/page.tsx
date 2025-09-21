// SUBJECT PAGE — pretty chapter tiles with a CSS stylesheet
"use client";

import { use as unwrap } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import "./subject.css"; // << import the CSS file in the same folder

type Chapter = { chapter: string; title: string };

export default function SubjectPage(props: { params: Promise<{ name: string }> }) {
  const { name } = unwrap(props.params);
  const subject = decodeURIComponent(name);

  const [school, setSchool]   = useState("");
  const [klass, setKlass]     = useState("");
  const [chapters, setChaps]  = useState<Chapter[]>([]);
  const [counts, setCounts]   = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState<string | null>(null);

  useEffect(() => {
    setSchool(localStorage.getItem("prep.school") || "Geetanjali High School");
    setKlass(localStorage.getItem("prep.class")   || "9");
    localStorage.setItem("prep.subject", subject);
  }, [subject]);

  useEffect(() => {
    async function load() {
      if (!school || !klass || !subject) return;
      setLoading(true);
      setErr(null);
      try {
        // 1) chapters
        const qs = new URLSearchParams({ school, klass, subject });
        const r1 = await fetch(`/api/student/list-chapters?${qs}`, { cache: "no-store" });
        const d1 = await r1.json();
        if (!r1.ok || !d1.ok) throw new Error(d1?.error || "Failed to load chapters.");
        const list: Chapter[] = d1.chapters || [];
        setChaps(list);

        // 2) subtopic counts
        const pairs = await Promise.all(
          list.map(async (c) => {
            const qs2 = new URLSearchParams({ school, klass, subject, chapter: c.chapter });
            const r2 = await fetch(`/api/student/list-subtopics?${qs2}`, { cache: "no-store" });
            const d2 = await r2.json();
            const n = r2.ok && d2.ok && Array.isArray(d2.subtopics) ? d2.subtopics.length : 0;
            return [c.chapter, n] as const;
          })
        );
        setCounts(Object.fromEntries(pairs));
      } catch (e: any) {
        setErr(e?.message || "Something went wrong.");
        setChaps([]);
        setCounts({});
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [school, klass, subject]);

  const heading = useMemo(
    () => (subject.endsWith("s") ? subject : `${subject}s`),
    [subject]
  );

  return (
    <main className="subject-root">
      <div className="subject-wrap">
        {/* Back link */}
        <div className="backRow">
          <Link href="/student" className="backLink">
            <span className="arrow">←</span> Back to Student Portal
          </Link>
        </div>

        {/* Hero */}
        <header className="hero">
          <h1 className="heroTitle">{heading}</h1>
          <p className="heroSub">Select a chapter to begin studying</p>
        </header>

        {/* Card container */}
        <section className="cardShell">
          <h2 className="cardShellTitle">Chapters</h2>

          {loading && <div className="muted">Loading…</div>}
          {!loading && err && <div className="error">{err}</div>}
          {!loading && !err && chapters.length === 0 && (
            <div className="muted">No chapters found.</div>
          )}

          {!loading && !err && chapters.length > 0 && (
            <div className="cardGrid">
              {chapters.map((c) => {
                const n = counts[c.chapter] ?? 0;
                return (
                  <Link
                    key={c.chapter}
                    href={`/student/chapter/${encodeURIComponent(c.chapter)}`}
                    className="chapterCard"
                  >
                    <div className="cardContent">
                      <div className="cardTitle">{c.title}</div>
                      <div className="cardMeta">{n} Subtopic{n === 1 ? "" : "s"}</div>
                      <div className="cardCta">Study Chapter →</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
