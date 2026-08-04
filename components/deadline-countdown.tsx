"use client";
import { useEffect, useState } from "react";

const deadline = new Date("2026-08-08T12:00:00-07:00").getTime();
function remaining(){const ms=Math.max(0,deadline-Date.now());return {days:Math.floor(ms/86400000),hours:Math.floor(ms/3600000%24),minutes:Math.floor(ms/60000%60),seconds:Math.floor(ms/1000%60),done:ms===0}}

export function DeadlineCountdown(){const [time,setTime]=useState(remaining);useEffect(()=>{const timer=window.setInterval(()=>setTime(remaining()),1000);return()=>window.clearInterval(timer)},[]);if(time.done)return <p className="mt-4 rounded-2xl bg-white/70 p-3 text-center text-sm font-black text-[#70450f]">Submissions are due now!</p>;const units=[[time.days,"days"],[time.hours,"hrs"],[time.minutes,"min"],[time.seconds,"sec"]] as const;return <div className="mt-4 grid grid-cols-4 gap-2" aria-label={`${time.days} days, ${time.hours} hours, ${time.minutes} minutes, and ${time.seconds} seconds until the deadline`}>{units.map(([value,label])=><div key={label} className="rounded-2xl bg-white/70 px-1 py-2.5 text-center shadow-sm"><span className="block font-display text-2xl leading-none text-[var(--charcoal-blue)]">{String(value).padStart(2,"0")}</span><span className="mt-1 block text-[9px] font-black uppercase tracking-wider text-[#8a5b1c]">{label}</span></div>)}</div>}
