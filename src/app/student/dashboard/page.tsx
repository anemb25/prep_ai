"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./dashboard.css";

type Stats = {
  testsTaken: number;
  studyHours: number;
  chaptersDone: number;
  progressPct: number; // 0–100
};

export default function StudentDashboard() {
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [klass, setKlass] = useState("");
  const [stats, setStats] = useState<Stats>({
    testsTaken: 0,
    studyHours: 0,
    chaptersDone: 0,
    progressPct: 0,
  });

  useEffect(() => {
    // Pull demo context from onboarding/localStorage
    setName(localStorage.getItem("prep.name") || "Student");
    setSchool(localStorage.getItem("prep.school") || "Geetanjali High School");
    setKlass(localStorage.getItem("prep.class") || "9");

    // If you later track stats, read them here (fallback to zeros for the demo)
    const s: Stats = {
      testsTaken: Number(localStorage.getItem("stats.testsTaken") || 0),
      studyHours: Number(localStorage.getItem("stats.studyHours") || 0),
      chaptersDone: Number(localStorage.getItem("stats.chaptersDone") || 0),
      progressPct: Number(localStorage.getItem("stats.progressPct") || 0),
    };
    setStats(s);
  }, []);

  const progressLabel =
    stats.progressPct <= 0 ? "Getting Started" :
    stats.progressPct < 40 ? "Warming Up" :
    stats.progressPct < 80 ? "Making Progress" : "Almost There";

  return (
    <main className="dash-root">
      <div className="dash-wrap">
        {/* Back */}
        <div className="backRow">
          <Link href="/student" className="backLink">
            <span className="arrow">←</span> Back to Student Portal
          </Link>
        </div>

        {/* Hero */}
        <header className="hero">
          <h1 className="heroTitle">Dashboard</h1>
        </header>

        {/* Welcome + quick info tiles */}
        <section className="panel">
          <h2 className="welcome">Welcome back, {name}!</h2>

          <div className="infoGrid">
            <div className="infoCard soft-blue">
              <div className="infoLabel">School</div>
              <div className="infoValue linky">{school}</div>
            </div>

            <div className="infoCard soft-purple">
              <div className="infoLabel">Class</div>
              <div className="infoValue">{klass}</div>
            </div>

            <div className="infoCard soft-green">
              <div className="infoLabel">Progress</div>
              <div className="infoValue green">{progressLabel}</div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="panel">
          <h3 className="sectionTitle">Quick Stats</h3>

          <div className="statsRow">
            <div className="stat">
              <div className="statNumber blue">{stats.testsTaken}</div>
              <div className="statLabel">Tests Taken</div>
            </div>

            <div className="stat">
              <div className="statNumber purple">{stats.studyHours}</div>
              <div className="statLabel">Study Hours</div>
            </div>

            <div className="stat">
              <div className="statNumber green">{stats.chaptersDone}</div>
              <div className="statLabel">Chapters Completed</div>
            </div>

            <div className="stat">
              <div className="statNumber orange">
                {Math.round(stats.progressPct)}%
              </div>
              <div className="statLabel">Overall Progress</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
