// CHAPTER PAGE — nice UI: hero title, study approach pill, and subtopic tiles.
"use client";

import { use as unwrap } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import "./chapter.css"; // <-- stylesheet below

type Subtopic = { sub: string; title: string };

export default function ChapterPage(props: { params: Promise<{ slug: string }> }) {
  // Next 15: unwrap dynamic params
  const { slug } = unwrap(props.params);

  const [school, setSchool] = useState("");
  const [klass, setKlass]   = useState("");
  const [subject, setSubj]  = useState("");

  const [study, setStudy]   = useState("");
  const [subs, setSubs]     = useState<Subtopic[]>([]);
  const [loading, setLoad]  = useState(true);
  const [err, setErr]       = useState<string | null>(null);

  useEffect(() => {
    setSchool(localStorage.getItem("prep.school")  || "Geetanjali High School");
    setKlass (localStorage.getItem("prep.class")   || "9");
    setSubj  (localStorage.getItem("prep.subject") || "Physical Science");
  }, []);

  useEffect(() => {
    async function load() {
      if (!school || !klass || !subject) return;
      setLoad(true); setErr(null);
      try {
        const qs = new URLSearchParams({ school, klass, subject, chapter: slug });
        const res = await fetch(`/api/student/get-chapter?${qs}`, { cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data?.error || "Failed to load chapter");
        setStudy(data.study || "");
        setSubs(data.subtopics || []);
      } catch (e:any) {
        setErr(e.message || "Error");
        setStudy("");
        setSubs([]);
      } finally {
        setLoad(false);
      }
    }
    load();
  }, [school, klass, subject, slug]);

  const chapterTitle = slug.replace(/^Chapter-/, "").replace(/-/g, " ");

  return (
    <main className="chap-root">
      <div className="chap-wrap">
        {/* Back link */}
        <div className="chap-back">
          <Link
            href={`/student/subject/${encodeURIComponent(subject)}`}
            className="chap-backLink"
          >
            <span className="arrow">←</span> Back to Study Catalog
          </Link>
        </div>

        {/* Hero */}
        <header className="chap-hero">
          <h1 className="chap-title">{chapterTitle}</h1>
          <p className="chap-sub">How to study this chapter</p>
        </header>

        {/* Card Shell */}
        <section className="chap-card">
          <h2 className="section-title">Study Approach</h2>

          {/* Study pill */}
          <div className="study-pill">
            {loading ? (
              <span className="muted">Loading…</span>
            ) : err ? (
              <span className="error">{err}</span>
            ) : (
              <p className="study-text">
                {study?.trim()
                  ? study
                  : "Start by understanding the fundamental concepts, then practice with examples, and finally test your knowledge with quizzes. Focus on one subtopic at a time for better retention."}
              </p>
            )}
          </div>

          <h3 className="section-title" style={{ marginTop: 22 }}>Subtopics</h3>

          {/* Subtopic Grid */}
          {loading ? (
            <div className="muted">Loading…</div>
          ) : subs.length === 0 ? (
            <div className="muted">No subtopics found.</div>
          ) : (
            <div className="sub-grid">
              {subs.map((s) => (
                <Link
                  key={s.sub}
                  href={`/student/chapter/${encodeURIComponent(slug)}/subtopic/${encodeURIComponent(s.sub)}`}
                  className="sub-card"
                >
                  <div className="sub-title">{s.title}</div>
                  <div className="sub-desc">Click to access notes and quiz</div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
