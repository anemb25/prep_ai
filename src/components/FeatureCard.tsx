// FILE: src/components/FeatureCard.tsx
// WHY: Premium clickable card with icon badge and gradient ring for primary actions.

import React, { ReactNode } from "react";

type Props = {
  title: string;            // WHY: Card heading
  subtitle: string;         // WHY: Supporting description
  icon: ReactNode;          // WHY: Visual anchor (emoji/SVG)
  onClick: () => void;      // WHY: Navigates to target route
  accent?: "primary" | "success"; // WHY: Optional accent color variant
};

export default function FeatureCard({
  title,
  subtitle,
  icon,
  onClick,
  accent = "primary",
}: Props) {
  // WHY: Choose gradient ring based on accent for visual variety
  const ring =
    accent === "success"
      ? "from-emerald-400/60 to-emerald-500/10"
      : "from-indigo-400/60 to-indigo-500/10";

  return (
    <button
      onClick={onClick}
      className="group relative w-full rounded-3xl p-[1px] transition"
      /* WHY: Outer wrapper uses 1px padding to host a gradient ring */
    >
      <div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${ring} opacity-60 blur-sm transition group-hover:opacity-100`}
        /* WHY: Soft blurred gradient ring that brightens on hover */
      />
      <div className="relative rounded-3xl border border-white/10 bg-[var(--brand-card)]/90 p-6 text-left shadow-xl ring-1 ring-black/10 transition group-hover:-translate-y-0.5 group-hover:shadow-2xl">
        {/* WHY: Inner card surface with subtle elevation and hover lift */}
        <div className="mb-4 flex items-center gap-3">
          {/* WHY: Icon badge */}
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-2xl">
            {icon}
          </span>
          <h3 className="text-xl font-semibold leading-tight">{title}</h3>
        </div>
        <p className="text-sm leading-6 text-[var(--brand-muted)]">{subtitle}</p>
      </div>
    </button>
  );
}
