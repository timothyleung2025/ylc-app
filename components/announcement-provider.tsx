"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { AnnouncementView } from "@/lib/announcement-types";
import {
  fetchAnnouncements,
  markAllAnnouncementsRead,
  markAnnouncementRead,
  subscribeToAnnouncements,
} from "@/lib/announcement-service";
import { useParticipant } from "./participant-session";

type Value = {
  announcements: AnnouncementView[];
  loading: boolean;
  error: string;
  unreadCount: number;
  refresh: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
};
const Context = createContext<Value | null>(null);
export function AnnouncementProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentParticipant } = useParticipant();
  const [announcements, setAnnouncements] = useState<AnnouncementView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<AnnouncementView | null>(null);
  const known = useRef(new Set<string>());
  const refresh = useCallback(async () => {
    if (!currentParticipant) return;
    try {
      setError("");
      const next = await fetchAnnouncements(
        currentParticipant.accessCode,
        currentParticipant.teamId,
      );
      setAnnouncements(next);
      known.current = new Set(next.map((a) => a.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load announcements");
    } finally {
      setLoading(false);
    }
  }, [currentParticipant]);
  useEffect(() => {
    refresh();
    return subscribeToAnnouncements(async () => {
      if (!currentParticipant) return;
      try {
        const next = await fetchAnnouncements(
          currentParticipant.accessCode,
          currentParticipant.teamId,
        );
        const added = next.find((a) => !known.current.has(a.id));
        setAnnouncements(next);
        known.current = new Set(next.map((a) => a.id));
        if (added) {
          setToast(added);
          window.setTimeout(() => setToast(null), 5000);
        }
      } catch {}
    });
  }, [currentParticipant, refresh]);
  async function markRead(id: string) {
    if (!currentParticipant) return;
    await markAnnouncementRead(id, currentParticipant.accessCode);
    setAnnouncements((items) =>
      items.map((a) => (a.id === id ? { ...a, isRead: true } : a)),
    );
  }
  async function markAllRead() {
    if (!currentParticipant) return;
    await markAllAnnouncementsRead(
      announcements.map((a) => a.id),
      currentParticipant.accessCode,
    );
    setAnnouncements((items) => items.map((a) => ({ ...a, isRead: true })));
  }
  const value = {
    announcements,
    loading,
    error,
    unreadCount: announcements.filter((a) => !a.isRead).length,
    refresh,
    markRead,
    markAllRead,
  };
  return (
    <Context.Provider value={value}>
      {children}
      {toast && (
        <Link
          href={`/announcements/${toast.id}`}
          className="fixed left-4 right-4 top-[calc(1rem+env(safe-area-inset-top))] z-[70] mx-auto max-w-md rounded-2xl bg-[var(--charcoal-blue)] p-4 text-white shadow-2xl"
        >
          <p className="text-[10px] font-black uppercase tracking-wider text-[#8fe0dc]">
            New announcement
          </p>
          <p className="mt-1 font-bold">{toast.title}</p>
        </Link>
      )}
    </Context.Provider>
  );
}
export function useAnnouncements() {
  const value = useContext(Context);
  if (!value)
    throw new Error(
      "useAnnouncements must be used inside AnnouncementProvider",
    );
  return value;
}
