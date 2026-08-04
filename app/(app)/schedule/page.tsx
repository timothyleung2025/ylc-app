"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { CalendarClock, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui";

type Category = "Session" | "Keynote" | "Team" | "Break" | "Other";
type ZoneLabel = "Pacific" | "Mountain" | "Central" | "Eastern";
type SourceEvent = { time: string; title: string };

const zones: Record<ZoneLabel, string> = {
  Pacific: "America/Los_Angeles",
  Mountain: "America/Denver",
  Central: "America/Chicago",
  Eastern: "America/New_York",
};
const filters: ("All" | Category)[] = ["All", "Session", "Keynote", "Team", "Break"];
const colors: Record<Category, { badge: string; border: string; icon: string; tint: string }> = {
  Session: { badge: "#e5edf1", border: "#9db3bd", icon: "#e5edf1", tint: "#fbfcfd" },
  Keynote: { badge: "#ebe4f4", border: "#a98fc1", icon: "#ebe4f4", tint: "#fdfbff" },
  Team: { badge: "#dcefe8", border: "#68aa91", icon: "#dcefe8", tint: "#fbfefd" },
  Break: { badge: "#fff1bf", border: "#d8b753", icon: "#fff1bf", tint: "#fffefa" },
  Other: { badge: "#eeeeec", border: "#aaa9a3", icon: "#eeeeec", tint: "#fdfdfc" },
};

const days: { date: string; short: string; label: string; events: SourceEvent[] }[] = [
  { date: "2026-08-05", short: "Wed, Aug 5", label: "Day 1", events: [
    {time:"10:00 AM",title:"Introduction"},{time:"10:15 AM",title:"Meet Your Team"},{time:"11:00 AM",title:"Keynote: Camille Chu"},{time:"11:15 AM",title:"Keynote: Dr. Samuel So"},{time:"12:00 PM",title:"Lunch"},{time:"1:00 PM",title:"Keynote: Sa Nguyen"},{time:"2:00 PM",title:"Team Activity"},{time:"2:30 PM",title:"Break"},{time:"3:00 PM",title:"Team Challenge Introduction"},{time:"3:15 PM",title:"Working Session"},{time:"4:00 PM",title:"Keynote: Miyu & Timothy"},{time:"5:00 PM",title:"Closing"},
  ]},
  { date: "2026-08-06", short: "Thurs, Aug 6", label: "Day 2", events: [
    {time:"10:00 AM",title:"Introduction"},{time:"10:15 AM",title:"Team Activity"},{time:"11:00 AM",title:"Working Session"},{time:"12:30 PM",title:"Lunch"},{time:"1:30 PM",title:"Keynote: Judy Huynh"},{time:"2:30 PM",title:"Break"},{time:"3:00 PM",title:"Keynote: Austin Pliler"},{time:"4:00 PM",title:"Team HBV Presentation"},{time:"4:30 PM",title:"Working Session"},{time:"5:00 PM",title:"Closing"},
  ]},
  { date: "2026-08-07", short: "Fri, Aug 7", label: "Day 3", events: [
    {time:"10:00 AM",title:"Introduction"},{time:"10:15 AM",title:"Keynote: Dr. Crystal Hlaing Reece"},{time:"11:15 AM",title:"Team Activity"},{time:"12:00 PM",title:"Lunch"},{time:"1:00 PM",title:"Keynote: Koy Suntichotinun"},{time:"2:00 PM",title:"Break"},{time:"2:30 PM",title:"Student Panel"},{time:"3:30 PM",title:"Working Session"},{time:"5:00 PM",title:"Closing"},
  ]},
  { date: "2026-08-08", short: "Sat, Aug 8", label: "Day 4", events: [
    {time:"10:00 AM",title:"Introduction"},{time:"10:30 AM",title:"Final Working Session"},{time:"11:30 AM",title:"Lunch"},{time:"12:30 PM",title:"Team Presentations"},{time:"1:20 PM",title:"Break"},{time:"1:30 PM",title:"Team Presentations"},{time:"2:20 PM",title:"Judges’ Deliberation"},{time:"2:30 PM",title:"Announcement of Winners and Closing Remarks"},{time:"3:00 PM",title:"The End"},
  ]},
];

function categoryFor(title: string): Category {
  if (title.includes("Keynote")) return "Keynote";
  if (title.includes("Lunch")) return "Break";
  if (title.includes("Break")) return "Break";
  if (title.includes("Team") || title.includes("Working Session")) return "Team";
  if (["Presentation", "Judges", "Winners", "Closing Remarks"].some(word => title.includes(word))) return "Session";
  return "Session";
}

function sourceDate(date: string, time: string) {
  const [, hourText, minuteText, period] = time.match(/(\d+):(\d+)\s(AM|PM)/)!;
  let hour = Number(hourText) % 12;
  if (period === "PM") hour += 12;
  return new Date(`${date}T${String(hour).padStart(2,"0")}:${minuteText}:00-07:00`);
}

function displayTime(date: Date, zone: ZoneLabel) {
  return new Intl.DateTimeFormat("en-US", { timeZone: zones[zone], hour: "numeric", minute: "2-digit" }).format(date);
}

