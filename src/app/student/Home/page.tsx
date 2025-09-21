// FILE: src/app/student/home/page.tsx
// WHY: The student's central hub with three big tiles: Planner, Dashboard, Catalog.

"use client"; // WHY: Client-side navigation on card clicks

import { useRouter } from "next/navigation"; // WHY: Navigate into subsections
import Card from "@/components/Card";         // WHY: Consistent visual tiles

export default function StudentHomePage() {
  const router = useRouter(); // WHY: Hook for navigation

  return (
    <div className="space-y-6">
      {/* WHY: Page heading and context chips */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Welcome to Prep AI</h1>
        <p className="text-slate-400">
          Plan your studies, view progress, or open your catalog.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {/* WHY: Three main navigation cards */}

        <Card
          title="AI Study Planner"
          subtitle="Enter exam date; get a daily plan with notes & quizzes."
          icon={<span>🗓️</span>}
          onClick={() => router.push("/student/planner")}
        />

        <Card
          title="Dashboard"
          subtitle="See quizzes attempted, accuracy, and what to revise."
          icon={<span>📊</span>}
          onClick={() => router.push("/student/dashboard")}
        />

        <Card
          title="Study Catalog"
          subtitle="Browse subjects → chapters → subtopics → notes & quizzes."
          icon={<span>📚</span>}
          onClick={() => router.push("/student/catalog")}
        />
      </div>
    </div>
  );
}
