// FILE: src/lib/progress.ts
// WHY: Centralize how we read/write quiz progress so Dashboard (and others) can reuse.
// STORAGE SCHEMA (per subtopic):
//   key:   prep.progress/<school>/<klass>/<subject>/<chapter>/<subtopic>
//   value: {"attempts":[{"date":"2025-01-01T10:00:00Z","score":80,"wrong":["q2","q4"]}]}

export type Attempt = { date: string; score: number; wrong?: string[] };
export type ProgressRecord = { attempts: Attempt[] };

export function progressKey(
  school: string,
  klass: string,
  subject: string,
  chapter: string,
  subtopic: string
) {
  return `prep.progress/${school}/${klass}/${subject}/${chapter}/${subtopic}`;
}

// Call this from your quiz submit handler:
export function saveAttempt(
  school: string,
  klass: string,
  subject: string,
  chapter: string,
  subtopic: string,
  attempt: Attempt
) {
  const key = progressKey(school, klass, subject, chapter, subtopic);
  const prev = safeParse<ProgressRecord>(localStorage.getItem(key)) || { attempts: [] };
  prev.attempts.push(attempt);
  localStorage.setItem(key, JSON.stringify(prev));
}

// Read ALL progress entries
export function loadAllProgress() {
  const out: {
    key: string;
    school: string; klass: string; subject: string; chapter: string; subtopic: string;
    attempts: Attempt[];
  }[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i) || "";
    if (!k.startsWith("prep.progress/")) continue;
    const parts = k.split("/");
    if (parts.length < 6) continue;
    const [, school, klass, subject, chapter, subtopic] = parts;
    const raw = localStorage.getItem(k);
    const rec = safeParse<ProgressRecord>(raw);
    if (!rec || !Array.isArray(rec.attempts)) continue;
    out.push({ key: k, school, klass, subject, chapter, subtopic, attempts: rec.attempts });
  }
  return out;
}

// Aggregate helpful stats for UI
export function aggregate(entries: ReturnType<typeof loadAllProgress>) {
  const allAttempts = entries.flatMap(e => e.attempts.map(a => ({ ...a, _k: e.key, chapter: e.chapter, subtopic: e.subtopic })));
  const totalAttempts = allAttempts.length;
  const overallAvg = totalAttempts ? Math.round(allAttempts.reduce((s, a) => s + a.score, 0) / totalAttempts) : 0;

  const bySub: Record<string, { label: string; attempts: Attempt[]; avg: number; last?: Attempt; chapter: string }> = {};
  const byChapter: Record<string, { label: string; attempts: Attempt[]; avg: number; last?: Attempt }> = {};

  for (const e of entries) {
    const labelSub = `${e.chapter} › ${e.subtopic}`;
    bySub[e.key] = bySub[e.key] || { label: labelSub, attempts: [], avg: 0, chapter: e.chapter };
    bySub[e.key].attempts.push(...e.attempts);
    const chapKey = e.chapter;
    byChapter[chapKey] = byChapter[chapKey] || { label: e.chapter, attempts: [], avg: 0 };
    byChapter[chapKey].attempts.push(...e.attempts);
  }

  for (const k of Object.keys(bySub)) {
    const arr = bySub[k].attempts;
    arr.sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime());
    bySub[k].last = arr[0];
    bySub[k].avg = Math.round(arr.reduce((s,a)=>s+a.score,0)/arr.length);
  }
  for (const k of Object.keys(byChapter)) {
    const arr = byChapter[k].attempts;
    arr.sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime());
    byChapter[k].last = arr[0];
    byChapter[k].avg = Math.round(arr.reduce((s,a)=>s+a.score,0)/arr.length);
  }

  const weak = Object.values(bySub)
    .map(s => ({
      label: humanizePair(s.label),
      avg: s.avg,
    }))
    .filter(s => s.avg < 70)
    .sort((a,b)=>a.avg-b.avg)
    .slice(0, 8);

  const recent = allAttempts
    .sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime())
    .slice(0, 8)
    .map(a => ({ when: a.date, score: a.score }));

  const chapters = Object.entries(byChapter)
    .map(([slug, o]) => ({
      slug,
      name: humanizeChapter(slug),
      avg: o.avg,
      attempts: o.attempts.length,
      lastWhen: o.last?.date
    }))
    .sort((a,b)=>a.name.localeCompare(b.name));

  return { totalAttempts, overallAvg, weak, recent, chapters };
}

function safeParse<T>(raw: string | null): T | null {
  try { return raw ? (JSON.parse(raw) as T) : null; } catch { return null; }
}

function humanizeChapter(ch: string) {
  return ch.replace(/^Chapter-/, "").replace(/-/g," ");
}

function humanizePair(label: string) {
  // "Chapter-foo-bar › 01-baz" → "foo bar › baz"
  const [chapter, sub] = label.split(" › ");
  const niceCh = chapter.replace(/^Chapter-/, "").replace(/-/g," ");
  const niceSub = sub.replace(/^\d+-/,"").replace(/-/g," ");
  return `${niceCh} › ${niceSub}`;
}
