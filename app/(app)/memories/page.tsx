"use client";
import { Camera, ImagePlus, Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { MemoryCard } from "@/components/memory-card";
import { Button, PageHeader, Sheet } from "@/components/ui";
import { memories } from "@/lib/mock-data";
import { useParticipant } from "@/components/participant-session";
/* eslint-disable react-hooks/set-state-in-effect */
function Wall() {
  const params = useSearchParams();
  const { currentParticipant } = useParticipant();
  const [open, setOpen] = useState(false);
  const [posted, setPosted] = useState(false);
  useEffect(() => {
    if (params.get("add")) setOpen(true);
  }, [params]);
  return (
    <>
      <PageHeader
        eyebrow="Shared scrapbook"
        title="Memory Wall"
        action={
          <span className="grid size-11 place-items-center rounded-2xl bg-[#fff0c8]">
            <Camera size={21} />
          </span>
        }
      />
      <div className="mb-6 rounded-2xl bg-white/70 p-4 text-center font-display text-lg font-semibold italic">
        “A moment I want to remember…”
      </div>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {memories.map((p) => (
          <MemoryCard key={p.id} post={p} />
        ))}
      </div>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-30 flex items-center gap-2 rounded-full bg-[var(--red)] px-5 py-4 font-bold text-white shadow-xl md:bottom-28 md:right-8"
      >
        <Plus size={20} />
        Add Memory
      </button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={posted ? "Memory sent" : "Add a memory"}
      >
        {posted ? (
          <div className="py-8 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-green-100 text-green-700">
              ✓
            </span>
            <h3 className="mt-4 font-display text-2xl font-bold">
              Thanks for sharing!
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Your memory is with the review team and will appear soon.
            </p>
            <Button
              onClick={() => {
                setPosted(false);
                setOpen(false);
              }}
              className="mt-6"
            >
              Back to the wall
            </Button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPosted(true);
            }}
            className="space-y-5"
          >
            <button
              type="button"
              className="grid min-h-32 w-full place-items-center rounded-2xl border-2 border-dashed border-green-900/15 bg-white"
            >
              <span className="text-center">
                <ImagePlus className="mx-auto text-[var(--green)]" />
                <span className="mt-2 block text-sm font-bold">
                  Add a photo (optional)
                </span>
              </span>
            </button>
            <label className="block text-sm font-bold">
              Memory type
              <select className="mt-2 min-h-12 w-full rounded-2xl border border-green-900/15 bg-white px-4">
                <option>Something I learned today…</option>
                <option>A moment I want to remember…</option>
                <option>Someone who inspired me…</option>
                <option>One action I will take after YLC…</option>
              </select>
            </label>
            <label className="block text-sm font-bold">
              Your memory
              <textarea
                required
                placeholder="Write a few words…"
                className="mt-2 min-h-32 w-full rounded-2xl border border-green-900/15 bg-white p-4"
              />
            </label>
            <label className="block text-sm font-bold">
              Team tag
              <select className="mt-2 min-h-12 w-full rounded-2xl border border-green-900/15 bg-white px-4">
                      <option>{currentParticipant?.teamName}</option>
                <option>No team tag</option>
              </select>
            </label>
            <p className="rounded-xl bg-[#fff0c8] p-3 text-xs font-bold">
              Memories are reviewed before appearing on the shared wall.
            </p>
            <Button type="submit" className="w-full">
              Share memory
            </Button>
          </form>
        )}
      </Sheet>
    </>
  );
}
export default function Memories() {
  return (
    <Suspense>
      <Wall />
    </Suspense>
  );
}
