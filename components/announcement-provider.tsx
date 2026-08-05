"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Announcement } from "@/lib/announcement-types";
import { fetchAnnouncements, subscribeToAnnouncements } from "@/lib/announcement-service";
import { useParticipant } from "./participant-session";

type Value = {
  announcements: Announcement[];
  loading: boolean;
  error: string;
  unreadCount: number;
  refresh: () => Promise<void>;
  isRead: (id: string) => boolean;
  markRead: (id: string) => void;
  markAllRead: () => void;
};
const Context = createContext<Value | null>(null);

export function AnnouncementProvider({ children }: { children: React.ReactNode }) {
  const { currentParticipant } = useParticipant();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [readsReady, setReadsReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<Announcement | null>(null);
  const storageKey = `ylc-announcement-reads:${currentParticipant?.accessCode || "guest"}`;

  const refresh = useCallback(async () => {
    try { setError(""); setAnnouncements(await fetchAnnouncements()); }
    catch (issue) { setError(issue instanceof Error ? issue.message : "Could not load announcements."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    try { setReadIds(new Set(JSON.parse(localStorage.getItem(storageKey) || "[]") as string[])); }
    catch { setReadIds(new Set()); }
    setReadsReady(true);
  }, [storageKey]);

  useEffect(() => {
    void refresh();
    return subscribeToAnnouncements((inserted) => {
      void refresh();
      if (inserted) {
        setToast(inserted);
        window.setTimeout(() => setToast(null), 5500);
      }
    });
  }, [refresh]);

  function saveReads(next: Set<string>) {
    setReadIds(next);
    localStorage.setItem(storageKey, JSON.stringify([...next]));
  }
  function markRead(id: string) { const next = new Set(readIds); next.add(id); saveReads(next); }
  function markAllRead() { saveReads(new Set(announcements.map((item) => item.id))); }

  const unreadCount = readsReady ? announcements.filter((item) => !readIds.has(item.id)).length : 0;
  return <Context.Provider value={{ announcements, loading, error, unreadCount, refresh, isRead: (id) => readIds.has(id), markRead, markAllRead }}>{children}<AnimatePresence>{toast&&<motion.div initial={{y:-110,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-120,opacity:0}} transition={{duration:.32,ease:[.22,1,.36,1]}} drag="y" dragConstraints={{top:-140,bottom:0}} dragElastic={{top:.2,bottom:0}} onDragEnd={(_,info)=>{if(info.offset.y < -45 || info.velocity.y < -350)setToast(null)}} className="fixed left-4 right-4 top-[calc(1rem+env(safe-area-inset-top))] z-[70] mx-auto max-w-md touch-none cursor-grab rounded-2xl bg-[var(--charcoal-blue)] text-white shadow-2xl active:cursor-grabbing"><Link href="/announcements" onClick={()=>setToast(null)} className="block p-4"><p className="text-[10px] font-black uppercase tracking-wider text-[#8fe0dc]">New announcement · From: {toast.sender||"YLC"} · swipe up to dismiss</p><p className="mt-1 font-bold">{toast.title}</p></Link></motion.div>}</AnimatePresence></Context.Provider>;
}

export function useAnnouncements() {
  const value = useContext(Context);
  if (!value) throw new Error("useAnnouncements must be used inside AnnouncementProvider");
  return value;
}
