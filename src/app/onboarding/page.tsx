// FILE: src/app/onboarding/page.tsx
// WHY: Student onboarding with a dedicated CSS file for pixel control.

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./onboarding.css"; // ← important

export default function OnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [school, setSchool] = useState("Geetanjali High School (Demo)");
  const [klass, setKlass] = useState("9 (Demo)");

  const canSubmit = name.trim().length > 0;

  useEffect(() => {
    const n = localStorage.getItem("prep.name");
    const s = localStorage.getItem("prep.school");
    const k = localStorage.getItem("prep.class");
    if (n) setName(n);
    if (s) setSchool(`${s} (Demo)`);
    if (k) setKlass(`${k} (Demo)`);
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    // Save demo context (strip “(Demo)” for app usage)
    localStorage.setItem("prep.name", name.trim());
    localStorage.setItem("prep.school", "Geetanjali High School");
    localStorage.setItem("prep.class", "9");
    router.push("/student");
  }

  return (
    <main className="onb-page">
      {/* soft gradient blobs */}
      <div className="onb-blob onb-blob--left" />
      <div className="onb-blob onb-blob--right" />

      <div className="onb-wrap">
        {/* Back link */}
        <div className="onb-back">
          <Link href="/" className="onb-back-link">
            <IconArrowLeft /> Back to Home
          </Link>
        </div>

        {/* Heading */}
        <h1 className="onb-title">Welcome, Student!</h1>
        <p className="onb-subtitle">Let’s get you set up for your learning journey</p>

        {/* Card */}
        <form onSubmit={onSubmit} className="onb-card">
          {/* Name */}
          <div className="onb-field">
            <label className="onb-label">
              <IconUser />
              <span>Your Name</span>
              <span className="onb-required-dot" />
            </label>
            <input
              type="text"
              className="onb-input"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* School (single-option dropdown) */}
          <div className="onb-field">
            <label className="onb-label">
              <IconSchool />
              <span>School</span>
            </label>
            <div className="onb-select-wrap">
              <select
                className="onb-select"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
              >
                <option>Geetanjali High School (Demo)</option>
              </select>
              <IconChevronDown className="onb-select-caret" />
            </div>
            <div className="onb-hint">Only one school is available in this demo.</div>
          </div>

          {/* Class (single-option dropdown) */}
          <div className="onb-field">
            <label className="onb-label">
              <IconCap />
              <span>Class</span>
            </label>
            <div className="onb-select-wrap">
              <select
                className="onb-select"
                value={klass}
                onChange={(e) => setKlass(e.target.value)}
              >
                <option>9 (Demo)</option>
              </select>
              <IconChevronDown className="onb-select-caret" />
            </div>
            <div className="onb-hint">Only Class 9 is available in this demo.</div>
          </div>

          {/* Footer */}
          <div className="onb-actions">
            <button
              type="submit"
              className={`onb-btn ${canSubmit ? "onb-btn--primary" : "onb-btn--disabled"}`}
              disabled={!canSubmit}
              aria-disabled={!canSubmit}
            >
              Enter <IconArrowRight />
            </button>
            <div className="onb-footnote">
              Demo note: only one school and one class are available in this preview.
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

/* ---------------- Icons (fixed size; cannot stretch) ---------------- */
const ICON = 16;

function IconArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={ICON} height={ICON} className="onb-ico" {...props}>
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        d="M10 19l-7-7 7-7M3 12h18" />
    </svg>
  );
}
function IconArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={ICON} height={ICON} className="onb-ico" {...props}>
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        d="M14 5l7 7-7 7M3 12h18" />
    </svg>
  );
}
function IconChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} className="onb-ico" {...props}>
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        d="M6 9l6 6 6-6" />
    </svg>
  );
}
function IconUser(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={ICON} height={ICON} className="onb-ico onb-ico--muted" {...props}>
      <circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M5.5 21a8.5 8.5 0 0 1 13 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconSchool(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={ICON} height={ICON} className="onb-ico onb-ico--muted" {...props}>
      <path d="M3 10l9-5 9 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 22V12" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function IconCap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={ICON} height={ICON} className="onb-ico onb-ico--muted" {...props}>
      <path d="M22 10l-10-5L2 10l10 5 10-5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
