// FILE: src/app/layout.tsx
// WHY: Global layout for all routes; we mount the Header once and wrap page content.

import type { Metadata } from "next";            // WHY: Type for SEO metadata
import "./globals.css";                          // WHY: Bring in our Tailwind + global styles
import Header from "@/components/Header";        // WHY: Shared header across pages

export const metadata: Metadata = {
  // WHY: Basic SEO and app info
  title: "Prep AI",
  description: "Student learning add-on for Uprio — study plans, notes, and quizzes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // WHY: The nested page content
}) {
  return (
    <html lang="en">
      {/* WHY: English locale; required HTML boilerplate */}
      <body className="min-h-screen">
        {/* WHY: Ensure full-height body to keep footer at bottom if needed */}
        <Header />
        {/* WHY: Persistent top navigation */}
        <main className="mx-auto max-w-6xl px-4 py-6">
          {/* WHY: Central content container with breathing space */}
          {children}
        </main>
      </body>
    </html>
  );
}
