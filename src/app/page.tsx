// FILE: src/app/page.tsx
// Exact landing to match your screenshot.

"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="landing">
      {/* Background blobs */}
      <div className="landing__blobs" aria-hidden="true">
        <div className="landing__blob landing__blob--left" />
        <div className="landing__blob landing__blob--right" />
      </div>

      <div className="landing__container">
        {/* Heading */}
        <h1 className="landing__title">Prep AI</h1>
        <p className="landing__subtitle">
          Intelligent learning platform powered by artificial<br className="hidden md:inline" />
          intelligence
        </p>

        {/* Tiles */}
        <div className="landing__tiles">
          {/* Student */}
          <Link href="/onboarding" className="tile" aria-label="Open Student">
            <div className="tile__icon tile__icon--blue">
              <svg
                viewBox="0 0 24 24"
                className="tile__iconSvg tile__iconSvg--blue"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 10 12 6 2 10l10 4 10-4Z" />
                <path d="M6 12v5c0 1 4 3 6 3s6-2 6-3v-5" />
              </svg>
            </div>

            <h2 className="tile__title">Student</h2>
            <p className="tile__copy">
              Access your personalized learning<br />
              dashboard, practice tests, and AI-<br />
              powered study recommendations
            </p>
          </Link>

          {/* Admin */}
          <Link href="/admin" className="tile" aria-label="Open Admin">
            <div className="tile__icon tile__icon--purple">
              <svg
                viewBox="0 0 24 24"
                className="tile__iconSvg tile__iconSvg--purple"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3 5 6v6c0 5 3.5 7.5 7 9 3.5-1.5 7-4 7-9V6l-7-3Z" />
              </svg>
            </div>

            <h2 className="tile__title">Admin</h2>
            <p className="tile__copy">
              Manage users, content, analytics, and<br />
              system settings with comprehensive<br />
              administrative tools
            </p>
          </Link>
        </div>

        {/* Footer */}
        <p className="landing__footer">
          © {new Date().getFullYear()} Prep AI. Empowering education through artificial intelligence.
        </p>
      </div>
    </main>
  );
}
