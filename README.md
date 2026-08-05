# YLC 2026 Field Guide

## Supabase announcements setup

1. Copy `.env.example` to `.env.local` and replace every placeholder.
2. Open Supabase → SQL Editor.
3. Paste and run `supabase/migrations/202608040001_live_announcements.sql`.
4. Restart the Next.js development server after changing environment variables.

The publishable key is safe for browser reads. `SUPABASE_SECRET_KEY` and `ADMIN_ACCESS_CODE` are server-only and must never be prefixed with `NEXT_PUBLIC_`.

### Realtime

The migration adds `public.announcements` to the `supabase_realtime` publication. You can also confirm it in Supabase → Database → Publications → `supabase_realtime` and enable the `announcements` table there.

### Test live updates

1. Run `npm run dev`.
2. Open `/admin` in one window and sign in with `ADMIN_ACCESS_CODE`.
3. Open `/announcements` in another window and enter the normal participant access code if prompted.
4. Publish, pin, unpin, or delete from `/admin`.
5. The participant feed should update immediately. A newly published announcement also shows an in-app toast.

Announcement publishing works independently of push delivery and remains successful when push is not configured.

## Phone notifications

Generate VAPID keys once with `npx web-push generate-vapid-keys`. Put the public key in `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, the private key in `VAPID_PRIVATE_KEY`, and a `mailto:` contact in `VAPID_SUBJECT`. Add the same variables in Vercel and redeploy.

Participants enable notifications explicitly in Settings. On iPhone/iPad, YLC 2026 must first be added to the Home Screen and opened from its icon. Android and desktop browsers can enable notifications from the installed PWA or supported browser.

The `push_subscriptions` table has RLS enabled and no public policies. Subscription writes and push delivery go through server routes using `SUPABASE_SECRET_KEY`. Expired subscriptions are removed automatically. Announcement publishing still succeeds when push is unconfigured or an individual delivery fails.

## Admin access behavior

The admin code is verified only by the server. The returned authorization token is kept only in page memory—not localStorage, sessionStorage, or a cookie—so every refresh or revisit to `/admin` requires the code again.
