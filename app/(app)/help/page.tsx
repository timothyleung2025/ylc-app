import { ExternalLink, Phone } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { ScheduleTimezoneSetting } from "@/components/schedule-timezone-setting";
import { ZoomAccessCard } from "@/components/zoom-access-card";

const contacts = [
  { name: "Maris Leong", phone: "(916) 751-8203", href: "tel:+19167518203" },
  { name: "Saisri Petluru", phone: "(650) 430-2815", href: "tel:+16504302815" },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader eyebrow="Conference support" title="Settings" />
      <div className="grid gap-3 sm:grid-cols-2">
        <ScheduleTimezoneSetting />
        <ZoomAccessCard />
      </div>
      <section className="mt-7">
        <p className="text-xs font-black uppercase tracking-[.16em] text-[var(--dark-cyan)]">
          Technical help
        </p>
        <h2 className="mt-1 font-display text-3xl text-[var(--charcoal-blue)]">
          Call or text us
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {contacts.map((contact) => (
            <a
              key={contact.name}
              href={contact.href}
              className="card flex items-center gap-4 p-4 transition hover:-translate-y-1"
            >
              <span className="grid size-11 place-items-center rounded-2xl bg-[#fff0c8] text-[#9a651f]">
                <Phone size={20} />
              </span>
              <div className="flex-1">
                <p className="font-bold">{contact.name}</p>
                <p className="text-sm text-[var(--muted)]">{contact.phone}</p>
              </div>
              <ExternalLink size={16} className="text-stone-400" />
            </a>
          ))}
        </div>
      </section>
      <p className="mt-8 text-center text-xs font-bold text-[var(--muted)]">
        YLC 2026 · August 5–8 · Virtual via Zoom
      </p>
    </div>
  );
}
