-- Charleston Playgrounds — Supabase setup
-- Paste this whole file into Supabase → SQL Editor → New query → Run. Safe to run more than once.

-- 1. Profiles (one per signed-up parent)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text,
  email_opt_in boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "own profile read" on public.profiles;
drop policy if exists "own profile write" on public.profiles;
create policy "own profile read" on public.profiles for select using (auth.uid() = id);
create policy "own profile write" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);

-- Create a profile automatically when someone signs up
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email_opt_in)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
          coalesce((new.raw_user_meta_data->>'email_opt_in')::boolean, false))
  on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- 2. Favorites, bucket list, visited
create table if not exists public.saved (
  user_id uuid not null references auth.users on delete cascade,
  slug text not null,
  list text not null check (list in ('favorite', 'bucket', 'visited')),
  created_at timestamptz not null default now(),
  primary key (user_id, slug, list)
);
alter table public.saved enable row level security;
drop policy if exists "own saved" on public.saved;
create policy "own saved" on public.saved for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 3. Ratings (1–5 stars per category)
create table if not exists public.ratings (
  user_id uuid not null references auth.users on delete cascade,
  slug text not null,
  category text not null check (category in ('overall','shade','equipment','cleanliness','bugs','safety','toddler','food')),
  value int not null check (value between 1 and 5),
  updated_at timestamptz not null default now(),
  primary key (user_id, slug, category)
);
alter table public.ratings enable row level security;
drop policy if exists "own ratings" on public.ratings;
create policy "own ratings" on public.ratings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Public averages (no personal info) shown on the site
create or replace view public.rating_summary as
  select slug, category, round(avg(value)::numeric, 2) as avg, count(*)::int as count
  from public.ratings group by slug, category;
grant select on public.rating_summary to anon, authenticated;

-- 4. Contact form submissions (anyone can send; only you can read them in the dashboard)
create table if not exists public.submissions (
  id bigint generated always as identity primary key,
  kind text,
  name text,
  email text,
  message text not null check (char_length(message) between 1 and 5000),
  page text,
  created_at timestamptz not null default now()
);
alter table public.submissions enable row level security;
drop policy if exists "anyone can submit" on public.submissions;
create policy "anyone can submit" on public.submissions for insert to anon, authenticated with check (true);
