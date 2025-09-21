// FILE: src/types/content.ts
// WHY: Shared shapes for metadata files we write/read, so code remains self-documenting.

export type ChapterMeta = {
  // WHY: Minimal fields to render cards in the UI and track lifecycle
  title: string;            // e.g., "Chapter 01: Motion"
  summary?: string;         // e.g., "Basics of motion and inertia"
  status: "Draft" | "Published";
  version: string;          // e.g., "v1"
  createdAt: string;        // ISO timestamp
  updatedAt: string;        // ISO timestamp
};

export type SubtopicsFile = string[]; // WHY: Ordered list like ["Inertia", "Newton’s First Law", ...]
