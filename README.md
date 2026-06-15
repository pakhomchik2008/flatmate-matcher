# Flatmate Matcher

A full-stack web app that pairs UK university students with compatible flatmates based on a 10-question lifestyle quiz. Each match is scored 0–100 by a weighted compatibility algorithm and shown with a per-trait breakdown.

**Live demo:** https://flatmate-matcher.vercel.app
**Guest mode (no sign-up):** https://flatmate-matcher.vercel.app/demo

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Auth + DB | Supabase (Postgres + Row-Level Security) |
| Realtime | Supabase Realtime (postgres_changes) |
| Storage | Supabase Storage (avatars) |
| Hosting | Vercel |
| Tests | Node's built-in test runner (no extra deps) |

---

## System architecture

```
                ┌────────────────────────────┐
                │         Browser            │
                │   (React / Next.js client) │
                └─────────────┬──────────────┘
                              │  HTTPS
                              ▼
                ┌────────────────────────────┐
                │  Next.js Edge Middleware   │
                │  · session refresh         │
                │  · auth gate per route     │
                └─────────────┬──────────────┘
                              │
            ┌─────────────────┼──────────────────┐
            ▼                 ▼                  ▼
   ┌────────────────┐  ┌──────────────┐  ┌────────────────┐
   │ Server Comp.   │  │ Route Handlers│  │ Client Comp.   │
   │ (matches,      │  │ (/auth/callback)│ │ (quiz, msgs)   │
   │  profile/[id]) │  │               │  │                 │
   └────────┬───────┘  └──────┬───────┘  └────────┬───────┘
            │                 │                   │
            └─────────────────┼───────────────────┘
                              ▼
                ┌────────────────────────────┐
                │      Supabase (cloud)      │
                │  ┌──────────────────────┐  │
                │  │  Auth (JWT, cookies) │  │
                │  ├──────────────────────┤  │
                │  │  Postgres + RLS      │  │
                │  │  · profiles          │  │
                │  │  · quiz_answers      │  │
                │  │  · messages          │  │
                │  ├──────────────────────┤  │
                │  │  Realtime (WS)       │  │
                │  ├──────────────────────┤  │
                │  │  Storage (avatars)   │  │
                │  └──────────────────────┘  │
                └────────────────────────────┘

   Matching algorithm runs in-process on the client (src/lib/matching.ts),
   scored against quiz_answers rows fetched from Postgres per request.
```

### Request flow: viewing matches

1. Browser requests `/matches`.
2. Middleware refreshes the Supabase session cookie and asserts the user is signed in.
3. The server component reads the user's own profile + quiz answers, plus all other profiles + their quiz answers (RLS only returns rows the user is allowed to see).
4. Data is handed to a client component that runs `calculateCompatibility` per candidate and sorts the grid.

### Matching algorithm (`src/lib/matching.ts`)

Each of 10 dimensions contributes a normalized 0–1 score:

- **Numeric traits** (sleep, cleanliness, noise, etc.): `1 − |a − b| / 4` — perfect match scores 1.0, opposite ends of the 1–5 scale score 0.
- **Boolean traits** (smoking, pets): exact match → 1, mismatch → 0.

Weighted sum (weights total 1.0; sleep + cleanliness dominate at 20% each), rounded to a 0–100 percentage. See `tests/matching.test.mjs` for property tests (identical → 100, opposite → 0, symmetry, dominance, range).

---

## Getting started locally

```bash
git clone https://github.com/pakhomchik2008/flatmate-matcher.git
cd flatmate-matcher
npm install
cp .env.local.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from your Supabase project
npm run dev
```

Then in your Supabase dashboard:

1. **SQL Editor** → run `schema.sql` (creates tables, RLS policies, avatar bucket).
2. **Authentication → URL Configuration** → add `http://localhost:3000/auth/callback` as a redirect URL.
3. **Database → Replication** → enable Realtime on the `messages` table.

Optional: run `seed.sql` to populate the DB with 1000 fake students across 32 UK universities; `seed-cleanup.sql` removes them.

### Tests

```bash
npm test
```

Runs `tests/matching.test.mjs` against the compatibility scoring engine — 6 unit + property tests covering identity, opposites, symmetry, range, weight dominance, and partial overlap.

---

## Project structure

```
src/
  app/
    page.tsx              ← landing (hero, how-it-works, preview, CTA)
    demo/                 ← guest mode: full quiz + fake matches, no auth
    auth/                 ← signup, login, forgot-password, OAuth callback
    onboarding/           ← 3-step profile + quiz flow
    matches/              ← ranked match grid w/ filters
    messages/             ← realtime inbox + thread
    profile/me            ← editable own profile
    profile/[id]          ← public profile + compatibility breakdown
    about/                ← static about page
  components/             ← Avatar, CompatibilityBadge, ProfileCard, QuizSlider, etc.
  lib/
    matching.ts           ← scoring engine (covered by tests)
    quiz-questions.ts     ← question catalog (single source of truth)
    demo-data.ts          ← seeded sample users for /demo
    supabase-*.ts         ← typed Supabase clients (server, browser)
    types.ts              ← shared domain types
  middleware.ts           ← auth gate + session refresh
tests/
  matching.test.mjs       ← node --test unit tests
schema.sql                ← Postgres schema + RLS policies + storage bucket
seed.sql                  ← 1000-user generator
seed-cleanup.sql          ← rollback for seed
```

---

## Deploy your own

1. Fork the repo.
2. Create a free Supabase project, run `schema.sql`.
3. Import the fork into Vercel; add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` env vars (Production + Preview + Development).
4. In Supabase auth config, add `https://<your-vercel-domain>/auth/callback` to the redirect URL allowlist.
