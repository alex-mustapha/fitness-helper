# fitness-helper — project context for Claude

Mobile-first personal fitness app unifying **strength training** + **keto diet tracking** in one
single-HTML-file app (no build step), synced to Supabase. This is the **merged successor** to two
earlier apps (a strength tracker and a keto meal planner).

- Repo: `github.com/alex-mustapha/fitness-helper`
- Local: `E:\projects\fitness-helper`
- Hosting: GitHub Pages (deploy from `main` / root; `.nojekyll` present). Every push to `main` redeploys.
- See `README.md` for the full feature tour. This file captures the non-obvious knowledge.

> The standalone `strength-tracker` repo is the **deprecated predecessor** — its strength half
> now lives here. Don't iterate on that repo; don't re-split the diet half into a separate app
> (an earlier "separate food app" plan is obsolete now that they're merged).

## Architecture
- **`index.html`** — the whole app: React via `@babel/standalone` (in-browser JSX, no build) +
  inline styles, gym-dark theme, mobile-first PWA. Three tabs share one user/data: Today / Train / Eat.
- **`diet-data.js`** — diet reference data (`PLAN`, `FOODS`, `CRAVINGS`) as plain globals, loaded
  before the app. Kept separate so `index.html` stays lean.
- **`docs/schema.sql`** — Supabase schema (run once). Tables: `sessions`, `bodyweight`,
  `food_log`, `diet_targets`.
- **Backend = Supabase REST direct from the browser, no server code.** `SUPABASE_URL` /
  `SUPABASE_ANON_KEY` near the top of the `<script>` block (anon key is safe to commit). Anon
  RLS = allow-all (fine for a private personal app; upgrade path is Supabase Auth + `auth.uid()`).
- **Storage**: one namespaced `localStorage` key per user `{ sessions, bodyweight, foodLog,
  dietTargets }`, mirrored to Supabase. Pull-and-merge on load; workouts cloud-save on session
  complete, food/weigh-ins save as made. Partial/unfinished sessions only cloud-save once completed.
- **Users**: hardcoded, no auth. Default `alex`; a seeded `demo` user has ~6 months mock strength
  history + bodyweight cut (from Supabase) plus a client-generated diet half.

## Gotchas
- **Pin `@babel/standalone` to 7.x** (`@babel/standalone@7.24.7`) with `data-presets="react"`.
  The unpinned "latest" defaults to the **automatic JSX runtime** (`import { jsx } from
  "react/jsx-runtime"`), incompatible with the React 18 UMD global → page renders **blank** with
  no obvious error.
- **TDZ ordering**: 7.x keeps `const` as `const` (no `var` transpile), so define
  `useCallback`/functions **before** any `useEffect` that lists them in its deps array, or you get
  "Cannot access 'X' before initialization".
- **Programs**: Train has a per-user toggle between **Gym** (Push/Pull/Legs) and **Home
  (Kettlebell)**; each program's sessions store separately, history/Overview resolve from either.
  Cardio is a **required block per training day** (Z2 easy on Push/Pull, Z4 intervals on Legs);
  session isn't complete until cardio has a duration (End workout bypasses).
- **No HealthKit/Apple Watch read** — browsers have no API. HR guidance is self-check only; real
  ingestion would need an Apple Shortcut / Health Auto Export POSTing to Supabase.
- **Customize**: strength program = `DAYS`/`ACCESSORIES` in `index.html`; meal plan/foods/cravings
  = `diet-data.js`; default macros = `DEFAULT_DIET_TARGETS` in `index.html`.
