import "server-only";
import webpush from "web-push";
import { getSupabaseAdminClient } from "./supabase/admin";
import type { Announcement } from "./announcement-types";

export async function sendAnnouncementPush(announcement: Announcement) {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;
  const supabase = getSupabaseAdminClient();
  if (!publicKey || !privateKey || !subject || !supabase) return;

  webpush.setVapidDetails(subject, publicKey, privateKey);
  const { data: subscriptions } = await supabase.from("push_subscriptions").select("id,endpoint,p256dh,auth");
  await Promise.allSettled((subscriptions || []).map(async (subscription) => {
    try {
      await webpush.sendNotification(
        { endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } },
        JSON.stringify({ title: announcement.title, body: announcement.message.slice(0, 180), url: "/announcements", id: announcement.id }),
      );
    } catch (issue) {
      const statusCode = (issue as { statusCode?: number }).statusCode;
      if (statusCode === 404 || statusCode === 410) await supabase.from("push_subscriptions").delete().eq("id", subscription.id);
    }
  }));
}
