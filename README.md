# Fitness

A mobile-first personal fitness app that unifies **strength training** and **keto diet tracking** in one place. Single HTML file, no build step. Data is stored locally and synced to a free Supabase backend so it's durable across devices. Designed to live on your phone — at the gym and in the kitchen.

It started as two separate apps (a strength tracker and a keto meal planner) and was merged so the two halves can talk to each other: one bodyweight, one user, and one combined daily summary you can hand to Claude for feedback.

## The three tabs

A bottom tab bar switches between three views that all share the same user and data:

### ◎ Today — the at-a-glance view
- **Bodyweight** — log today's weigh-in once; it's shared with Train and the trend.
- **Training status** — detects whether you've logged a workout today (and which day / volume), or shows "rest day" with a shortcut to start one.
- **Macro rings** — carbs vs. your target, protein, fat, and estimated calories, reflecting everything logged in Eat.
- **Protein bump on lift days** — when you've trained, the protein target flexes up ~10% to support recovery, and the rings update to match.
- **Today's plan** — the planned meals for today's weekday from the keto rotation.
- **Copy daily summary → Claude** — one button that puts lifts + macros + weight trend on your clipboard in a single paste, instead of two separate exports.

### 🏋 Train — the strength tracker
A 3-day **Push / Pull / Legs** split that eases in (lighter leg day, conservative starting volume). Each training day includes a **required cardio block** — easy steady-state (Z2) on Push/Pull, high-intensity intervals (Z4) on Legs; a session isn't complete until cardio has a duration logged (you can still End workout early). Log sets with an auto rest timer, see last session and estimated 1RM with a live PR flag, inline per-exercise trend sparklines, exercise substitutes and editable set/rep schemes, and a cross-exercise **Overview** with bodyweight, cardio, and Recent Sessions analytics.

### 🍳 Eat — the keto helper
- **Live macro tracker** — search a food, pick the match, dial in the portion; macros come from a built-in 134-food USDA-sourced database. Logged foods persist per day and count against your carb/protein/fat targets (editable inline).
- **Weekly meal plan** — a 7-day keto rotation (home-cooked + Factor delivery nights) with full recipes (ingredients + method) for everything you cook, and a per-day macro breakdown.
- **Craving busters** — buy-or-make swaps for sweet / salty / carby cravings that keep you in ketosis (with a maltitol warning).
- **Recipe discovery** — quick links into Diet Doctor, Wholesome Yum, and Carb Manager.

## How it's built

- **`index.html`** — the whole app: React (via Babel standalone, no build) + inline styles, gym-dark theme, mobile-first PWA.
- **`diet-data.js`** — the diet reference data (meal plan, food database, craving library) as plain globals, loaded before the app. Kept separate so `index.html` stays lean and the data is easy to edit.
- **`docs/schema.sql`** — the Supabase schema (run once).

## Backend setup (Supabase — free, ~3 minutes)

The app talks directly to a Supabase Postgres database over its REST API. There is no server code.

1. Go to [supabase.com](https://supabase.com), sign in, and create a **New project**.
2. Open **Project Settings → API** and copy the **Project URL** and the **anon public** key.
3. Open **SQL Editor → New query**, paste the contents of [`docs/schema.sql`](docs/schema.sql), and **Run**. It creates four tables: `sessions`, `bodyweight`, `food_log`, and `diet_targets`.
4. In `index.html`, set `SUPABASE_URL` and `SUPABASE_ANON_KEY` near the top of the script block. (The anon key is safe to commit — it's a public client key.)

> **Access note:** the open anon policies let anyone with the URL read/write any user's rows — fine for a private personal app. Swap to Supabase Auth + `auth.uid()` policies when you need real per-user isolation.

If the keys aren't set, the app still works fully in local-only mode.

## Data storage

Everything for a user lives under one namespaced `localStorage` key as `{ sessions, bodyweight, foodLog, dietTargets }`, mirrored to the matching Supabase tables. On load, the app pulls cloud data and merges in anything missing locally, so opening on a new device restores your history. Workouts cloud-save on session complete; food entries and weigh-ins save as you make them. `food_log` / `diet_targets` are pulled defensively — if those tables don't exist yet, the strength side still loads.

## Users

No login. A dropdown in **every tab's** header picks the active user (default `alex`); each user's data is namespaced. A seeded **`demo`** user lets you explore with mock data: ~6 months of strength history + a bodyweight cut (from Supabase), plus a diet half generated on the client — the demo "eats the plan," so the last two weeks of food logs mirror each weekday's planned keto meals. Switching to `demo` from any tab populates Today, Train, and Eat at once.

## Deploy to GitHub Pages

Static files, no build — GitHub Pages hosts it free. In the repo: **Settings → Pages → Deploy from a branch → `main` / root**. The `.nojekyll` file makes Pages serve the files as-is, including `diet-data.js`. Every push to `main` redeploys.

## Install on your iPhone

Open the Pages URL in **Safari**, tap **Share → Add to Home Screen**. It opens full-screen like a native app.

## Customize

- **Strength program** — edit the `DAYS` / `ACCESSORIES` arrays near the top of the script in `index.html`.
- **Meal plan, food database, cravings** — edit `diet-data.js` (`PLAN`, `FOODS`, `CRAVINGS`).
- **Default macro targets** — `DEFAULT_DIET_TARGETS` in `index.html` (also editable per-user in the Eat tab).
