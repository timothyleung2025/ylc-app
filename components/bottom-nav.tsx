"use client";
import { Bell, CalendarDays, Home, Settings, Users } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAnnouncements } from "./announcement-provider";

const tabs = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/team", label: "Team", icon: Users },
  { href: "/announcements", label: "Announcements", icon: Bell },
  { href: "/more", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const path = usePathname();
  const { unreadCount } = useAnnouncements();
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-40 mx-auto border-t border-[var(--line)] bg-white/[.98] px-1 pb-[max(.55rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_rgba(41,73,86,.09)] md:bottom-5 md:max-w-2xl md:rounded-3xl md:border md:bg-white/95 md:backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-2xl justify-around">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = path === href || path.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-0 flex-1 justify-center text-[8px] font-bold transition-colors sm:text-[10px] ${active ? "text-[var(--charcoal-blue)]" : "text-[#69777c]"}`}
            >
              <span className="relative flex w-fit flex-col items-center gap-1 rounded-2xl px-3 py-1.5">
                {active && (
                  <motion.span
                    layoutId="active-nav-pill"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 28,
                      mass: 0.8,
                    }}
                    className="absolute inset-0 -z-10 rounded-2xl bg-[var(--strong-cyan)]/20"
                  />
                )}
                <Icon size={20} strokeWidth={active ? 2.8 : 2} />
                {href === "/announcements" && unreadCount > 0 && (
                  <span className="absolute right-0 top-0 grid min-w-4 place-items-center rounded-full bg-[#c98282] px-1 text-[8px] font-black text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
                <span className="whitespace-nowrap">{label}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
