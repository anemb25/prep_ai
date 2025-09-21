// SUBTOPIC PAGE — Notes (top) and Quiz (bottom) with refined UI.
// Works with: /api/student/get-subtopic?school&klass&subject&chapter&sub
"use client";

import { use as unwrap } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import "./subtopic.css";

// ---------- Types ----------
type QuizQ = {
  id?: string | number;
  question: string;
  options: string[];
  answer?: number; // 0-based correct index (if present)
  explanation?: string;
};

// ---------- Tiny Markdown helper (headings, bold/italic, bullets, paragraphs) ----------
function mdToHtml(md: string): string {
  let html = md;

  // escape basic HTML
  html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // headings ##, ###, ####
  html = html.replace(/^####\s+(.*)$/gm, "<h4>$1</h4>");
  html = html.replace(/^###\s+(.*)$/gm, "<h3>$1</h3>");
  html = html.replace(/^##\s+(.*)$/gm, "<h2>$1</h2>");
  html = html.replace(/^#\s+(.*)$/gm, "<h1>$1</h1>");

  // bold **text**
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // italic *text*
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // code `inline`
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // unordered lists (- item / * item)
  // Convert consecutive bullet lines into a single <ul>
  html = html.replace(
    /(^|\n)(?:[-*]\s+[^\n]+(\n|$))+?/g,
    (block) => {
      const items = block
        .trim()
        .split("\n")
        .map((l) => l.replace(/^[-*]\s+/, "").trim())
        .filter(Boolean)
        .map((li) => `<li>${li}</li>`)
        .join("");
      return `\n<ul>${items}</ul>\n`;
    }
  );

  // paragraphs (simple)
  html = html
    .split(/\n{2,}/)
    .map((chunk) => {
      const trimmed = chunk.trim();
      if (!trimmed) return "";
      if (/^<h[1-4]>/.test(trimmed) || /^<ul>/.test(trimmed)) return trimmed;
      return `<p>${trimmed.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");

  return html;
}

// ---------- Component ----------
export default function SubtopicPage(
  props: { params: Promise<{ slug: string; sub: string }> }
) {
  const { slug, sub } = unwrap(props.params);           // chapter folder, subtopic folder

  // Context (from onboarding)
  const [school, setSchool] = useState("");
  const [klass, setKlass]   = useState("");
  const [subject, setSubj]  = useState("");

  // Data
  const [notes, setNotes]   = useState("");
  const [quiz, setQuiz]     = useState<QuizQ[]>([]);
  const [loading, setLoad]  = useState(true);
  const [err, setErr]       = useState<string | null>(null);

  // Quiz state
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [checked, setChecked] = useState(false);
  const [score, setScore]     = useState<number | null>(null);

  // Titles
  const chapterTitle = useMemo(() => slug.replace(/^Chapter-/, "").replace(/-/g, " "), [slug]);
  const subTitle     = useMemo(() => sub.replace(/^\d+-/, "").replace(/-/g, " "), [sub]);

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
        const qs = new URLSearchParams({
          school, klass, subject,
          chapter: slug, sub
        });
        const res = await fetch(`/api/student/get-subtopic?${qs}`, { cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data?.error || "Failed to load subtopic");
        setNotes(data.notes || "");
        setQuiz(Array.isArray(data.quiz) ? data.quiz : []);
        // reset quiz UI
        setAnswers({});
        setChecked(false);
        setScore(null);
      } catch (e:any) {
        setErr(e.message || "Error");
        setNotes("");
        setQuiz([]);
      } finally {
        setLoad(false);
      }
    }
    load();
  }, [school, klass, subject, slug, sub]);

  function selectAnswer(qIdx: number, optIdx: number) {
    if (checked) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  }

  function checkAnswers() {
    let correct = 0;
    quiz.forEach((q, i) => {
      const picked = answers[i];
      if (typeof q.answer === "number" && picked === q.answer) correct++;
    });
    setScore(correct);
    setChecked(true);
  }

  function resetQuiz() {
    setAnswers({});
    setChecked(false);
    setScore(null);
  }

  const notesHtml = useMemo(() => mdToHtml(notes || ""), [notes]);

  return (
    <main className="subp-root">
      <div className="subp-wrap">
        {/* Back row */}
        <div className="subp-back">
          <Link
            href={`/student/chapter/${encodeURIComponent(slug)}`}
            className="backLink"
          >
            <span className="arrow">←</span> Back to {chapterTitle}
          </Link>
        </div>

        {/* Hero */}
        <header className="subp-hero">
          <h1 className="subp-title">{subTitle}</h1>
          <p className="subp-sub">Study notes and test your knowledge</p>
        </header>

        {/* NOTES CARD */}
        <section className="panel">
          <div className="panel-head">
            <div className="iconBadge">📝</div>
            <h2 className="panel-title">Notes</h2>
          </div>

          {/* Optional info callout (shows automatically if your notes start with a heading) */}
          {/* You can delete this block if you don't want a preface tip. */}
          <div className="info-callout">
            <div className="info-title">Key Concepts</div>
            <p className="info-text">
              This section covers the core ideas for <strong>{subTitle}</strong>. Review them first, then
              move to the quiz below.
            </p>
          </div>

          <article
            className="md-body"
            // Rendering our lightweight Markdown result
            dangerouslySetInnerHTML={{ __html: notesHtml }}
          />

          <div className="tip-callout">
            <strong>Study Tip:</strong> Read the notes thoroughly, revisit definitions and formulas,
            and then attempt the quiz below.
          </div>
        </section>

        {/* QUIZ CARD */}
        <section className="panel">
          <div className="panel-head">
            <div className="iconBadge purple">❓</div>
            <h2 className="panel-title">Quiz</h2>
          </div>

          <div className="quiz-callout">
            <div className="quiz-title">Test Your Knowledge</div>
            <p className="quiz-text">
              Complete this quiz to assess your understanding. Make sure you've read the notes above before starting.
            </p>
          </div>

          {loading ? (
            <div className="muted">Loading…</div>
          ) : quiz.length === 0 ? (
            <div className="muted">No quiz found for this subtopic.</div>
          ) : (
            <div className="q-list">
              {quiz.map((q, qi) => {
                const picked = answers[qi] ?? null;
                const correctIdx = typeof q.answer === "number" ? q.answer : null;

                return (
                  <div key={qi} className="q-card">
                    <div className="q-label">Question {qi + 1}:</div>
                    <div className="q-text">{q.question}</div>

                    <div className="opt-list">
                      {q.options.map((opt, oi) => {
                        const chosen = picked === oi;
                        const isCorrect = checked && correctIdx === oi;
                        const isWrong = checked && chosen && correctIdx !== oi;

                        return (
                          <label
                            key={oi}
                            className={[
                              "opt",
                              chosen ? "opt-selected" : "",
                              isCorrect ? "opt-correct" : "",
                              isWrong ? "opt-wrong" : "",
                            ].join(" ")}
                          >
                            <input
                              type="radio"
                              name={`q-${qi}`}
                              checked={chosen || false}
                              disabled={checked}
                              onChange={() => selectAnswer(qi, oi)}
                            />
                            <span className="opt-bullet" />
                            <span className="opt-text">{opt}</span>
                          </label>
                        );
                      })}
                    </div>

                    {checked && typeof correctIdx === "number" && q.explanation && (
                      <div className="explain">
                        <strong>Explanation: </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Actions */}
          {quiz.length > 0 && (
            <div className="quiz-actions">
              {!checked ? (
                <button className="btn primary" onClick={checkAnswers} disabled={loading}>
                  Check Answers
                </button>
              ) : (
                <>
                  <div className="score">
                    Score: <strong>{score}</strong> / {quiz.length}
                  </div>
                  <button className="btn" onClick={resetQuiz}>Try Again</button>
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
