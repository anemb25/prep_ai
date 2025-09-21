// FILE: src/lib/slug.ts
// WHY: We need reliable, filesystem-safe slugs for chapter and subtopic folder names.

export function slugify(input: string): string {
  // WHY: Lowercase for consistency across OSes
  return input
    .toLowerCase() // WHY: Avoid case-sensitive path issues
    .replace(/[^a-z0-9\s-]/g, "") // WHY: Remove special characters that break paths
    .trim() // WHY: Remove accidental leading/trailing spaces
    .replace(/\s+/g, "-"); // WHY: Convert spaces to hyphens (URL/file friendly)
}
