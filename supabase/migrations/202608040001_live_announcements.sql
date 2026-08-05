create extension if not exists pgcrypto;

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  message text not null check (char_length(message) between 1 and 5000),
  category text not null default 'general'
    check (category in ('general', 'reminder', 'schedule_update', 'urgent')),
  is_pinned boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists announcements_feed_order_idx
  on public.announcements (is_pinned desc, created_at desc);

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

alter table public.announcements enable row level security;
alter table public.push_subscriptions enable row level security;

grant usage on schema public to anon, authenticated, service_role;
grant select on table public.announcements to anon, authenticated;
grant all privileges on table public.announcements to service_role;
grant all privileges on table public.push_subscriptions to service_role;

drop policy if exists "Announcements are publicly readable"
  on public.announcements;

create policy "Announcements are publicly readable"
  on public.announcements for select
  to anon, authenticated
  using (true);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'announcements'
  ) then
    alter publication supabase_realtime add table public.announcements;
  end if;
end
$$;
