"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { ChevronDown, Clock3 } from "lucide-react";
import { useEffect, useState } from "react";

const zones = ["Pacific", "Mountain", "Central", "Eastern"] as const;
type Zone = (typeof zones)[number];

export function ScheduleTimezoneSetting() {
  const [zone, setZone] = useState<Zone>("Pacific");

  useEffect(() => {
    const saved = localStorage.getItem("ylc-schedule-timezone") as Zone | null;
    if (saved && zones.includes(saved)) setZone(saved);
  }, []);

  function update(next: Zone) {
    setZone(next);
    localStorage.setItem("ylc-schedule-timezone", next);
  }

  return <section className="card flex items-center gap-3 p-4">
    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#fff0c8] text-[#9a651f]"><Clock3 size={19}/></span>
    <div className="min-w-0 flex-1"><h2 className="font-bold">Schedule time zone</h2><p className="mt-0.5 text-xs text-[var(--muted)]">This updates every time shown on your Schedule.</p></div>
    <label className="relative shrink-0"><span className="sr-only">Schedule time zone</span><select value={zone} onChange={event=>update(event.target.value as Zone)} className="appearance-none rounded-xl border border-[var(--line)] bg-white py-2 pl-3 pr-8 text-xs font-extrabold text-[var(--charcoal-blue)] outline-none focus:ring-2 focus:ring-[var(--strong-cyan)]">{zones.map(item=><option key={item}>{item}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"/></label>
  </section>;
}
