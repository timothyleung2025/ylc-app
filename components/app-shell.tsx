"use client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { AccessCodeScreen } from "./access-code-screen";
import { BottomNav } from "./bottom-nav";
import { useParticipant } from "./participant-session";
export function AppShell({children}:{children:React.ReactNode}){const router=useRouter();const {currentParticipant,ready,signOut}=useParticipant();if(!ready)return <div className="paper-texture min-h-dvh"/>;if(!currentParticipant)return <AccessCodeScreen/>;return <div className="paper-texture min-h-dvh"><div className="app-shell flex justify-end px-4 pt-4 md:px-8"><button onClick={()=>{signOut();router.replace("/")}} className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-xs font-bold text-[var(--muted)] shadow-sm transition hover:text-[var(--forest)]"><LogOut size={15}/>Sign out</button></div><main className="app-shell safe-bottom px-4 pb-28 pt-3 md:px-8 md:pt-5">{children}</main><BottomNav/></div>}
