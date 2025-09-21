// FILE: src/app/student/onboarding/page.tsx
// WHY: First-time student setup to capture City, School, and Class.

"use client"; // WHY: We need client interactivity for form controls and navigation

import { useRouter } from "next/navigation"; // WHY: Navigate to /student/home after submit
import { useState } from "react";            // WHY: Manage form state locally

export default function StudentOnboardingPage() {
  // WHY: Local states for the three required fields
  const [city, setCity] = useState("");
  const [school, setSchool] = useState("");
  const [klass, setKlass] = useState("9"); // WHY: Default to Class 9 per your scope
  const router = useRouter();

  // WHY: When user submits, we could save to localStorage for demo; in real app, save to DB
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();                       // WHY: Prevent page reload
    localStorage.setItem("prep.city", city);  // WHY: Persist small bits for demo
    localStorage.setItem("prep.school", school);
    localStorage.setItem("prep.class", klass);
    router.push("/student/home");             // WHY: Go to the main student hub
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4">
      {/* WHY: Centered narrow form with vertical spacing */}
      <h1 className="text-2xl font-semibold">Student Onboarding</h1>
      <p className="text-slate-400">
        Select your City, School, and Class to personalize your study space.
      </p>

      <label className="block">
        {/* WHY: City input */}
        <span className="mb-1 block text-sm text-slate-300">City</span>
        <input
          className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2"
          placeholder="e.g., Hyderabad"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </label>

      <label className="block">
        {/* WHY: School input */}
        <span className="mb-1 block text-sm text-slate-300">School</span>
        <input
          className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2"
          placeholder="e.g., Geetanjali School"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
        />
      </label>

      <label className="block">
        {/* WHY: Class dropdown (we keep Class 9 default per MVP) */}
        <span className="mb-1 block text-sm text-slate-300">Class</span>
        <select
          className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2"
          value={klass}
          onChange={(e) => setKlass(e.target.value)}
        >
          {/* WHY: You scope 6–9; we include them to future-proof the demo */}
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
        </select>
      </label>

      <button
        type="submit"
        className="w-full rounded-lg bg-indigo-600 p-2 font-medium hover:bg-indigo-500"
      >
        Continue to Home
      </button>
    </form>
  );
}
