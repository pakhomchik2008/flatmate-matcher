-- Run first in Supabase SQL Editor.
-- Dashboard → SQL Editor → paste → Run.

-- Enable trigram extension for fuzzy text search
create extension if not exists pg_trgm;

create table if not exists universities (
  id           uuid    default uuid_generate_v4() primary key,
  name         text    not null,
  abbreviation text,                      -- e.g. 'UCL', 'LSE', 'ETH'
  city         text    not null,
  country      text    not null,
  qs_rank      int,                       -- null = ranked 1001+
  created_at   timestamptz default now()
);

-- Trigram GIN index: powers "imper" → "Imperial College London"
create index if not exists universities_name_trgm_idx
  on universities using gin (name gin_trgm_ops);

-- Abbreviation lookup: "ucl" → UCL → University College London
create index if not exists universities_abbr_idx
  on universities (lower(abbreviation))
  where abbreviation is not null;

-- Rank ordering for result sorting
create index if not exists universities_rank_idx
  on universities (qs_rank asc nulls last);

-- RLS: universities are public read, no insert/update for regular users
alter table universities enable row level security;

drop policy if exists "Universities are publicly readable" on universities;
create policy "Universities are publicly readable"
  on universities for select using (true);
