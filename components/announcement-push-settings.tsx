"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import { Bell, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
function supported() {
  return (
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}
function standalone() {
  return (
    matchMedia("(display-mode: standalone)").matches ||
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  );
}
function ios() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}
function key(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  return Uint8Array.from(
    atob((value + padding).replace(/-/g, "+").replace(/_/g, "/")),
    (c) => c.charCodeAt(0),
  );
}
export function AnnouncementPushSettings() {
  const [status, setStatus] = useState("Not enabled");
  const [urgent, setUrgent] = useState(true);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!supported()) setStatus("Unsupported on this device");
    else if (ios() && !standalone())
      setStatus("Add YLC to your Home Screen first");
    else if (Notification.permission === "denied")
      setStatus("Permission denied");
    else if (Notification.permission === "granted")
      setStatus("Permission granted");
  }, []);
  async function enable() {
    setMessage("");
    if (ios() && !standalone()) {
      setMessage(
        "On iPhone or iPad, add YLC 2026 to your Home Screen and open it there first.",
      );
      return;
    }
    if (!supported()) {
      setStatus("Unsupported on this device");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setStatus(permission === "denied" ? "Permission denied" : "Not enabled");
      return;
    }
    setStatus("Permission granted");
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) {
      setMessage("Push subscription requires the VAPID public key.");
      return;
    }
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription =
        (await registration.pushManager.getSubscription()) ||
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: key(publicKey),
        }));
      const supabase = getSupabase();
      const user = (await supabase?.auth.getUser())?.data.user;
      if (!supabase || !user) {
        setMessage(
          "Browser permission is granted. Saving subscriptions requires Supabase Auth.",
        );
        return;
      }
      const json = subscription.toJSON();
      const { error } = await supabase
        .from("notification_subscriptions")
        .upsert(
          {
            participant_id: user.id,
            endpoint: subscription.endpoint,
            p256dh: json.keys?.p256dh,
            auth: json.keys?.auth,
            last_used_at: new Date().toISOString(),
          },
          { onConflict: "endpoint" },
        );
      if (error) throw error;
      setStatus("Enabled");
      await supabase
        .from("notification_preferences")
        .upsert({
          participant_id: user.id,
          urgent_announcements_enabled: urgent,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
    } catch (error) {
      setStatus("Subscription failed");
      setMessage(
        error instanceof Error ? error.message : "Could not subscribe",
      );
    }
  }
  async function test() {
    if (Notification.permission !== "granted") return;
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification("YLC announcement test", {
      body: "Announcement notifications are ready on this device.",
      icon: "/icon-192.png",
      data: { url: "/announcements" },
      tag: "ylc-announcement-test",
    });
  }
  return (
    <section>
      <div className="card p-4">
        <div className="flex gap-3">
          <Bell className="text-[var(--dark-cyan)]" />
          <div>
            <h2 className="font-bold">Announcement notifications</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Receive urgent organizer updates when the app is closed.
            </p>
            <p className="mt-2 text-xs font-black text-[var(--dark-cyan)]">
              {status}
            </p>
          </div>
        </div>
        <label className="mt-4 flex items-center justify-between text-sm font-bold">
          Urgent announcements
          <input
            type="checkbox"
            checked={urgent}
            onChange={(event) => setUrgent(event.target.checked)}
            className="size-5 accent-[var(--dark-cyan)]"
          />
        </label>
        <div className="mt-4 flex gap-2">
          <button
            onClick={enable}
            className="min-h-11 flex-1 rounded-xl bg-[var(--dark-cyan)] px-3 text-sm font-bold text-white"
          >
            Enable notifications
          </button>
          {typeof Notification !== "undefined" &&
            Notification.permission === "granted" && (
              <button
                onClick={test}
                aria-label="Send test notification"
                className="grid size-11 place-items-center rounded-xl border bg-white"
              >
                <Send size={16} />
              </button>
            )}
        </div>
        {message && (
          <p className="mt-3 rounded-xl bg-[#fff0c8] p-3 text-xs font-bold text-[var(--muted)]">
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
