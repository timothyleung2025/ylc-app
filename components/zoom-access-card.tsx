"use client";

import { ExternalLink, Info, Video } from "lucide-react";
import { useState } from "react";
import { Button, Sheet } from "./ui";

const zoomUrl =
  "https://stanford.zoom.us/j/97110145134?pwd=I1i6K0W12h5rGQP1ZrMa7VMBbMY6Hb.1";

export function ZoomAccessCard({ compact = false, whereTo = false }: { compact?: boolean; whereTo?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {whereTo ? <button type="button" onClick={() => setOpen(true)} className="card flex min-h-24 w-full items-center gap-3 p-4 text-left transition"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#dff5f3] text-[var(--dark-cyan)]"><Video size={21}/></span><span className="font-bold leading-tight">Join Zoom</span></button> : <section className={`card ${compact ? "mt-5 p-4" : "p-4"}`}>
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#dff5f3] text-[var(--dark-cyan)]">
            <Video size={19} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-bold">Join the YLC Zoom</h2>
            <p className="text-xs text-[var(--muted)]">
              Meeting ID: 971 1014 5134
            </p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <a
            href={zoomUrl}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--dark-cyan)] px-3 text-sm font-extrabold text-white"
          >
            Join Zoom <ExternalLink size={14} />
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="min-h-11 rounded-xl border border-[var(--line)] bg-white px-3 text-sm font-extrabold text-[var(--charcoal-blue)]"
          >
            Meeting info
          </button>
        </div>
      </section>}
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="YLC Zoom details"
      >
        <div className="space-y-4 text-sm">
          <div className="rounded-2xl bg-[#dff5f3] p-4">
            <p className="font-black text-[var(--charcoal-blue)]">Meeting ID</p>
            <p className="mt-1 text-lg font-bold">971 1014 5134</p>
            <p className="mt-3 font-black text-[var(--charcoal-blue)]">
              Password
            </p>
            <p className="mt-1 text-lg font-bold">594024</p>
          </div>
          <a href={zoomUrl} target="_blank" rel="noreferrer">
            <Button className="flex w-full items-center justify-center gap-2">
              Join from Zoom <ExternalLink size={16} />
            </Button>
          </a>
          <div className="card p-4">
            <h3 className="font-bold">iPhone one-tap</h3>
            <div className="mt-2 space-y-2">
              <a
                className="block text-[var(--dark-cyan)] underline"
                href="tel:+18333021536,,97110145134%23"
              >
                +1 833 302 1536
              </a>
              <a
                className="block text-[var(--dark-cyan)] underline"
                href="tel:+16507249799,,97110145134%23"
              >
                +1 650 724 9799
              </a>
            </div>
          </div>
          <div className="card p-4">
            <h3 className="font-bold">Dial by telephone</h3>
            <p className="mt-2 text-[var(--muted)]">
              +1 650 724 9799 (toll)
              <br />
              +1 833 302 1536 (toll free)
            </p>
            <a
              href="https://stanford.zoom.us/u/arIUGx8Gd"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1 font-bold text-[var(--dark-cyan)] underline"
            >
              International numbers <ExternalLink size={13} />
            </a>
          </div>
          <div className="rounded-2xl bg-[var(--charcoal-blue)]/5 p-4">
            <p className="flex items-center gap-2 font-bold">
              <Info size={16} />
              SIP options
            </p>
            <p className="mt-2 break-all text-xs text-[var(--muted)]">
              97110145134@zoomcrc.com · Password 594024
              <br />
              <br />
              95708451760@zoomcrc.com · Password 360705
            </p>
          </div>
        </div>
      </Sheet>
    </>
  );
}
