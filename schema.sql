-- Run this in the Supabase SQL editor.

create extension if not exists "uuid-ossp";

create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  age int,
  university text not null,
  city text not null,
  bio text,
  avatar_url text,
  move_in_date date,
  budget_min int,
  budget_max int,
  looking_for text check (looking_for in ('room', 'flatmate', 'both')) default 'both',
  quiz_completed boolean default false,
  created_at timestamptz default now()
);

create table if not exists quiz_answers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade unique,
  sleep_schedule int check (sleep_schedule between 1 and 5),
  cleanliness int check (cleanliness between 1 and 5),
  noise_level int check (noise_level between 1 and 5),
  guests_frequency int check (guests_frequency between 1 and 5),
  study_location int check (study_location between 1 and 5),
  smoking boolean default false,
  pets boolean default false,
  cooking_frequency int check (cooking_frequency between 1 and 5),
  temperature_preference int check (temperature_preference between 1 and 5),
  work_schedule int check (work_schedule between 1 and 5),
  updated_at timestamptz default now()
);

create table if not exists messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references profiles(id) on delete cascade,
  receiver_id uuid references profiles(id) on delete cascade,
  content text not null,
  read boolean default false,
  created_at timestamptz default now()
);

create index if not exists messages_pair_idx
  on messages (least(sender_id, receiver_id), greatest(sender_id, receiver_id), created_at);

alter table profiles enable row level security;
alter table quiz_answers enable row level security;
alter table messages enable row level security;

drop policy if exists "Profiles are viewable by all authenticated users" on profiles;
create policy "Profiles are viewable by all authenticated users"
  on profiles for select using (auth.role() = 'authenticated');

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on profiles;
create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

drop policy if exists "Quiz answers viewable by authenticated users" on quiz_answers;
create policy "Quiz answers viewable by authenticated users"
  on quiz_answers for select using (auth.role() = 'authenticated');

drop policy if exists "Users can manage own quiz answers" on quiz_answers;
create policy "Users can manage own quiz answers"
  on quiz_answers for all using (auth.uid() = user_id);

drop policy if exists "Users can see their own messages" on messages;
create policy "Users can see their own messages"
  on messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

drop policy if exists "Users can send messages" on messages;
create policy "Users can send messages"
  on messages for insert with check (auth.uid() = sender_id);

drop policy if exists "Users can update own message read state" on messages;
create policy "Users can update own message read state"
  on messages for update using (auth.uid() = receiver_id);

-- Storage bucket for avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Avatar images are publicly accessible" on storage.objects;
create policy "Avatar images are publicly accessible"
  on storage.objects for select using (bucket_id = 'avatars');

drop policy if exists "Users can upload own avatar" on storage.objects;
create policy "Users can upload own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Users can update own avatar" on storage.objects;
create policy "Users can update own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
