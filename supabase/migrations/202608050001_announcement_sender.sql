alter table public.announcements
  add column if not exists sender text not null default 'YLC';

update public.announcements
  set sender = 'YLC'
  where btrim(sender) = '';

alter table public.announcements
  drop constraint if exists announcements_sender_check;

alter table public.announcements
  add constraint announcements_sender_check
  check (char_length(sender) between 1 and 80);
