-- LegalFlow AI — Supabase schema
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query).

-- 1. Chat messages (AI Legal Chat history)
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

alter table chat_messages enable row level security;

create policy "Users can view their own messages"
  on chat_messages for select
  using (auth.uid() = user_id);

create policy "Users can insert their own messages"
  on chat_messages for insert
  with check (auth.uid() = user_id);

-- 2. Roadmap progress (one row per user; extend to per-matter if needed)
create table if not exists roadmap_progress (
  user_id uuid references auth.users(id) on delete cascade primary key,
  template_key text not null default 'rental-dispute',
  current_step int not null default 0,
  updated_at timestamptz default now()
);

alter table roadmap_progress enable row level security;

create policy "Users can view their own roadmap"
  on roadmap_progress for select
  using (auth.uid() = user_id);

create policy "Users can upsert their own roadmap"
  on roadmap_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own roadmap"
  on roadmap_progress for update
  using (auth.uid() = user_id);

-- 3. Generated documents
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  doc_type text not null,
  title text not null,
  content text not null,
  metadata jsonb,
  created_at timestamptz default now()
);

alter table documents enable row level security;

create policy "Users can view their own documents"
  on documents for select
  using (auth.uid() = user_id);

create policy "Users can insert their own documents"
  on documents for insert
  with check (auth.uid() = user_id);

-- 4. Lawyers directory (optional — replace src/data/mockLawyers.js with a live query
--    against this table once you've seeded real listings)
create table if not exists lawyers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  specialty text not null,
  experience int not null default 0,
  rating numeric(2,1) default 0,
  reviews int default 0,
  rate text,
  verified boolean default false
);

alter table lawyers enable row level security;

create policy "Anyone can view lawyer listings"
  on lawyers for select
  using (true);
