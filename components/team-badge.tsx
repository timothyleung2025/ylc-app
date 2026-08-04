import { Leaf } from "lucide-react";
import { useParticipant } from "./participant-session";
export function TeamBadge({compact=false}:{compact?:boolean}) { const {currentParticipant}=useParticipant();return <span className={`inline-flex items-center gap-2 rounded-full bg-[var(--strong-cyan)]/20 font-extrabold text-[var(--charcoal-blue)] ${compact?"px-3 py-1.5 text-xs":"px-4 py-2 text-sm"}`}><Leaf size={compact?14:16} fill="currentColor"/>{currentParticipant?.teamName}</span> }
