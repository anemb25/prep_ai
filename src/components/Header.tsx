// FILE: src/components/Header.tsx
// WHY: Shared top header that anchors brand identity with minimal chrome.

import React from "react"; // WHY: We build a React functional component

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-md"
      /* WHY: Sticky keeps header visible; translucent + blur = modern glass effect */
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        {/* WHY: Constrain width for balance; padding for tap targets */}
        <div className="flex items-center gap-2">
          {/* WHY: Temporary logo mark (emoji). Swap with SVG later. */}
          <span className="text-2xl">📘</span>
          <span className="text-lg font-semibold tracking-wide">Prep AI</span>
        </div>

        {/* WHY: Placeholder right-side text; can host login/profile later */}
        <div className="hidden text-sm text-[var(--brand-muted)] sm:block">
          Learning, simplified.
        </div>
      </div>
    </header>
  );
}
