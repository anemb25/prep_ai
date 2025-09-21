// CATALOG (SUBJECT SELECTOR) — three centered tiles; only Physical Science is enabled.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./catalog.css";

export default function CatalogPage() {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("prep.name") || "");
    // lock demo context so chapters load without extra clicks
    localStorage.setItem("prep.school", "Geetanjali High School");
    localStorage.setItem("prep.class", "9");
  }, []);

  return (
    <main className="subs-root">
      <div className="subs-wrap">
        {/* Back */}
        <div className="subs-back">
          <Link href="/student" className="backLink">
            <span className="arrow">←</span> Back to Home
          </Link>
        </div>

        {/* Hero */}
        <header className="subs-hero">
          <h1 className="subs-title">Student Portal</h1>
          <p className="subs-sub">
            {name ? `Welcome back, ${name}. ` : ""}Choose a subject to begin.
            <span className="hint"> (For this demo, only Physical Science is active.)</span>
          </p>
        </header>

        {/* Tiles */}
        <div className="subs-grid">
          {/* Physical Science (enabled) */}
          <Link
            href={`/student/subject/${encodeURIComponent("Physical Science")}`}
            className="tile tile-enabled"
            onClick={() => localStorage.setItem("prep.subject", "Physical Science")}
          >
            <div className="tile-badge bg-green">📘</div>
            <div className="tile-title">Physical Science</div>
            <div className="tile-desc">Physics & Chemistry basics with notes and quizzes</div>
            <div className="tile-cta">Enter →</div>
          </Link>

          {/* Biological Science (disabled) */}
          <div className="tile tile-disabled" aria-disabled>
            <div className="tile-badge bg-teal">🧬</div>
            <div className="tile-title">Biological Science</div>
            <div className="tile-desc">Coming soon</div>
            <div className="badge-muted">Soon</div>
          </div>

          {/* Mathematics (disabled) */}
          <div className="tile tile-disabled" aria-disabled>
            <div className="tile-badge bg-indigo">➗</div>
            <div className="tile-title">Mathematics</div>
            <div className="tile-desc">Coming soon</div>
            <div className="badge-muted">Soon</div>
          </div>
        </div>
      </div>
    </main>
  );
}
