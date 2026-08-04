"use client";
import {
  ArrowRight,
  CalendarDays,
  Lightbulb,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParticipant } from "@/components/participant-session";
import { getTeamById } from "@/src/data/ylcTeams";

const actions = [
  {
    href: "/schedule",
    label: "View Today’s Schedule",
    icon: CalendarDays,
    color: "bg-[#dff5f3]",
  },
  {
    href: "/challenge",
    label: "Open Team Challenge",
    icon: Lightbulb,
    color: "bg-[#fff0c8]",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    color: "bg-[#e8eef0]",
  },
];

export default function Home() {
  const { currentParticipant } = useParticipant();
  const team = getTeamById(currentParticipant!.teamId)!;
  const leaders = team.members.filter((member) => member.role === "leader");
  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-5">
        <p className="pr-11 text-xs font-extrabold uppercase tracking-[.18em] text-[var(--dark-cyan)]">
          Hi, {currentParticipant!.name.split(" ")[0]}!
        </p>
        <h1 className="mt-1 text-left font-display text-4xl leading-[.95] text-[var(--charcoal-blue)] md:text-5xl">
          Your YLC
          <br />
          pocket guide
        </h1>
      </header>
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[30px] bg-[var(--charcoal-blue)] p-6 text-white shadow-xl md:p-8"
      >
        <div className="absolute -right-12 -top-12 size-44 rounded-full bg-[var(--strong-cyan)]/20" />
        <Sparkles className="mb-8 text-[#f0a34a]" />
        <p className="text-xs font-black uppercase tracking-[.2em] text-[#8fe0dc]">
          Welcome to YLC 2026
        </p>
        <h2 className="mt-2 font-display text-5xl leading-none md:text-6xl">
          Break the
          <br />
          Algorithm
        </h2>
        <p className="mt-5 font-bold text-white/75">
          August 5–8, 2026 · Virtual
        </p>
      </motion.section>
      <section className="card mt-5 p-5">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--strong-cyan)]/20 text-[var(--dark-cyan)]">
            <Users />
          </span>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--dark-cyan)]">
              Your team
            </p>
            <h2 className="whitespace-nowrap font-display text-2xl text-[var(--charcoal-blue)]">
              You’re on {team.name}
            </h2>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-[#fff7e7] p-4">
            <p className="text-xs font-black uppercase tracking-wider text-[#9a651f]">
              Team leaders
            </p>
            <p className="mt-1 font-bold">
              {leaders.length
                ? leaders.map((x) => x.name).join(" · ")
                : "YLC Staff"}
            </p>
          </div>
          <div className="rounded-2xl bg-[var(--charcoal-blue)]/5 p-4">
            <p className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">
              Teammates
            </p>
            <p className="mt-1 font-bold">
              {team.members.length} people on your team
            </p>
          </div>
        </div>
        <Link
          href="/team"
          className="mt-4 inline-flex items-center gap-1 text-sm font-extrabold text-[var(--dark-cyan)]"
        >
          Meet the whole team <ArrowRight size={16} />
        </Link>
      </section>
      <section className="mt-6">
        <h2 className="mb-3 font-display text-2xl text-[var(--charcoal-blue)]">
          Where to?
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {actions.map(({ href, label, icon: Icon, color }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
            >
              <Link
                href={href}
                className="card flex min-h-24 items-center gap-3 p-4 transition hover:-translate-y-1"
              >
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-2xl ${color}`}
                >
                  <Icon size={21} />
                </span>
                <span className="font-bold leading-tight">{label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
