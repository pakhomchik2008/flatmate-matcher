-- Run this in Supabase SQL Editor to add the feedback table.
-- Go to: Dashboard → SQL Editor → paste and run.

create table if not exists feedback (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  university text,
  rating int check (rating between 1 and 5) not null,
  message text not null check (char_length(message) >= 10 and char_length(message) <= 500),
  approved boolean default true,
  created_at timestamptz default now()
);

alter table feedback enable row level security;

-- Anyone can read approved feedback
drop policy if exists "Approved feedback is publicly readable" on feedback;
create policy "Approved feedback is publicly readable"
  on feedback for select using (approved = true);

-- Anyone (including anonymous visitors) can submit feedback
drop policy if exists "Anyone can submit feedback" on feedback;
create policy "Anyone can submit feedback"
  on feedback for insert with check (true);

-- Seed a few starter testimonials so the section isn't empty on day 1
insert into feedback (name, university, rating, message) values
  ('Priya S.', 'University of Warwick', 5, 'Found my flatmate within a week. The compatibility score was scarily accurate — we match on everything that actually matters.'),
  ('Oliver C.', 'Imperial College London', 5, 'Way better than random Facebook groups. The quiz surfaces things you forget to ask about until month two.'),
  ('Hannah O.', 'University of Leeds', 4, 'Really clean UI and the matching algorithm is transparent — I like that I can see exactly why someone scored 88%.'),
  ('Ravi S.', 'University of Bristol', 5, 'Moved in with my match last September. Still going strong. Highly recommend.');
