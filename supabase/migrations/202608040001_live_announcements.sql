create extension if not exists pgcrypto;

create table if not exists public.announcements (
 id uuid primary key default gen_random_uuid(), title text not null, message text not null,
 category text not null check(category in ('General','Schedule Update','Urgent','Reminder','Opportunity')),
 priority text not null default 'normal' check(priority in ('normal','important','urgent')),
 audience_type text not null default 'everyone' check(audience_type in ('everyone','team','organizers')),
 audience_team_id uuid, related_schedule_event_id text, action_label text, action_url text,
 is_pinned boolean not null default false, send_push boolean not null default true,
 status text not null default 'published' check(status in ('draft','published','archived')),
 published_at timestamptz, expires_at timestamptz, created_by uuid not null references auth.users(id),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.announcement_reads (
 id uuid primary key default gen_random_uuid(), announcement_id uuid not null references public.announcements(id) on delete cascade,
 participant_id uuid not null references auth.users(id) on delete cascade, read_at timestamptz not null default now(),
 unique(announcement_id,participant_id)
);
create table if not exists public.notification_subscriptions (
 id uuid primary key default gen_random_uuid(), participant_id uuid not null references auth.users(id) on delete cascade,
 endpoint text not null unique, p256dh text not null, auth text not null, active boolean not null default true,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), last_used_at timestamptz
);
create table if not exists public.notification_preferences (
 participant_id uuid primary key references auth.users(id) on delete cascade,
 reminder_level text not null default 'important', schedule_reminders_enabled boolean not null default true,
 deadline_reminders_enabled boolean not null default true, urgent_announcements_enabled boolean not null default true,
 timezone text not null default 'America/Los_Angeles', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.announcement_push_deliveries (
 id uuid primary key default gen_random_uuid(), announcement_id uuid not null references public.announcements(id) on delete cascade,
 push_subscription_id uuid not null references public.notification_subscriptions(id) on delete cascade,
 participant_id uuid references auth.users(id) on delete set null, status text not null,
 attempted_at timestamptz not null default now(), delivered_at timestamptz, error_message text,
 deduplication_key text not null unique
);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
drop trigger if exists announcements_updated_at on public.announcements;
create trigger announcements_updated_at before update on public.announcements for each row execute function public.set_updated_at();

alter table public.announcements enable row level security;
alter table public.announcement_reads enable row level security;
alter table public.notification_subscriptions enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.announcement_push_deliveries enable row level security;

create policy "eligible participants read published announcements" on public.announcements for select to authenticated using (
 status='published' and (expires_at is null or expires_at>now()) and (
 audience_type='everyone' or
 (audience_type='team' and audience_team_id::text=(auth.jwt()->'app_metadata'->>'team_id')) or
 (audience_type='organizers' and auth.jwt()->'app_metadata'->>'role' in ('admin','organizer'))
 ));
create policy "admins manage announcements" on public.announcements for all to authenticated
 using (auth.jwt()->'app_metadata'->>'role'='admin') with check (auth.jwt()->'app_metadata'->>'role'='admin');
create policy "users read own announcement reads" on public.announcement_reads for select to authenticated using(participant_id=auth.uid());
create policy "users insert own announcement reads" on public.announcement_reads for insert to authenticated with check(participant_id=auth.uid());
create policy "users update own announcement reads" on public.announcement_reads for update to authenticated using(participant_id=auth.uid()) with check(participant_id=auth.uid());
create policy "users manage own subscriptions" on public.notification_subscriptions for all to authenticated using(participant_id=auth.uid()) with check(participant_id=auth.uid());
create policy "users manage own preferences" on public.notification_preferences for all to authenticated using(participant_id=auth.uid()) with check(participant_id=auth.uid());
create policy "admins read push deliveries" on public.announcement_push_deliveries for select to authenticated using(auth.jwt()->'app_metadata'->>'role'='admin');

do $$ begin alter publication supabase_realtime add table public.announcements; exception when duplicate_object then null; end $$;

-- Production dependency: create participant_profiles(user_id uuid primary key, team_id uuid, role text)
-- and populate app_metadata.team_id/role from a trusted server. The access-code-only prototype is not sufficient for secure RLS.
