"use client";

import Link from "next/link";
import "./planner.css";

export default function AIPlannerLanding() {
  return (
    <main className="plan-root">
      <div className="plan-wrap">

        {/* Top ribbon */}
        <div className="ribbon" role="note">
          Coming Soon – Get Early Access!
        </div>

        {/* Card shell */}
        <section className="shell">
          {/* Header */}
          <header className="head">
            <h1 className="brand">
              <span className="logoWord">Prep</span>
              <span className="logoWord sky">AI</span>
              <span className="sp" />
              <span className="title">Study Planner</span>
            </h1>
            <p className="tagline">
              Smart AI-powered study schedules designed for your success.
            </p>
          </header>

          {/* LAYOUT: left = 3 mini tiles in a single row; right = tall rectangle */}
          <div className="layout">
            {/* LEFT: three compact tiles */}
            <div className="miniRow">
              <div className="miniTile">
                <div className="miniIcon">⚙️</div>
                <div className="miniTitle">Smart Planning</div>
                <div className="miniText">Topic-ordered plans based on your goals.</div>
              </div>

              <div className="miniTile">
                <div className="miniIcon">📅</div>
                <div className="miniTitle">Scheduling</div>
                <div className="miniText">Balanced sessions with quick quizzes.</div>
              </div>

              <div className="miniTile">
                <div className="miniIcon">📈</div>
                <div className="miniTitle">Progress Tracking</div>
                <div className="miniText">Live tracking with spaced revision.</div>
              </div>

              <button className="cta small" disabled>
                Generate My Plan (Coming)
              </button>

              <Link href="/student" className="backLink">
                Back to Student Home
              </Link>
            </div>

            {/* RIGHT: vertical rectangle (what’s arriving) */}
            <aside className="tallPanel">
              <div className="tallTitle">What’s arriving here</div>
              <ul className="tallList">
                <li>
                  <span className="bullet">🧭</span>
                  Pick chapters & subtopics → get a clear, ordered plan (with dates).
                  Quiz → review mistakes.
                </li>
                <li>
                  <span className="bullet">🔄</span>
                  Live progress sync with your Dashboard & weak-topic suggestions.
                </li>
              </ul>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
