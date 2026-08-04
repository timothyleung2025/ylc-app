"use client";
import { CalendarDays, CircleHelp, Home, Lightbulb, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs=[
 {href:"/home",label:"Home",icon:Home},
 {href:"/schedule",label:"Schedule",icon:CalendarDays},
 {href:"/team",label:"My Team",icon:Users},
 {href:"/challenge",label:"Challenge",icon:Lightbulb},
 {href:"/help",label:"Help",icon:CircleHelp},
];

export function BottomNav(){const path=usePathname();return <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-40 mx-auto border-t border-[var(--line)] bg-white/95 px-1 pb-[max(.55rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_rgba(41,73,86,.09)] backdrop-blur-xl md:bottom-5 md:max-w-2xl md:rounded-3xl md:border"><div className="mx-auto flex max-w-2xl justify-around">{tabs.map(({href,label,icon:Icon})=>{const active=path===href||path.startsWith(href+"/");return <Link key={href} href={href} aria-current={active?"page":undefined} className={`relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-1 py-1.5 text-[9px] font-bold transition sm:text-[10px] ${active?"text-[var(--charcoal-blue)]":"text-[#69777c]"}`}>{active&&<span className="absolute inset-0 -z-10 rounded-2xl bg-[var(--strong-cyan)]/20"/>}<Icon size={20} strokeWidth={active?2.8:2}/>{label}</Link>})}</div></nav>}
