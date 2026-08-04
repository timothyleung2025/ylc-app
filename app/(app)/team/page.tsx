"use client";
import { Crown, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { PageHeader, Pill, Sheet } from "@/components/ui";
import { useParticipant } from "@/components/participant-session";
import { getTeamById } from "@/src/data/ylcTeams";

export default function Team() {
  const { currentParticipant } = useParticipant();
  const team = getTeamById(currentParticipant!.teamId)!;
  const leaders = team.members.filter((member) => member.role === "leader");
  const members = team.members.filter((member) => member.role !== "leader");
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Your team"
        title={team.name}
      />
      <section className="rounded-[28px] bg-[var(--charcoal-blue)] p-5 text-white shadow-lg">
        <p className="text-sm text-white/70">
          {team.members.length} team members · Your role:{" "}
          <span className="capitalize">{currentParticipant!.role}</span>
        </p>
      </section>
      <section className="mt-6">
        <h2 className="mb-3 flex items-center gap-2 font-display text-2xl text-[var(--charcoal-blue)]">
          <Crown size={21} className="text-[#e99a37]" />
          Team leaders
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {leaders.length ? (
            leaders.map((person) => (
              <Person
                key={person.accessCode}
                name={person.name}
                email={person.email}
                isCurrent={person.accessCode === currentParticipant!.accessCode}
                leader
              />
            ))
          ) : (
            <div className="card p-4 text-sm text-[var(--muted)]">
              Team 0 is supported internally by YLC staff.
            </div>
          )}
        </div>
      </section>
      <section className="mt-7">
        <h2 className="mb-3 flex items-center gap-2 font-display text-2xl text-[var(--charcoal-blue)]">
          <UserRound size={21} className="text-[var(--dark-cyan)]" />
          Team members
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {members.map((person, i) => (
            <motion.div
              key={person.accessCode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.025 }}
            >
              <Person
                name={person.name}
                email={person.email}
                isCurrent={person.accessCode === currentParticipant!.accessCode}
              />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Person({
  name,
  email,
  isCurrent,
  leader = false,
}: {
  name: string;
  email: string;
  isCurrent: boolean;
  leader?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={`card flex h-full w-full items-center gap-3 p-3 text-left ${isCurrent ? "ring-2 ring-[var(--strong-cyan)]" : ""}`}
    >
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-full font-black ${leader ? "bg-[#fff0c8] text-[#9a651f]" : "bg-[#dff5f3] text-[var(--dark-cyan)]"}`}
      >
        {name
          .split(" ")
          .map((x) => x[0])
          .slice(0, 2)
          .join("")}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold">{name}</p>
        {isCurrent ? <Pill color="#dff5f3">You</Pill> : <p className="mt-1 text-[10px] text-[var(--muted)]">Tap for email</p>}
      </div>
    </button>
    <Sheet open={open} onClose={() => setOpen(false)} title={name}>
      <div className="py-4 text-center"><span className={`mx-auto grid size-14 place-items-center rounded-full text-lg font-black ${leader ? "bg-[#fff0c8] text-[#9a651f]" : "bg-[#dff5f3] text-[var(--dark-cyan)]"}`}>{name.split(" ").map(x=>x[0]).slice(0,2).join("")}</span><p className="mt-4 text-xs font-black uppercase tracking-wider text-[var(--muted)]">Email</p>{email ? <a href={`mailto:${email}`} className="mt-2 block break-all font-bold text-[var(--dark-cyan)] underline underline-offset-4">{email}</a> : <p className="mt-2 font-bold text-[var(--muted)]">Email not listed</p>}</div>
    </Sheet>
    </>
  );
}
