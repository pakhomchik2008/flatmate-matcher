# Flatmate Matcher

A web app where university students create a profile, take a compatibility quiz, and get matched with compatible flatmates at their university.

## Stack
- Next.js 14 (App Router) + TypeScript
- Supabase (Postgres, Auth, Storage, Realtime)
- Tailwind CSS

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a Supabase project at https://supabase.com (free tier).

3. In the Supabase SQL Editor, run the contents of `schema.sql`.

4. In the Supabase dashboard → Authentication → URL Configuration:
   - Set the Site URL to `http://localhost:3000` (and your Vercel URL once deployed).
   - Add `http://localhost:3000/auth/callback` as a redirect URL.

5. In Database → Replication, enable Realtime on the `messages` table.

6. Copy `.env.local.example` to `.env.local` and fill in the values from your Supabase project settings → API:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

7. Run the dev server:
   ```bash
   npm run dev
   ```

   Open http://localhost:3000.

## Flow
- `/auth/signup` → create account → email confirm → `/onboarding`
- `/onboarding` → 3-step form (profile → flatmate details → 10-question quiz)
- `/matches` → grid of compatible profiles, sorted by score, filterable
- `/profile/[id]` → full profile + compatibility breakdown + "Send message"
- `/messages` → realtime inbox + thread view
- `/profile/me` → edit profile, retake quiz, delete account

## Deploy
1. Push to GitHub.
2. Import the repo into Vercel.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel env settings.
4. Update Supabase auth redirect URL to include your Vercel domain.

## Matching algorithm
See `src/lib/matching.ts`. Weighted average across 10 traits; numeric traits use `1 - |a-b|/4`, boolean traits use exact match. Weights sum to 1.0; output is rounded to a 0–100 percentage.
