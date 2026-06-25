-- Fitness app — Supabase schema (run once in SQL Editor → New query).
-- The app talks to Supabase directly over its REST API; there is no server code.
-- The anon key is a public client key and is safe to commit.

-- ── Strength side (existing) ────────────────────────────────────────
create table if not exists sessions (
  user_id     text not null,
  session_key text not null,            -- e.g. "2026-06-25-A"
  data        jsonb not null,
  updated_at  timestamptz not null default now(),
  primary key (user_id, session_key)
);

create table if not exists bodyweight (
  user_id    text not null,
  date       text not null,             -- "YYYY-MM-DD"
  weight     text not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, date)
);

-- ── Diet side (new) ─────────────────────────────────────────────────
-- One row per user per day; the day's logged foods + totals live in `data`.
create table if not exists food_log (
  user_id    text not null,
  date       text not null,             -- "YYYY-MM-DD"
  data       jsonb not null,            -- { entries: [{ label, portion, c, p, f }] }
  updated_at timestamptz not null default now(),
  primary key (user_id, date)
);

-- One row per user: their keto macro targets.
create table if not exists diet_targets (
  user_id    text primary key,
  data       jsonb not null,            -- { carb, protein, fat }
  updated_at timestamptz not null default now()
);

-- ── Row level security ──────────────────────────────────────────────
-- Open anon policies: fine for a private personal app. Anyone with the URL
-- can read/write any user's rows. Swap to Supabase Auth + auth.uid() policies
-- when you need real per-user isolation.
alter table sessions     enable row level security;
alter table bodyweight   enable row level security;
alter table food_log     enable row level security;
alter table diet_targets enable row level security;

-- Idempotent: drop-then-create so re-running this file (e.g. when sharing a
-- Supabase project with an earlier app) never errors on an existing policy.
drop policy if exists "anon all sessions"     on sessions;
drop policy if exists "anon all bodyweight"   on bodyweight;
drop policy if exists "anon all food_log"     on food_log;
drop policy if exists "anon all diet_targets" on diet_targets;

create policy "anon all sessions"     on sessions     for all to anon using (true) with check (true);
create policy "anon all bodyweight"   on bodyweight   for all to anon using (true) with check (true);
create policy "anon all food_log"     on food_log     for all to anon using (true) with check (true);
create policy "anon all diet_targets" on diet_targets for all to anon using (true) with check (true);
