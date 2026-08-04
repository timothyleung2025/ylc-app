"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useParticipant } from "./participant-session";
import { Button, Field } from "./ui";

export function AccessCodeScreen() {
  const router = useRouter();
  const { signIn } = useParticipant();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!signIn(code)) {
      setError("We couldn’t find that code. Check it and try again, or ask a conference organizer for help.");
      return;
    }
    setError("");
    router.replace("/home");
  }

  return <main className="paper-texture relative grid min-h-dvh overflow-hidden">
    <section className="hidden">
      <div className="absolute -right-24 -top-20 size-96 rounded-full bg-[var(--strong-cyan)]/20 blur-2xl" />
      <p className="text-sm font-bold tracking-wide">ASIAN LIVER CENTER · STANFORD</p>
      <div className="relative">
        <p className="mb-4 text-sm font-bold uppercase tracking-[.22em] text-[#8fe0dc]">Youth Leadership Conference 2026</p>
        <h1 className="font-display max-w-xl text-7xl leading-[.96]">YLC 2026</h1>
        <p className="mt-7 max-w-md text-lg leading-relaxed text-white/70">Your pocket guide to the conference, your team, and the challenge.</p>
      </div>
      <div className="flex gap-3 text-sm text-white/65"><span>Explore.</span><span>Connect.</span><span>Make an impact.</span></div>
    </section>

    <section className="relative flex min-h-dvh items-center justify-center px-5 py-10">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="mb-8"><h1 className="font-display text-6xl leading-none text-[var(--forest)]">YLC 2026</h1></div>
        <p className="text-sm font-extrabold uppercase tracking-[.16em] text-[var(--dark-cyan)]">Welcome, leader!</p>
        <h2 className="mt-2 whitespace-nowrap font-display text-2xl text-[var(--forest)] sm:text-3xl">Enter your access code</h2>
        <p className="mt-3 text-[var(--muted)]">Use your personal code: the first 3 letters of your first name + the first 2 letters of your last name.</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <Field label="Access code" value={code} onChange={(event) => { setCode(event.target.value); if (error) setError(""); }} placeholder="Enter your code" autoCapitalize="none" autoCorrect="off" spellCheck={false} autoFocus aria-invalid={!!error} aria-describedby={error ? "access-code-error" : undefined} />
          {error && <motion.p id="access-code-error" role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-[#c9423b]/20 bg-[#fae2df] p-3 text-sm font-semibold text-[#8f302b]">{error}</motion.p>}
          <Button className="flex w-full items-center justify-center" type="submit">Enter your pocket guide!</Button>
        </form>
      </motion.div>
    </section>
  </main>;
}
