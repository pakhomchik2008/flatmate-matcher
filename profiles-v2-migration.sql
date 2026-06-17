-- Run AFTER universities-schema.sql and universities-seed.sql.
-- Adds university_id (FK) and nickname to the existing profiles table.

alter table profiles
  add column if not exists university_id uuid references universities(id) on delete set null,
  add column if not exists nickname text;

-- Index for fast university-based filtering / matching boost
create index if not exists profiles_university_id_idx on profiles (university_id) where university_id is not null;
