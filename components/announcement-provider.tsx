"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Announcement } from "@/lib/announcement-types";
import { fetchAnnouncements, subscribeToAnnouncements } from "@/lib/announcement-service";

type Value = { announcements: Announcement[]; loading: boolean; error: string; unreadCount: number; refresh: () => Promise<void> };
const Context = createContext<Value | null>(null);

export function AnnouncementProvider({ children }: { children: React.ReactNode }) {
  const [announcements,setAnnouncements]=useState<Announcement[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState(""); const [toast,setToast]=useState<Announcement|null>(null);
  const refresh=useCallback(async()=>{try{setError("");setAnnouncements(await fetchAnnouncements())}catch(issue){setError(issue instanceof Error?issue.message:"Could not load announcements.")}finally{setLoading(false)}},[]);
  useEffect(()=>{void refresh();return subscribeToAnnouncements((inserted)=>{void refresh();if(inserted){setToast(inserted);window.setTimeout(()=>setToast(null),4500)}})},[refresh]);
  return <Context.Provider value={{announcements,loading,error,unreadCount:0,refresh}}>{children}{toast&&<Link href="/announcements" className="fixed left-4 right-4 top-[calc(1rem+env(safe-area-inset-top))] z-[70] mx-auto max-w-md rounded-2xl bg-[var(--charcoal-blue)] p-4 text-white shadow-2xl"><p className="text-[10px] font-black uppercase tracking-wider text-[#8fe0dc]">New announcement</p><p className="mt-1 font-bold">{toast.title}</p></Link>}</Context.Provider>;
}
export function useAnnouncements(){const value=useContext(Context);if(!value)throw new Error("useAnnouncements must be used inside AnnouncementProvider");return value}
