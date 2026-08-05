"use client";
/* eslint-disable react-hooks/refs, react-hooks/exhaustive-deps */
import { Bell, CheckCheck, ExternalLink, Pin, RotateCw } from "lucide-react";
import { TouchEvent, useEffect, useRef, useState } from "react";
import { useAnnouncements } from "@/components/announcement-provider";
import { announcementStyles, LiveAnnouncementCard } from "@/components/live-announcement-card";
import { EmptyState, PageHeader, Sheet } from "@/components/ui";
import type { Announcement } from "@/lib/announcement-types";
import { PushNotificationSettings } from "@/components/push-notification-settings";

export default function AnnouncementsPage() {
  const { announcements, loading, error, refresh, unreadCount, isRead, markRead, markAllRead } = useAnnouncements();
  const [selected, setSelected] = useState<Announcement | null>(null);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const openedFromNotification = useRef<string | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("announcement");
    const item = announcements.find((announcement) => announcement.id === id);
    if (item && openedFromNotification.current !== item.id) { openedFromNotification.current = item.id; markRead(item.id); setSelected(item); }
  }, [announcements]);

  function touchStart(event: TouchEvent) {
    if (window.scrollY <= 0) startY.current = event.touches[0].clientY;
  }
  function touchMove(event: TouchEvent) {
    if (startY.current === null || window.scrollY > 0) return;
    setPull(Math.min(82, Math.max(0, event.touches[0].clientY - startY.current) * 0.48));
  }
  async function touchEnd() {
    startY.current = null;
    if (pull >= 56) {
      setRefreshing(true); setPull(52); await refresh(); setRefreshing(false);
    }
    setPull(0);
  }
  function open(item: Announcement) { markRead(item.id); setSelected(item); }

  return <div className="relative mx-auto min-h-[75dvh] max-w-3xl touch-pan-y" onTouchStart={touchStart} onTouchMove={touchMove} onTouchEnd={touchEnd} onTouchCancel={touchEnd}>
    <div aria-live="polite" className="pointer-events-none absolute inset-x-0 -top-14 flex justify-center" style={{ transform: `translateY(${pull}px)`, opacity: Math.min(1, pull / 42) }}><span className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[10px] font-black uppercase text-[var(--dark-cyan)] shadow-md"><RotateCw size={13} className={refreshing ? "animate-spin" : pull >= 56 ? "rotate-180 transition-transform" : "transition-transform"}/>{refreshing ? "Refreshing" : pull >= 56 ? "Release to refresh" : "Pull to refresh"}</span></div>
    <div style={{ transform: `translateY(${pull}px)`, transition: startY.current === null ? "transform 220ms cubic-bezier(.22,1,.36,1)" : "none" }}>
      <PageHeader eyebrow={`${unreadCount} unread`} title="Announcements" />
      <div className="mb-4"><PushNotificationSettings compact /></div>
      {unreadCount > 0 && <button onClick={markAllRead} className="mb-4 flex items-center gap-2 text-xs font-extrabold text-[var(--dark-cyan)]"><CheckCheck size={15}/>Mark all as read</button>}
      {loading ? <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="card h-40 animate-pulse bg-white/60"/>)}</div>
        : error ? <div className="card p-6 text-center"><p className="font-bold text-[#965555]">Couldn’t load announcements</p><p className="mt-1 text-sm text-[var(--muted)]">{error}</p><p className="mt-3 text-xs font-bold text-[var(--dark-cyan)]">Pull down to try again.</p></div>
        : announcements.length ? <div className="space-y-3">{announcements.map(item=><LiveAnnouncementCard key={item.id} item={item} read={isRead(item.id)} onClick={()=>open(item)} onLinkClick={()=>markRead(item.id)}/>)}</div>
        : <EmptyState title="Nothing here yet" body="New conference updates will appear here."/>}
      <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-[var(--muted)]"><Bell size={13}/>Pull down to refresh · live updates appear automatically.</p>
    </div>
    <Sheet open={Boolean(selected)} onClose={()=>setSelected(null)} title={selected?.title || "Announcement"}>
      {selected && <article><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wide ${announcementStyles[selected.category]}`}>{selected.category}</span>{selected.is_pinned&&<span className="flex items-center gap-1 text-xs font-bold text-[var(--dark-cyan)]"><Pin size={13}/>Pinned</span>}</div>{selected.category === "link" && selected.link_url ? <a href={selected.link_url} target="_blank" rel="noopener noreferrer" className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--dark-cyan)] px-4 font-bold text-white">Open link <ExternalLink size={16}/></a> : <p className="mt-5 whitespace-pre-wrap leading-relaxed text-[var(--muted)]">{selected.message}</p>}<p className="mt-6 text-xs font-bold text-[var(--muted)]">Posted {new Intl.DateTimeFormat("en-US",{dateStyle:"long",timeStyle:"short"}).format(new Date(selected.created_at))}</p></article>}
    </Sheet>
  </div>;
}
