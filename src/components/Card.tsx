// FILE: src/components/Card.tsx
// WHY: A simple reusable Card component to keep a consistent, modern look.

import React, { ReactNode } from "react"; // WHY: Types for children

type Props = {
  title: string;          // WHY: Card heading text
  subtitle?: string;      // WHY: Optional supporting text under the title
  onClick?: () => void;   // WHY: Make cards clickable for navigation
  icon?: ReactNode;       // WHY: Optional icon to visually identify the card
  children?: ReactNode;   // WHY: Content inside the card (optional)
};

export default function Card({ title, subtitle, onClick, icon, children }: Props) {
  // WHY: We wrap the whole card in a button if onClick exists to make it accessible.
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      onClick={onClick}
      className="w-full rounded-2xl border border-slate-800 bg-[var(--brand-card)] p-5 text-left shadow-md transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      /* WHY: Rounded corners for modern feel; border for separation; hover/focus states for UX */
    >
      <div className="mb-3 flex items-center gap-3">
        {/* WHY: Top row with optional icon and title */}
        {icon && <div className="text-2xl">{icon}</div>}
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      {subtitle && <p className="mb-4 text-sm text-slate-400">{subtitle}</p>}
      {/* WHY: Subtitle helps the user understand the card purpose */}
      {children}
      {/* WHY: Allow inserting custom content like progress rings later */}
    </Wrapper>
  );
}
