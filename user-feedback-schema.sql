-- Run this in Supabase SQL Editor.
-- Dashboard → SQL Editor → paste → Run.

create table if not exists user_feedback (
  id          uuid        default uuid_generate_v4() primary key,
  user_id     uuid        not null references auth.users(id) on delete cascade,
  rating      int         not null check (rating between 1 and 5),
  feedback    text,
  created_at  timestamptz default now()
);

-- One row per user (prevent duplicate submissions)
create unique index if not exists user_feedback_user_id_idx on user_feedback (user_id);

alter table user_feedback enable row level security;

-- Users can only see and insert their own row
drop policy if exists "Users can insert own feedback" on user_feedback;
create policy "Users can insert own feedback"
  on user_feedback for insert with check (auth.uid() = user_id);

drop policy if exists "Users can read own feedback" on user_feedback;
create policy "Users can read own feedback"
  on user_feedback for select using (auth.uid() = user_id);
