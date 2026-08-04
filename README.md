# YLC 2026 Field Guide

## Live announcements

Announcements use one service (`lib/announcement-service.ts`). When Supabase environment variables are configured, it uses Postgres, RLS, and Realtime. Without them, **development only** uses localStorage plus BroadcastChannel; fallback records are visibly labeled `TEST` and cannot send push notifications.

### Configure Supabase

1. Create a Supabase project and copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
3. Apply `supabase/migrations/202608040001_live_announcements.sql` with `supabase db push` or the SQL editor.
4. Replace access-code-only sessions with Supabase Auth before production. Create `participant_profiles(user_id uuid primary key, team_id uuid, role text)` and assign trusted `app_metadata.team_id` and `app_metadata.role` server-side. Team RLS intentionally depends on those trusted claims.

### Create the first admin

Create the user through Supabase Auth, then set app metadata with a trusted server/service-role script:

```ts
await supabase.auth.admin.updateUserById(userId, {
  app_metadata: { role: "admin" },
});
```

Never perform this from browser code. Sign in as that user before opening `/admin/announcements` in production.

### Push configuration and Edge Function

Generate VAPID keys and set the browser-safe public key as `NEXT_PUBLIC_VAPID_PUBLIC_KEY`. Set these Edge Function secrets:

```bash
supabase secrets set \
  VAPID_PUBLIC_KEY=... \
  VAPID_PRIVATE_KEY=... \
  VAPID_SUBJECT=mailto:youthleadership@stanford.edu \
  SUPABASE_URL=... \
  SUPABASE_SECRET_KEY=...
supabase functions deploy send-announcement-push
```

`SUPABASE_SECRET_KEY` and `VAPID_PRIVATE_KEY` must never use a `NEXT_PUBLIC_` name. The function verifies the caller is an authenticated admin, applies audience/preferences, claims a unique delivery key, sends Web Push, logs results, and disables expired subscriptions.

### Realtime testing

1. Run two browser windows with the same development origin.
2. Open `/announcements` in one and `/admin/announcements` in the other.
3. Publish a fallback announcement; it should appear live with a toast and unread badge.
4. With Supabase configured, repeat while authenticated and confirm the `announcements` table is enabled in the `supabase_realtime` publication.
5. Test everyone/team/organizers audiences with separate authenticated users and trusted team/role claims.

### Push testing

1. Install/open the PWA, go to More, and explicitly enable announcement notifications.
2. Confirm a real row exists in `notification_subscriptions`.
3. Publish from `/admin/announcements` with **Send push** enabled. Use a test-only audience/device before broad delivery.
4. Confirm delivery rows and tap the notification; it must open `/announcements/[announcementId]`.

Push is not operational until Supabase Auth, the migration, VAPID keys, a saved subscription, and the deployed Edge Function are all present. The local test button verifies only service-worker display/click behavior, not server delivery.
