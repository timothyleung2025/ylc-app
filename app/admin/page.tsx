"use client";
import {
  BellPlus,
  CalendarClock,
  Check,
  ChevronDown,
  CircleGauge,
  Clock3,
  Eye,
  FileVideo,
  Image,
  LayoutDashboard,
  LogOut,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button, Progress } from "@/components/ui";
import { conferenceDays, schedule, teams } from "@/lib/mock-data";
const metrics = [
  {
    label: "Active participants",
    value: "124",
    note: "of 132 checked in",
    icon: Users,
    color: "#dcefe5",
  },
  {
    label: "Pending memories",
    value: "8",
    note: "3 added this hour",
    icon: Image,
    color: "#fff0c8",
  },
  {
    label: "Challenge submissions",
    value: "17",
    note: "68% of teams",
    icon: FileVideo,
    color: "#fae2df",
  },
  {
    label: "Schedule items",
    value: String(schedule.length),
    note: "across four days",
    icon: Clock3,
    color: "#e4e8f1",
  },
];
export default function Admin() {
  const [toast, setToast] = useState("");
  const act = (x: string) => {
    setToast(x);
    setTimeout(() => setToast(""), 2200);
  };
  return (
    <div className="min-h-dvh bg-[#f3f1eb] lg:flex">
      <aside className="hidden w-64 shrink-0 bg-[var(--forest)] p-6 text-white lg:flex lg:flex-col">
        <div className="flex items-center gap-3 font-display text-xl font-bold">
          <span className="grid size-10 place-items-center rounded-xl bg-white/10">
            <CircleGauge />
          </span>
          YLC Admin
        </div>
        <nav className="mt-10 space-y-2">
          <span className="flex items-center gap-3 rounded-xl bg-white/12 px-4 py-3 font-bold">
            <LayoutDashboard size={19} />
            Overview
          </span>
          {[
            [CalendarClock, "Schedule"],
            [BellPlus, "Announcements"],
            [Image, "Memories"],
            [FileVideo, "Submissions"],
            [Users, "Teams"],
          ].map(([I, l]) => {
            const Icon = I as typeof Users;
            return (
              <button
                key={l as string}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-white/65 hover:bg-white/8"
              >
                <Icon size={19} />
                {l as string}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-white/10 pt-5">
          <p className="text-sm font-bold">Jordan Lee</p>
          <p className="text-xs text-white/50">Conference organizer</p>
          <button className="mt-4 flex items-center gap-2 text-sm text-white/60">
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[var(--red)]">
              {conferenceDays[0].label}
            </p>
            <h1 className="font-display text-4xl font-bold text-[var(--forest)]">
              Good morning, Jordan
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Here’s what’s happening across YLC right now.
            </p>
          </div>
          <Button
            onClick={() => act("Announcement published")}
            className="flex items-center gap-2"
          >
            <BellPlus size={18} />
            New announcement
          </Button>
        </header>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((m) => (
            <div className="card p-5" key={m.label}>
              <div className="flex items-start justify-between">
                <span
                  className="grid size-11 place-items-center rounded-xl"
                  style={{ background: m.color }}
                >
                  <m.icon size={20} />
                </span>
                <span className="text-xs font-bold text-green-700">LIVE</span>
              </div>
              <p className="mt-5 text-sm font-bold text-[var(--muted)]">
                {m.label}
              </p>
              <p className="mt-1 font-display text-4xl font-bold">{m.value}</p>
              <p className="mt-1 text-xs text-stone-400">{m.note}</p>
            </div>
          ))}
        </section>
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <section className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-green-900/8 p-5">
              <div>
                <h2 className="font-display text-2xl font-bold">
                  Review queue
                </h2>
                <p className="text-sm text-[var(--muted)]">
                  Moderate memories and submissions
                </p>
              </div>
              <div className="flex gap-2">
                <button className="rounded-xl border p-2">
                  <Search size={18} />
                </button>
                <button className="flex items-center gap-2 rounded-xl border px-3 text-sm font-bold">
                  All <ChevronDown size={15} />
                </button>
              </div>
            </div>
            <div className="divide-y divide-green-900/8">
              {[
                {
                  type: "Memory",
                  name: "Aiden Park",
                  item: "Good leadership is making space…",
                  time: "4m",
                },
                {
                  type: "Video",
                  name: "Team Sky",
                  item: "Public Health Video Challenge",
                  time: "12m",
                },
                {
                  type: "Memory",
                  name: "Leila Kim",
                  item: "Our team turned a pile of sticky notes…",
                  time: "18m",
                },
                {
                  type: "Video",
                  name: "Team Gold",
                  item: "Public Health Video Challenge",
                  time: "26m",
                },
              ].map((r, i) => (
                <div key={i} className="flex flex-wrap items-center gap-4 p-4">
                  <span
                    className={`grid size-10 place-items-center rounded-xl ${r.type === "Video" ? "bg-[#fae2df]" : "bg-[#fff0c8]"}`}
                  >
                    {r.type === "Video" ? (
                      <FileVideo size={18} />
                    ) : (
                      <Image size={18} />
                    )}
                  </span>
                  <div className="min-w-40 flex-1">
                    <p className="text-sm font-bold">{r.name}</p>
                    <p className="truncate text-xs text-[var(--muted)]">
                      {r.item}
                    </p>
                  </div>
                  <span className="text-xs text-stone-400">{r.time}</span>
                  <button
                    onClick={() => act("Item approved")}
                    aria-label="Approve"
                    className="rounded-xl bg-green-100 p-2 text-green-700"
                  >
                    <Check size={17} />
                  </button>
                  <button
                    onClick={() => act("Item rejected")}
                    aria-label="Reject"
                    className="rounded-xl bg-red-100 p-2 text-red-700"
                  >
                    <X size={17} />
                  </button>
                  <button
                    aria-label="Preview"
                    className="rounded-xl bg-stone-100 p-2"
                  >
                    <Eye size={17} />
                  </button>
                </div>
              ))}
            </div>
          </section>
          <aside className="space-y-6">
            <section className="card p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold">
                  Team standings
                </h2>
                <ShieldCheck className="text-[var(--green)]" />
              </div>
              <div className="mt-4 space-y-3">
                {teams.map((t) => (
                  <div key={t.id}>
                    <div className="mb-1 flex items-center text-sm">
                      <span
                        className="mr-2 size-2.5 rounded-full"
                        style={{ background: t.color }}
                      />
                      <span className="flex-1 font-bold">{t.name}</span>
                      <button
                        onClick={() => act(`Removed 5 points from ${t.name}`)}
                        className="rounded p-1 hover:bg-stone-100"
                      >
                        <Minus size={14} />
                      </button>
                      <b className="w-10 text-center">{t.points}</b>
                      <button
                        onClick={() => act(`Added 5 points to ${t.name}`)}
                        className="rounded p-1 hover:bg-stone-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <Progress value={t.points / 4.5} color={t.color} />
                  </div>
                ))}
              </div>
            </section>
            <section className="card p-5">
              <h2 className="font-display text-2xl font-bold">
                Upcoming activities
              </h2>
              <div className="mt-4 space-y-4">
                {schedule
                  .filter((event) => event.day === 1)
                  .slice(1, 4)
                  .map((event) => [event.time, event.title, event.location])
                  .map((x) => (
                    <div className="flex gap-3" key={x[0]}>
                      <span className="grid size-10 place-items-center rounded-xl bg-[#fff0c8]">
                        <Clock3 size={17} />
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-bold">{x[1]}</p>
                        <p className="text-xs text-[var(--muted)]">{x[0]}</p>
                      </div>
                      <span className="text-xs font-bold text-[var(--red)]">
                        {x[2]}
                      </span>
                    </div>
                  ))}
              </div>
            </section>
          </aside>
        </div>
        <section className="card mt-6 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-bold">
                Schedule management
              </h2>
              <p className="text-sm text-[var(--muted)]">
                Next: {schedule[1].title} · {schedule[1].location} ·{" "}
                {schedule[1].time}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => act("Schedule editor opened")}
                variant="secondary"
              >
                Edit schedule item
              </Button>
              <Button
                onClick={() => act("Draft announcement created")}
                variant="secondary"
              >
                Create announcement
              </Button>
            </div>
          </div>
        </section>
      </main>
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-bold text-white shadow-xl">
          ✓ {toast}
        </div>
      )}
    </div>
  );
}
