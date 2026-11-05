-- Target database: Supabase PostgreSQL 17.
-- Check the project version with SHOW server_version before running this file.
-- Run once in the Supabase SQL Editor for this project.
-- No changes are made to existing menu data or existing Storage buckets.
begin;

create table if not exists public.choco_menu (
  id integer primary key check (id = 1),
  revision integer not null default 1 check (revision > 0),
  categories jsonb not null check (jsonb_typeof(categories) = 'array')
);

create table if not exists public.choco_admin_sessions (
  token text primary key,
  expires bigint not null
);
create index if not exists choco_admin_sessions_expires on public.choco_admin_sessions (expires);

create table if not exists public.choco_login_attempts (
  id integer primary key check (id = 1),
  count integer not null check (count > 0),
  reset_at bigint not null
);

alter table public.choco_menu enable row level security;
alter table public.choco_admin_sessions enable row level security;
alter table public.choco_login_attempts enable row level security;

revoke all on public.choco_menu, public.choco_admin_sessions, public.choco_login_attempts from public, anon, authenticated;
grant select, insert, update, delete on public.choco_menu, public.choco_admin_sessions, public.choco_login_attempts to service_role;

-- One statement keeps failed-login counts consistent across concurrent functions.
create or replace function public.choco_record_login_failure()
returns void
language sql
security invoker
set search_path = ''
as $$
  insert into public.choco_login_attempts (id, count, reset_at)
  values (1, 1, (extract(epoch from now()) * 1000)::bigint + 900000)
  on conflict (id) do update set
    count = case when choco_login_attempts.reset_at < (extract(epoch from now()) * 1000)::bigint
      then 1 else choco_login_attempts.count + 1 end,
    reset_at = case when choco_login_attempts.reset_at < (extract(epoch from now()) * 1000)::bigint
      then excluded.reset_at else choco_login_attempts.reset_at end;
$$;

revoke all on function public.choco_record_login_failure() from public, anon, authenticated;
grant execute on function public.choco_record_login_failure() to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('menu-images', 'menu-images', false, 8388608, array['image/webp'])
on conflict (id) do nothing;

commit;
