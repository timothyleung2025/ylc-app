"use client";
import { getSupabase, hasSupabase } from "./supabase";
import { Announcement, AnnouncementView } from "./announcement-types";

const DATA_KEY = "ylc-dev-announcements";
const READ_KEY = "ylc-dev-announcement-reads";
const CHANNEL = "ylc-announcements";
const now = Date.now();
const seed: Announcement[] = [
  {
    id: "welcome-2026",
    title: "Welcome to YLC 2026",
    message:
      "Your pocket guide is ready. Check the schedule and meet your team before Day 1 begins.",
    category: "General",
    priority: "important",
    audience_type: "everyone",
    audience_team_id: null,
    related_schedule_event_id: "day-1-introduction-1",
    action_label: "View schedule",
    action_url: "/schedule",
    is_pinned: true,
    send_push: false,
    status: "published",
    published_at: new Date(now - 12 * 60000).toISOString(),
    expires_at: null,
    created_by: "development",
    created_at: new Date(now - 12 * 60000).toISOString(),
    updated_at: new Date(now - 12 * 60000).toISOString(),
    is_test: true,
  },
  {
    id: "presentations",
    title: "Team presentations are Saturday",
    message: "Final team presentations begin at 12:30 PM Pacific on Day 4.",
    category: "Reminder",
    priority: "normal",
    audience_type: "everyone",
    audience_team_id: null,
    related_schedule_event_id: "day-4-team-presentations-4",
    action_label: "Open challenge",
    action_url: "/challenge",
    is_pinned: false,
    send_push: false,
    status: "published",
    published_at: new Date(now - 60 * 60000).toISOString(),
    expires_at: null,
    created_by: "development",
    created_at: new Date(now - 60 * 60000).toISOString(),
    updated_at: new Date(now - 60 * 60000).toISOString(),
    is_test: true,
  },
];
function localData() {
  try {
    return JSON.parse(localStorage.getItem(DATA_KEY) || "") as Announcement[];
  } catch {
    localStorage.setItem(DATA_KEY, JSON.stringify(seed));
    return seed;
  }
}
function eligible(items: Announcement[], teamId: number, organizer = false) {
  const current = Date.now();
  return items
    .filter(
      (a) =>
        a.status === "published" &&
        (!a.expires_at || new Date(a.expires_at).getTime() > current) &&
        (a.audience_type === "everyone" ||
          (a.audience_type === "team" &&
            a.audience_team_id === String(teamId)) ||
          (a.audience_type === "organizers" && organizer)),
    )
    .sort(
      (a, b) =>
        Number(b.is_pinned) - Number(a.is_pinned) ||
        new Date(b.published_at || b.created_at).getTime() -
          new Date(a.published_at || a.created_at).getTime(),
    );
}
function reads(participantId: string) {
  try {
    return new Set(
      JSON.parse(
        localStorage.getItem(`${READ_KEY}:${participantId}`) || "[]",
      ) as string[],
    );
  } catch {
    return new Set<string>();
  }
}
export async function fetchAnnouncements(
  participantId: string,
  teamId: number,
): Promise<AnnouncementView[]> {
  const supabase = getSupabase();
  if (!supabase) {
    const seen = reads(participantId);
    return eligible(localData(), teamId).map((a) => ({
      ...a,
      isRead: seen.has(a.id),
    }));
  }
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Supabase Auth is required for production announcements");
  participantId = user.id;
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("status", "published")
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false });
  if (error) throw error;
  const { data: readRows } = await supabase
    .from("announcement_reads")
    .select("announcement_id")
    .eq("participant_id", participantId);
  const seen = new Set((readRows || []).map((row) => row.announcement_id));
  return ((data || []) as Announcement[]).map((a) => ({
    ...a,
    isRead: seen.has(a.id),
  }));
}
export async function markAnnouncementRead(
  announcementId: string,
  participantId: string,
) {
  const supabase = getSupabase();
  if (!supabase) {
    const seen = reads(participantId);
    seen.add(announcementId);
    localStorage.setItem(
      `${READ_KEY}:${participantId}`,
      JSON.stringify([...seen]),
    );
    return;
  }
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Supabase Auth is required");
  const { error } = await supabase
    .from("announcement_reads")
    .upsert(
      { announcement_id: announcementId, participant_id: user.id },
      { onConflict: "announcement_id,participant_id" },
    );
  if (error) throw error;
}
export async function markAllAnnouncementsRead(
  ids: string[],
  participantId: string,
) {
  await Promise.all(ids.map((id) => markAnnouncementRead(id, participantId)));
}
export function subscribeToAnnouncements(onChange: () => void) {
  const supabase = getSupabase();
  if (supabase) {
    const channel = supabase
      .channel("announcement-feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "announcements" },
        onChange,
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }
  const channel = new BroadcastChannel(CHANNEL);
  channel.onmessage = onChange;
  const storage = (event: StorageEvent) => {
    if (event.key === DATA_KEY) onChange();
  };
  window.addEventListener("storage", storage);
  return () => {
    channel.close();
    window.removeEventListener("storage", storage);
  };
}
export async function saveAnnouncement(
  input: Partial<Announcement> &
    Pick<
      Announcement,
      "title" | "message" | "category" | "priority" | "audience_type" | "status"
    >,
) {
  const supabase = getSupabase();
  if (supabase) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("Admin authentication is required");
    const payload = {
      ...input,
      created_by: input.created_by || user.id,
      published_at:
        input.status === "published"
          ? input.published_at || new Date().toISOString()
          : null,
    };
    const { data, error } = input.id
      ? await supabase
          .from("announcements")
          .update(payload)
          .eq("id", input.id)
          .select()
          .single()
      : await supabase.from("announcements").insert(payload).select().single();
    if (error) throw error;
    return data as Announcement;
  }
  if (process.env.NODE_ENV !== "development")
    throw new Error("Supabase is not configured");
  const items = localData();
  const stamp = new Date().toISOString();
  const item = {
    id: input.id || crypto.randomUUID(),
    title: input.title,
    message: input.message,
    category: input.category,
    priority: input.priority,
    audience_type: input.audience_type,
    audience_team_id: input.audience_team_id || null,
    related_schedule_event_id: input.related_schedule_event_id || null,
    action_label: input.action_label || null,
    action_url: input.action_url || null,
    is_pinned: Boolean(input.is_pinned),
    send_push: false,
    status: input.status,
    published_at: input.status === "published" ? stamp : null,
    expires_at: input.expires_at || null,
    created_by: "development-admin",
    created_at: stamp,
    updated_at: stamp,
    is_test: true,
  } satisfies Announcement;
  const next = input.id
    ? items.map((a) => (a.id === input.id ? item : a))
    : [item, ...items];
  localStorage.setItem(DATA_KEY, JSON.stringify(next));
  new BroadcastChannel(CHANNEL).postMessage(item);
  return item;
}
export async function archiveAnnouncement(id: string) {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase
      .from("announcements")
      .update({ status: "archived" })
      .eq("id", id);
    if (error) throw error;
    return;
  }
  const next = localData().map((a) =>
    a.id === id
      ? {
          ...a,
          status: "archived" as const,
          updated_at: new Date().toISOString(),
        }
      : a,
  );
  localStorage.setItem(DATA_KEY, JSON.stringify(next));
  new BroadcastChannel(CHANNEL).postMessage(id);
}
export async function deleteAnnouncement(id: string) {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return;
  }
  localStorage.setItem(
    DATA_KEY,
    JSON.stringify(localData().filter((a) => a.id !== id)),
  );
  new BroadcastChannel(CHANNEL).postMessage(id);
}
export async function fetchAdminAnnouncements() {
  const supabase = getSupabase();
  if (!supabase) return localData();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Announcement[];
}
export function announcementMode() {
  return hasSupabase() ? "supabase" : "development fallback";
}
