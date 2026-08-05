import { ExternalLink, Pin } from "lucide-react";
import type { Announcement } from "@/lib/announcement-types";

export const announcementStyles = {
  general: "bg-[#e5edf1] text-[#4f6670]",
  urgent: "bg-[#f5dfdf] text-[#965555]",
  link: "bg-[#dcefe8] text-[#39745e]",
};

export function LiveAnnouncementCard({item,read,onClick,onLinkClick}:{item:Announcement;read:boolean;onClick:()=>void;onLinkClick:()=>void}) {
  return <article className={`card relative flex h-40 w-full flex-col p-4 text-left ${item.category==="urgent"?"border-l-4 border-l-[#c98282]":""}`}><button onClick={onClick} className="flex min-h-0 flex-1 flex-col text-left"><div className="flex w-full flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wide ${announcementStyles[item.category]}`}>{item.category}</span>{item.is_pinned&&<span className="flex items-center gap-1 text-[10px] font-black uppercase text-[var(--dark-cyan)]"><Pin size={12}/>Pinned</span>}{!read&&<span className="ml-auto size-2.5 rounded-full bg-[var(--strong-cyan)]" aria-label="Unread"/>}</div><h2 className="mt-2 line-clamp-1 font-display text-xl text-[var(--charcoal-blue)]">{item.title}</h2>{item.category!=="link"&&<p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">{item.message}</p>}</button><div className="mt-auto flex items-end justify-between gap-3 pt-2"><p className="text-[10px] font-bold text-[var(--muted)]">{new Intl.DateTimeFormat("en-US",{dateStyle:"medium",timeStyle:"short"}).format(new Date(item.created_at))}</p>{item.category==="link"&&item.link_url&&<a href={item.link_url} target="_blank" rel="noopener noreferrer" onClick={onLinkClick} className="flex items-center gap-1 rounded-lg bg-[var(--dark-cyan)] px-3 py-1.5 text-xs font-bold text-white">Open link <ExternalLink size={12}/></a>}</div></article>;
}
