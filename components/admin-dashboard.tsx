"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import { FormEvent, useCallback, useEffect, useState } from "react";
import { LogOut, Pencil, Pin, PinOff, Trash2, X } from "lucide-react";
import type { Announcement, AnnouncementCategory } from "@/lib/announcement-types";

const categories: { value: AnnouncementCategory; label: string }[] = [
  { value: "general", label: "General" },
  { value: "reminder", label: "Reminder" },
  { value: "schedule_update", label: "Schedule update" },
  { value: "urgent", label: "Urgent" },
];

export function AdminDashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [items, setItems] = useState<Announcement[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<AnnouncementCategory>("general");
  const [pinned, setPinned] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/announcements", { cache: "no-store", headers: { Authorization: `Bearer ${token}` } });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    setItems(result);
  }, [token]);
  useEffect(() => { load().catch((issue) => setError(issue.message)); }, [load]);

  function resetForm() {
    setEditingId(null); setTitle(""); setMessage("");
    setCategory("general"); setPinned(false); setError("");
  }
  function edit(item: Announcement) {
    setEditingId(item.id); setTitle(item.title); setMessage(item.message);
    setCategory(item.category); setPinned(item.is_pinned); setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError("");
    try {
      const response = await fetch("/api/admin/announcements", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: editingId, title, message, category, is_pinned: pinned }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      resetForm(); await load();
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not save announcement.");
    } finally { setSaving(false); }
  }
  async function updatePin(id: string, is_pinned: boolean) {
    const response = await fetch("/api/admin/announcements", { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ id, is_pinned }) });
    if (!response.ok) setError((await response.json()).error); else await load();
  }
  async function remove(id: string) {
    if (!confirm("Delete this announcement?")) return;
    const response = await fetch(`/api/admin/announcements?id=${encodeURIComponent(id)}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) setError((await response.json()).error);
    else { if (editingId === id) resetForm(); await load(); }
  }
  function logout() { onLogout(); }

  return <main className="min-h-dvh bg-[var(--cream)] p-4 safe-top md:p-8"><div className="mx-auto max-w-3xl"><header className="mb-6 flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.18em] text-[var(--dark-cyan)]">YLC organizers</p><h1 className="font-display text-4xl text-[var(--charcoal-blue)]">Announcements</h1></div><button onClick={logout} className="grid size-10 place-items-center rounded-full bg-white shadow-sm" aria-label="Log out"><LogOut size={17}/></button></header><form onSubmit={submit} className="card space-y-4 p-5"><div className="flex items-center justify-between"><h2 className="font-display text-2xl text-[var(--charcoal-blue)]">{editingId ? "Edit announcement" : "New announcement"}</h2>{editingId&&<button type="button" onClick={resetForm} className="flex items-center gap-1 text-xs font-bold text-[var(--muted)]"><X size={14}/>Cancel</button>}</div><label className="block text-sm font-bold">Title<input value={title} onChange={e=>setTitle(e.target.value)} required className="mt-2 min-h-11 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-[var(--strong-cyan)]"/></label><label className="block text-sm font-bold">Message<textarea value={message} onChange={e=>setMessage(e.target.value)} required className="mt-2 min-h-28 w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-[var(--strong-cyan)]"/></label><label className="block text-sm font-bold">Category<select value={category} onChange={e=>setCategory(e.target.value as AnnouncementCategory)} className="mt-2 min-h-11 w-full rounded-xl border bg-white px-3">{categories.map(item=><option key={item.value} value={item.value}>{item.label}</option>)}</select></label><label className="flex items-center justify-between text-sm font-bold">Pin announcement<input type="checkbox" checked={pinned} onChange={e=>setPinned(e.target.checked)} className="size-5 accent-[var(--dark-cyan)]"/></label>{error&&<p className="rounded-xl bg-[#f5dfdf] p-3 text-sm font-bold text-[#965555]">{error}</p>}<button disabled={saving} className="min-h-12 w-full rounded-xl bg-[var(--dark-cyan)] font-bold text-white disabled:opacity-50">{saving ? "Saving…" : editingId ? "Save changes" : "Publish announcement"}</button></form><section className="mt-7"><h2 className="mb-3 font-display text-2xl text-[var(--charcoal-blue)]">Published</h2><div className="space-y-3">{items.map(item=><article key={item.id} className="card p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="flex items-center gap-2 text-[10px] font-black uppercase text-[var(--dark-cyan)]"><span>{item.category.replace("_"," ")}</span>{item.is_pinned&&<Pin size={12}/>}</div><h3 className="mt-1 font-bold">{item.title}</h3><p className="mt-1 text-sm text-[var(--muted)]">{item.message}</p></div><div className="flex shrink-0 gap-1"><button onClick={()=>edit(item)} className="grid size-9 place-items-center rounded-xl border" aria-label="Edit"><Pencil size={15}/></button><button onClick={()=>updatePin(item.id,!item.is_pinned)} className="grid size-9 place-items-center rounded-xl border" aria-label={item.is_pinned?"Unpin":"Pin"}>{item.is_pinned?<PinOff size={15}/>:<Pin size={15}/>}</button><button onClick={()=>remove(item.id)} className="grid size-9 place-items-center rounded-xl border text-[#965555]" aria-label="Delete"><Trash2 size={15}/></button></div></div></article>)}{!items.length&&!error&&<p className="card p-6 text-center text-sm text-[var(--muted)]">No announcements yet.</p>}</div></section></div></main>;
}
