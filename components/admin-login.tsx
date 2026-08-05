"use client";
import { FormEvent, useState } from "react";

export function AdminLogin({ onSuccess }: { onSuccess: (token: string) => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      onSuccess(result.token);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not sign in.");
    } finally { setLoading(false); }
  }
  return <main className="paper-texture grid min-h-dvh place-items-center bg-[var(--charcoal-blue)] p-5"><form onSubmit={submit} className="card w-full max-w-sm p-6"><p className="text-xs font-black uppercase tracking-[.18em] text-[var(--dark-cyan)]">YLC organizers</p><h1 className="mt-2 font-display text-4xl text-[var(--charcoal-blue)]">Admin access</h1><p className="mt-2 text-sm text-[var(--muted)]">Enter the shared organizer code.</p><label className="mt-6 block text-sm font-bold">Access code<input type="password" autoComplete="current-password" value={code} onChange={(event)=>setCode(event.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border bg-white px-4 outline-none focus:ring-2 focus:ring-[var(--strong-cyan)]" /></label>{error&&<p className="mt-3 rounded-xl bg-[#f5dfdf] p-3 text-sm font-bold text-[#965555]">{error}</p>}<button disabled={loading||!code} className="mt-5 min-h-12 w-full rounded-2xl bg-[var(--dark-cyan)] font-bold text-white disabled:opacity-50">{loading?"Checking…":"Enter dashboard"}</button></form></main>;
}
