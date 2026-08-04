"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  CloudUpload,
  FileVideo,
  Info,
  Link2,
  LoaderCircle,
  Pencil,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button, Field, Progress } from "@/components/ui";
import { useParticipant } from "@/components/participant-session";
type State = "form" | "uploading" | "success";
export default function Submit() {
  const { currentParticipant } = useParticipant();
  const [state, setState] = useState<State>("form");
  const upload = () => {
    setState("uploading");
    setTimeout(() => setState("form"), 1800);
  };
  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/home"
        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--green)]"
      >
        <ArrowLeft size={18} />
        Back home
      </Link>
      <AnimatePresence mode="wait">
        {state === "success" ? (
          <motion.section
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card px-6 py-12 text-center"
          >
            <span className="mx-auto grid size-20 place-items-center rounded-full bg-[#dcefe5] text-[#276b51]">
              <Check size={38} />
            </span>
            <p className="mt-6 text-xs font-extrabold uppercase tracking-[.18em] text-[var(--red)]">
              Submission received
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold">
              Mission accomplished!
            </h1>
            <p className="mx-auto mt-4 max-w-md text-[var(--muted)]">
              {currentParticipant?.teamName}’s Public Health Video is safely in. Organizers will
              review it before it appears publicly.
            </p>
            <div className="mx-auto mt-7 max-w-sm rounded-2xl bg-green-900/5 p-4 text-left text-sm">
              <p className="font-bold">Submitted today · 2:48 PM</p>
              <p className="mt-1 text-[var(--muted)]">
                You can make changes while submissions remain open.
              </p>
            </div>
            <Button
              onClick={() => setState("form")}
              variant="secondary"
              className="mt-6 inline-flex items-center gap-2"
            >
              <Pencil size={17} />
              Edit before deadline
            </Button>
          </motion.section>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[var(--red)]">
              Team challenge
            </p>
            <h1 className="mt-1 font-display text-4xl font-bold text-[var(--forest)]">
              Submit your work
            </h1>
            <p className="mt-3 text-[var(--muted)]">
              One teammate can submit on behalf of the whole team.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setState("success");
              }}
              className="card mt-7 space-y-5 p-5 md:p-7"
            >
              <label className="block text-sm font-bold">
                Team
                <select className="mt-2 min-h-13 w-full rounded-2xl border border-green-900/15 bg-white px-4">
                    <option>{currentParticipant?.teamName}</option>
                </select>
              </label>
              <label className="block text-sm font-bold">
                Challenge
                <select className="mt-2 min-h-13 w-full rounded-2xl border border-green-900/15 bg-white px-4">
                  <option>Public Health Video Challenge</option>
                  <option>Team Flag & Motto</option>
                </select>
              </label>
              <div>
                <p className="mb-2 text-sm font-bold">Video file</p>
                <button
                  type="button"
                  onClick={upload}
                  className="flex min-h-40 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-900/20 bg-green-900/[.025] p-5 text-center"
                >
                  {state === "uploading" ? (
                    <>
                      <LoaderCircle className="animate-spin text-[var(--green)]" />
                      <p className="mt-3 font-bold">
                        Uploading {currentParticipant?.teamName.toLowerCase().replaceAll(" ", "-")}-final.mp4
                      </p>
                      <div className="mt-3 w-full max-w-xs">
                        <Progress value={72} />
                      </div>
                      <p className="mt-2 text-xs text-[var(--muted)]">
                        72% · Keep this page open
                      </p>
                    </>
                  ) : (
                    <>
                      <CloudUpload size={30} className="text-[var(--green)]" />
                      <p className="mt-3 font-bold">
                        Choose a video or drag it here
                      </p>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        MP4, MOV · Up to 500 MB
                      </p>
                    </>
                  )}
                </button>
              </div>
              <Field
                label="Or add a Google Drive link (optional)"
                placeholder="https://drive.google.com/..."
              />
              <label className="block text-sm font-bold">
                Caption
                <textarea
                  className="mt-2 min-h-28 w-full rounded-2xl border border-green-900/15 bg-white p-4 outline-none focus:ring-4 focus:ring-green-700/10"
                  defaultValue="Your liver does more than 500 jobs—show it some love! 🌿 #YLC2026"
                />
              </label>
              <Field
                label="Team member credits"
                defaultValue={currentParticipant?.name}
              />
              <div className="flex gap-2 rounded-2xl bg-[#fff0c8] p-4 text-sm">
                <Info size={18} className="shrink-0 text-[#9a6b18]" />
                <p>
                  Submissions may be reviewed by organizers before appearing on
                  the shared showcase.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="secondary">
                  Save draft
                </Button>
                <Button
                  type="submit"
                  className="flex items-center justify-center gap-2"
                >
                  <Send size={17} />
                  Submit
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
