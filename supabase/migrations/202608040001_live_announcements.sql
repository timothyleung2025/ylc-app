create extension if not exists pgcrypto;

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  message text,
  link_url text,
  category text not null default 'general'
    check (category in ('general', 'urgent', 'link')),
  is_pinned boolean not null default false,
  created_at timestamptz not null default now()
);

-- Safely upgrade announcements created with the earlier category set.
alter table public.announcements add column if not exists link_url text;
alter table public.announcements alter column message drop not null;
alter table public.announcements alter column message drop default;
update public.announcements set category = 'general'
  where category not in ('general', 'urgent', 'link');
update public.announcements set message = null where category = 'link';
update public.announcements set link_url = null where category in ('general', 'urgent');
alter table public.announcements drop constraint if exists announcements_category_check;
alter table public.announcements drop constraint if exists announcements_message_check;
alter table public.announcements drop constraint if exists announcements_content_check;
alter table public.announcements add constraint announcements_category_check
  check (category in ('general', 'urgent', 'link'));
alter table public.announcements add constraint announcements_content_check check (
  (category = 'link' and message is null and link_url is not null and char_length(link_url) > 0)
  or
  (category in ('general', 'urgent') and message is not null and char_length(message) between 1 and 5000 and link_url is null)
);

create index if not exists announcements_feed_order_idx
  on public.announcements (is_pinned desc, created_at desc);

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_active boolean not null default true
);

alter table public.push_subscriptions add column if not exists user_agent text;
alter table public.push_subscriptions add column if not exists updated_at timestamptz not null default now();
alter table public.push_subscriptions add column if not exists is_active boolean not null default true;

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
