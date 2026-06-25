# Strength Tracker

A mobile-first workout tracker for a 3-day full body strength program. Built as a single HTML file — no build step. Data is stored locally and synced to a free Supabase backend so it's durable across devices. Designed to be used on your phone at the gym.

## Program Overview

This is a 3-day full body intermediate strength program on a 7-week cycle:

- **Day A — Squat Focus**: Back Squat, Bench Press, Barbell Row, DB RDL, Face Pull, Plank
- **Day B — Press Focus**: OHP, Deadlift, Incline DB Press, Lat Pulldown, Leg Press, Curl + Pushdown
- **Day C — Deadlift Focus**: Deadlift, Front/Goblet Squat, DB Bench, Cable Row, Walking Lunges, Hanging Leg Raise

Train any 3 non-consecutive days per week (e.g. Mon/Wed/Fri).

## Cardio

Each workout day has an optional **cardio block** you can add as a **starter** (before the lifts) or a **finisher** (after accessories). Tap **+ Add starter cardio** / **+ Add finisher cardio** and log:

- **Activity** — incline walk, run, bike, row, elliptical, stair, swim, jump rope, other
- **Target intensity** — Z1 Recovery, Z2 Easy Aerobic, Z3 Tempo, Z4 Threshold, Z5 VO₂/Intervals
- **Duration** (min) and optional **Distance** (mi) — pace is derived automatically
- **RPE** (1–10) and free-text **Notes**

Cardio is optional and never blocks the "session complete" state. It's saved and cloud-synced as part of the session.

### Intensity guidance — "am I coasting?"

Each cardio block shows a guidance panel for the chosen target intensity so you know whether you're actually working:

- **Target HR** — shown as a **bpm range** if you enter your **Max HR** once (stored per user), otherwise as a **% of max HR** (estimate max ≈ 220 − age).
- **Target RPE** for the zone.
- **Talk test** — what your breathing/speech should feel like at that intensity.
- **Coasting check** — a concrete cue for when you're under target (e.g. "if you can chat effortlessly in Zone 2, pick it up until talking takes mild effort").

Note: a web app cannot read Apple Watch / HealthKit data directly (no browser API for it), so this is self-check guidance rather than an automatic HR feed. Glance at your watch and compare to the target range.

### Cardio analytics (Overview)

The **Overview** screen has a Cardio panel with general progress metrics:

- **Summary** — total cardio sessions, total minutes, total distance, and average RPE.
- **Weekly minutes** — a chart of cardio volume per week, so you can see consistency at a glance.
- **Pace by activity** — for each modality with distance logged, your pace (min/mi) with a trend label (**improving / flat / slipping**, where *lower pace = faster = improving*).

Because cardio is modality-specific, pace is tracked **per activity** (a run pace and a bike pace aren't comparable). Without heart-rate data, "pace at a given effort" plus weekly volume are the most honest improvement signals.

**Programming it without killing your lifts:** the main risk is the interference effect — hard cardio too close to heavy squats/deadlifts hurts strength and recovery. A sensible default:

- **2× Zone 2 / easy steady-state** (30–45 min, incline walk or bike) on **off-days** — aids recovery rather than hurting it.
- **Optional 1× intervals** on an off-day, kept away from Day A (squat) and Day C (deadlift).
- A **daily step target** (~8k) as the baseline that matters most.

Short easy cardio as a finisher is low-risk on any day; save intense intervals for off-days.

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

## Deploy to GitHub Pages

The app is a single static `index.html` that talks directly to Supabase from the browser — no build step and no server, so GitHub Pages hosts it for free with no build minutes.

1. In the repo, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Set the branch to **main** and the folder to **/ (root)**, then **Save**.
4. Wait ~1 minute. The app goes live at `https://<your-username>.github.io/strength-tracker/`.

Every push to **main** redeploys automatically (free). The `.nojekyll` file is included so Pages serves the files as-is.

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

Right under that, a **🎯 Last est 1RM** line shows your estimated one-rep max from that session (Epley formula) plus your top set — the number to beat. As you complete sets this session, it shows your current estimated 1RM live, and flips to a green **↑ PR!** flag the moment you exceed last time. This makes "push above last time" concrete at a glance.

Below that is an **inline trend sparkline** — the same kind of chart as the History view, but right on the exercise card. It plots your estimated 1RM across prior sessions and labels the direction: **↗ improving**, **→ flat**, or **↘ slipping** (with the net change and session count). So the moment you start a workout you can see which lifts are progressing and which have stalled, without opening History. Exercises with fewer than two logged sessions show no trend yet.

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
- **In the cloud** (Supabase) when a session completes, so it's durable and available on any device.

On load, the app pulls the current user's cloud data and merges in anything missing locally — so switching users or opening on a new device loads that user's history automatically. Each completed session also saves to the cloud, and you can re-save a finished session from its banner. If `SUPABASE_URL`/`SUPABASE_ANON_KEY` aren't set, the app still works fully in local-only mode and shows a banner.

> Note: cloud save happens on **session complete**. If you log a partial session and don't finish it, it stays on that device until completed.

**Clear All** wipes the current user's data both locally and in the cloud.

### Demo data

There's a built-in **`demo`** user (pick it from the header dropdown) preloaded with ~6 months of realistic mock history — progressive overload across all lifts, cardio blocks, and a bodyweight cut trend — so you can explore History, Overview, trends, and the cardio features without touching your own data.

## Customize the Program

Everything is in `index.html`. To modify exercises, sets, reps, or rest times, edit the `DAYS` array near the top of the `<script>` block. Each exercise has an `id`, `name`, `sets`, `reps`, and `rest` field.
