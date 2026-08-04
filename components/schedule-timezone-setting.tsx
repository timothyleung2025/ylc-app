"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { ChevronDown, Clock3 } from "lucide-react";
import { useEffect, useState } from "react";
import { detectScheduleZone, scheduleZones, ScheduleZone } from "@/lib/schedule-timezone";

const zones = Object.keys(scheduleZones) as ScheduleZone[];
type Zone = ScheduleZone;

export function ScheduleTimezoneSetting() {
  const [zone, setZone] = useState<Zone>("Pacific");

  useEffect(() => {
    const saved = localStorage.getItem("ylc-schedule-timezone") as Zone | null;
    if (saved && zones.includes(saved)) setZone(saved);
    else setZone(detectScheduleZone());
  }, []);

  function update(next: Zone) {
    setZone(next);
    localStorage.setItem("ylc-schedule-timezone", next);
  }

  return (
    <section className="card flex items-center gap-2.5 p-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#fff0c8] text-[#9a651f]">
        <Clock3 size={17} />
      </span>
      <h2 className="flex-1 whitespace-nowrap text-base font-bold leading-tight">
        Schedule time zone
      </h2>
      <label className="relative shrink-0">
        <span className="sr-only">Schedule time zone</span>
        <select
          value={zone}
          onChange={(event) => update(event.target.value as Zone)}
          className="appearance-none rounded-xl border border-[var(--line)] bg-white py-2 pl-2.5 pr-7 text-xs font-bold text-[var(--charcoal-blue)] outline-none focus:ring-2 focus:ring-[var(--strong-cyan)]"
        >
          {zones.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <ChevronDown
          size={13}
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--muted)]"
        />
      </label>
    </section>
  );
}
