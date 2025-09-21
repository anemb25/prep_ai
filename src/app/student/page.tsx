// FILE: src/app/student/page.tsx
// WHY: Student Portal with 3 centered tiles → Dashboard / Planner / Catalog
// NOTE: Reads name from localStorage ("prep.name") and falls back to "Student".

"use client";

import Link from "next/link";
import { useEffect, useState, type SVGProps, type ComponentType } from "react";
import "./student.css";

export default function StudentPortal() {
  const [name, setName] = useState<string>("Student");

  useEffect(() => {
    const n = localStorage.getItem("prep.name");
    if (n && n.trim()) setName(n.trim());
  }, []);

  return (
    <main className="sp-page">
      {/* soft blobs */}
      <div className="sp-blob sp-blob--left" />
      <div className="sp-blob sp-blob--right" />

      <div className="sp-wrap">
        {/* Back */}
        <div className="sp-back">
          <Link href="/" className="sp-back-link">
            <IconArrowLeft /> Back to Home
          </Link>
        </div>

        {/* Hero */}
        <h1 className="sp-title">Student Portal</h1>
        <p className="sp-subtitle">Welcome back, {name}</p>

        {/* Tiles */}
        <section className="sp-tiles">
          <Tile
            href="/student/dashboard"
            Icon={IconDashboard}
            title="Dashboard"
            copy="View your progress, stats, and personalized learning insights"
          />
          <Tile
            href="/student/planner"
            Icon={IconBrain}
            title="AI Prep Plan"
            copy="Get AI-powered study recommendations tailored to your needs"
          />
          <Tile
            href="/student/catalog"
            Icon={IconBook}
            title="Study Catalog"
            copy="Browse subjects, chapters, and learning materials"
          />
        </section>
      </div>
    </main>
  );
}

/* ---------- Tile component ---------- */
type IconType = ComponentType<SVGProps<SVGSVGElement>>;

function Tile({
  href,
  title,
  copy,
  Icon,
}: {
  href: string;
  title: string;
  copy: string;
  Icon: IconType;
}) {
  return (
    <Link href={href} className="sp-card">
      <div className="sp-card-icon">
        <Icon />
      </div>
      <h3 className="sp-card-title">{title}</h3>
      <p className="sp-card-copy">{copy}</p>
    </Link>
  );
}

/* ---------- Inline icons (fixed size; won’t stretch) ---------- */
const ICON = 44;

function IconArrowLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} className="sp-ico" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 19l-7-7 7-7M3 12h18"
      />
    </svg>
  );
}

function IconDashboard(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={ICON} height={ICON} className="sp-ico sp-ico--blue" {...props}>
      <rect x="3" y="11" width="4" height="8" rx="1" />
      <rect x="10" y="7" width="4" height="12" rx="1" />
      <rect x="17" y="4" width="4" height="15" rx="1" />
    </svg>
  );
}

function IconBrain(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={ICON} height={ICON} className="sp-ico sp-ico--purple" {...props}>
      <path d="M8 8a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3" fill="none" strokeWidth="2" stroke="currentColor" />
      <path
        d="M6 14a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V9a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v5z"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
      />
      <path d="M9 11h2M13 11h2M12 14h2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function IconBook(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={ICON} height={ICON} className="sp-ico sp-ico--green" {...props}>
      <path d="M4 5h8a3 3 0 0 1 3 3v11H7a3 3 0 0 0-3 3V5z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M20 5h-8a3 3 0 0 0-3 3v11" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M9 8h6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
