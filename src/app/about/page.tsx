import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 prose prose-slate">
      <h1 className="text-3xl font-bold">About Flatmate Matcher</h1>
      <p className="text-slate-600 mt-4">
        Flatmate Matcher pairs UK university students with compatible flatmates based on the
        things that actually matter day-to-day — sleep schedules, cleanliness, noise tolerance,
        guests, study habits, and budget.
      </p>
      <h2 className="text-xl font-semibold mt-8">How matching works</h2>
      <p className="text-slate-600 mt-2">
        Each user takes a 10-question quiz. We score every pair across 10 weighted dimensions and
        rank matches by a 0–100 compatibility percentage. The algorithm is open-source — see{" "}
        <a href="https://github.com/pakhomchik2008/flatmate-matcher/blob/main/src/lib/matching.ts" className="text-brand">src/lib/matching.ts</a>.
      </p>
      <h2 className="text-xl font-semibold mt-8">Built with</h2>
      <ul className="text-slate-600 list-disc pl-5 mt-2 space-y-1">
        <li>Next.js 14 (App Router) + TypeScript</li>
        <li>Supabase — Postgres, Auth, Realtime, Storage</li>
        <li>Tailwind CSS</li>
        <li>Deployed on Vercel</li>
      </ul>
      <p className="text-slate-600 mt-8">
        <Link href="/demo" className="text-brand font-medium">Try the demo →</Link>
      </p>
    </div>
  );
}
