"use client";
import { getSupabase } from "./supabase";
import type { Announcement } from "./announcement-types";

export async function fetchAnnouncements(): Promise<Announcement[]> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase.from("announcements").select("*").order("is_pinned", { ascending: false }).order("created_at", { ascending: false });
  if (error) throw error;
  return data as Announcement[];
}

export function subscribeToAnnouncements(onChange: (inserted?: Announcement) => void) {
  const supabase = getSupabase();
  if (!supabase) return () => undefined;
  const channel = supabase.channel("announcements-live").on("postgres_changes", { event: "*", schema: "public", table: "announcements" }, (payload) => onChange(payload.eventType === "INSERT" ? payload.new as Announcement : undefined)).subscribe();
  return () => { void supabase.removeChannel(channel); };
}
