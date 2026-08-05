self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch {}
  event.waitUntil(self.registration.showNotification(data.title || "YLC 2026", {
    body: data.body || "There is a new conference announcement.",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: data.id ? `announcement-${data.id}` : "ylc-announcement",
    data: { url: data.url || "/announcements" },
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "/announcements", self.location.origin).href;
  event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
    for (const client of windows) if ("focus" in client && client.url.startsWith(self.location.origin)) { client.navigate(target); return client.focus(); }
    return clients.openWindow(target);
  }));
});
