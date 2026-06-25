# Strength Tracker

A mobile-first workout tracker for a 3-day full body strength program. Built as a single HTML file — no build step. Data is stored locally and synced to a free Supabase backend so it's durable across devices. Designed to be used on your phone at the gym.

## Program Overview

This is a 3-day full body intermediate strength program on a 7-week cycle:

- **Day A — Squat Focus**: Back Squat, Bench Press, Barbell Row, DB RDL, Face Pull, Plank
- **Day B — Press Focus**: OHP, Deadlift, Incline DB Press, Lat Pulldown, Leg Press, Curl + Pushdown
- **Day C — Deadlift Focus**: Deadlift, Front/Goblet Squat, DB Bench, Cable Row, Walking Lunges, Hanging Leg Raise

Train any 3 non-consecutive days per week (e.g. Mon/Wed/Fri).

## Backend Setup (Supabase — free, ~3 minutes)

The app talks directly to a Supabase Postgres database over its REST API. There is no server code to maintain.

1. Go to [supabase.com](https://supabase.com), sign in, and create a **New project** (any name/region; set a DB password).
2. Open **Project Settings → API** and copy the **Project URL** and the **anon public** key.
3. Open **SQL Editor → New query**, paste the SQL below, and click **Run**:

   ```sql
   create table sessions (
     user_id text not null,
     session_key text not null,
     data jsonb not null,
     updated_at timestamptz not null default now(),
     primary key (user_id, session_key)
   );
   create table bodyweight (
     user_id text not null,
     date text not null,
     weight text not null,
     updated_at timestamptz not null default now(),
     primary key (user_id, date)
   );
   alter table sessions enable row level security;
   alter table bodyweight enable row level security;
   create policy "anon all sessions" on sessions for all to anon using (true) with check (true);
   create policy "anon all bodyweight" on bodyweight for all to anon using (true) with check (true);
   ```

4. In `index.html`, set `SUPABASE_URL` and `SUPABASE_ANON_KEY` near the top of the script block. (The anon key is safe to commit — it's a public client key.)

> **Note on access:** with no login, the anon policies above let anyone with the URL read/write any user's rows. That's fine for a private personal app. When you need real per-user isolation, swap to Supabase Auth and tighten the RLS policies to `auth.uid()`.

## Users

There's no login. A dropdown in the header lets you pick the active user (default `alex`); each user's data is namespaced by their name. Choose **+ add user…** in the dropdown to add another. Switching users loads that user's data from the cloud automatically.

## Deploy to Netlify

1. Connect this repo to Netlify (or drag-and-drop the folder).
2. `netlify.toml` publishes the repo root as a static site — no build command, no functions.
3. Deploys happen automatically from the **main** branch.

## Install on Your iPhone

1. Open your GitHub Pages URL in **Safari** (must be Safari, not Chrome)
2. Tap the **Share** button (the square with an arrow pointing up)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **Add**
5. The app now appears on your home screen and opens full-screen like a native app

## How to Use the Tracker

### Log Your Bodyweight

At the top of the screen there's a bodyweight field. Enter your weight in pounds each time you work out. It shows your last weigh-in and the change (green = weight down, red = weight up).

### Select Your Workout Day

Tap **Day A**, **Day B**, or **Day C** depending on which session you're doing today.

### Log a Set

1. Tap the **"Tap to log set 1"** button on any exercise
2. Enter the **weight** (in pounds) and **reps** you completed
3. Tap **Done ✓**
4. A **rest timer** automatically starts based on the prescribed rest time for that exercise
5. When the timer finishes (or tap **Skip** to move on), log your next set
6. Repeat until all sets are complete

### Use Previous Session as Reference

Below each exercise you'll see what you lifted last time (e.g. "Last (2026-06-02): 185x5 / 185x5 / 185x5 / 185x4"). Use this to decide your working weight — try to match or beat it.

### Edit a Completed Set

If you entered the wrong weight or reps, tap **Edit** on any completed set to fix it.

### View Exercise History

Tap the **History** button on any exercise to see your last 10 sessions for that movement, with weight and reps for every set.

### Track Your Progress

The progress bar at the top shows how many sets you've completed out of the total for the session (e.g. "12/20 sets").

### Session Complete — Email Yourself a Summary

When you finish all sets, a green **"Session Complete"** banner appears with two options:

- **Email Summary** — Opens a pre-filled email draft in your phone's mail app addressed to kalinowski89@gmail.com. Just tap send. The email includes every exercise with weight/reps for each set, your previous session for comparison, total volume, your bodyweight and trend, and a ready-to-use prompt for Claude.
- **Copy** — Copies the same summary to your clipboard so you can paste it into Notes or a message.

After dismissing the banner, you can still tap **Re-send Summary** or **Copy** at any time.

### Get Feedback from Claude

After a few workouts, paste one or more email summaries into a Claude conversation. Claude will review your numbers, flag exercises where you should increase or decrease weight, comment on your bodyweight trend, and suggest what to focus on next.

### Reset a Session

If you need to start a workout over, tap **Reset** in the progress bar area (only appears mid-session).

## Data Storage

Data is stored two ways:

- **Locally** in your phone's browser `localStorage`, so the app works offline and is instant.
- **In the cloud** (Supabase) whenever a session completes or you tap **Sync**, so it's durable and available on any device.

On load, the app pulls your cloud data and merges in anything missing locally. The **Sync** button does a full two-way sync: it pushes all local sessions up, then pulls any missing cloud sessions back down. If `SUPABASE_URL`/`SUPABASE_ANON_KEY` aren't set, the app still works fully in local-only mode and shows a banner.

**Clear All** wipes the current user's data both locally and in the cloud.

## Customize the Program

Everything is in `index.html`. To modify exercises, sets, reps, or rest times, edit the `DAYS` array near the top of the `<script>` block. Each exercise has an `id`, `name`, `sets`, `reps`, and `rest` field.
