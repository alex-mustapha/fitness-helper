# Strength Tracker

A mobile-first workout tracker for a 3-day full body strength program. Built as a single HTML file — no build tools, no dependencies to install, no backend. Designed to be used on your phone at the gym.

## Program Overview

This is a 3-day full body intermediate strength program on a 7-week cycle:

- **Day A — Squat Focus**: Back Squat, Bench Press, Barbell Row, DB RDL, Face Pull, Plank
- **Day B — Press Focus**: OHP, Deadlift, Incline DB Press, Lat Pulldown, Leg Press, Curl + Pushdown
- **Day C — Deadlift Focus**: Deadlift, Front/Goblet Squat, DB Bench, Cable Row, Walking Lunges, Hanging Leg Raise

Train any 3 non-consecutive days per week (e.g. Mon/Wed/Fri).

## Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `strength-tracker`)
2. Upload all three files from this repo: `index.html`, `README.md`, `.nojekyll`
3. Go to **Settings → Pages**
4. Under "Build and deployment", set Source to **Deploy from a branch**
5. Select the **main** branch and **/ (root)** folder, then click **Save**
6. Wait about 60 seconds. Your app will be live at `https://<your-username>.github.io/strength-tracker/`

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

All data is stored in your phone's browser `localStorage`. It persists between visits — you don't need an account or internet connection to use the tracker once the page is loaded.

**Important**: If you clear your Safari data or delete the home screen bookmark without visiting the URL again, your data will be lost. Use the **Export** button in the top-right corner periodically to download a JSON backup of all your workout history.

## Customize the Program

Everything is in `index.html`. To modify exercises, sets, reps, or rest times, edit the `DAYS` array near the top of the `<script>` block. Each exercise has an `id`, `name`, `sets`, `reps`, and `rest` field.