export default function Schedule() {
  const today = useMemo(() => new Intl.DateTimeFormat("en-CA", { timeZone: zones.Pacific, year:"numeric", month:"2-digit", day:"2-digit" }).format(new Date()), []);
  const todayIndex = days.findIndex(day => day.date === today);
  const [selected, setSelected] = useState(todayIndex >= 0 ? todayIndex : 0);
  const [filter, setFilter] = useState<"All" | Category>("All");
  const [zone, setZone] = useState<ZoneLabel>("Pacific");

  useEffect(() => {
    const saved = localStorage.getItem("ylc-schedule-timezone") as ZoneLabel | null;
    if (saved && saved in zones) setZone(saved);
  }, []);

  function chooseZone(next: ZoneLabel) {
    setZone(next);
    localStorage.setItem("ylc-schedule-timezone", next);
  }

  const day = days[selected];
  const agenda = day.events.map((event, index) => {
    const start = sourceDate(day.date, event.time);
    const end = index < day.events.length - 1 ? sourceDate(day.date, day.events[index + 1].time) : new Date(start.getTime() + 30 * 60_000);
    return { ...event, start, end, duration: Math.round((end.getTime() - start.getTime()) / 60_000), category: categoryFor(event.title) };
  });
  const shown = filter === "All" ? agenda : agenda.filter(event => event.category === filter);

  return <div className="mx-auto max-w-3xl">
    <PageHeader eyebrow="August 5–8, 2026" title="Schedule" />

    <div className="card mb-4 flex items-center justify-between gap-3 p-3">
      <p className="text-xs font-black uppercase tracking-wider text-[var(--dark-cyan)]">Time zone</p>
      <label className="relative shrink-0"><span className="sr-only">Time Zone</span><select value={zone} onChange={event=>chooseZone(event.target.value as ZoneLabel)} className="appearance-none rounded-xl border border-[var(--line)] bg-white py-2 pl-3 pr-8 text-xs font-extrabold text-[var(--charcoal-blue)] outline-none focus:ring-2 focus:ring-[var(--strong-cyan)]">{Object.keys(zones).map(label=><option key={label}>{label}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"/></label>
    </div>

    <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-2">{days.map((item,index)=><button key={item.date} onClick={event=>{setSelected(index);event.currentTarget.parentElement?.scrollTo({left:event.currentTarget.offsetLeft-16,behavior:"smooth"})}} className={`min-w-28 rounded-2xl border px-4 py-3 text-left transition ${selected===index?"border-[var(--charcoal-blue)] bg-[var(--charcoal-blue)] text-white shadow-lg":"border-[var(--line)] bg-white"}`}><span className="block text-xs font-black">{item.label}{item.date===today?" · Today":""}</span><span className="mt-1 block text-[11px] opacity-70">{item.short}</span></button>)}</div>

    <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1">{filters.map(item=><button key={item} onClick={event=>{setFilter(item);event.currentTarget.parentElement?.scrollTo({left:event.currentTarget.offsetLeft-16,behavior:"smooth"})}} className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-extrabold transition ${filter===item?"border-[var(--dark-cyan)] bg-[var(--dark-cyan)] text-white":"border-[var(--line)] bg-white text-[var(--muted)]"}`}>{item}</button>)}</div>

    <section>
      <div className="mb-3 flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-[var(--dark-cyan)]">{day.label}</p><h2 className="font-display text-3xl text-[var(--charcoal-blue)]">{day.short}</h2></div>{day.date===today&&<span className="rounded-full bg-[#fff0c8] px-3 py-1 text-xs font-black text-[#8d5e1d]">Today</span>}</div>
      <div className={filter === "All" ? "space-y-1.5" : "space-y-2.5"}>{shown.map(event => {
        const palette = colors[event.category];
        const calendarHeight = Math.min(168, Math.max(62, event.duration * 1.5));
        return <article key={`${event.time}-${event.title}`} className="relative flex gap-3 overflow-hidden rounded-2xl border border-[var(--line)] border-l-4 p-3 shadow-sm" style={{ minHeight: filter === "All" ? calendarHeight : 76, borderLeftColor: palette.border, backgroundColor: palette.tint }}>
          <div className="w-[5rem] shrink-0 border-r border-[var(--line)] pr-2"><p className="whitespace-nowrap text-xs font-black leading-tight text-[var(--charcoal-blue)]">{displayTime(event.start,zone)}</p><p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-[var(--muted)]">{zone}</p><p className="mt-2 whitespace-nowrap text-[9px] text-[var(--muted)]">to {displayTime(event.end,zone)}</p></div>
          <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-[var(--charcoal-blue)]" style={{backgroundColor:palette.badge}}>{event.category}</span><span className="text-[10px] font-bold text-[var(--muted)]">{event.duration} min</span></div><h3 className="mt-2 font-display text-lg leading-tight text-[var(--charcoal-blue)]">{event.title}</h3></div>
        </article>;
      })}</div>
      {shown.length===0&&<div className="card p-8 text-center"><CalendarClock className="mx-auto text-[var(--dark-cyan)]"/><p className="mt-3 font-bold">No {filter.toLowerCase()} events this day.</p><button onClick={()=>setFilter("All")} className="mt-2 text-sm font-extrabold text-[var(--dark-cyan)] underline underline-offset-4">Show all events</button></div>}
    </section>
  </div>;
}
