"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { findParticipantByAccessCode, YlcParticipant } from "@/src/data/ylcTeams";
const SESSION_KEY = "ylc-current-participant";
type ParticipantSession = { currentParticipant:YlcParticipant|null; ready:boolean; signIn:(code:string)=>YlcParticipant|null; signOut:()=>void };
const ParticipantContext=createContext<ParticipantSession|null>(null);
export function ParticipantProvider({children}:{children:React.ReactNode}){
 const [currentParticipant,setCurrentParticipant]=useState<YlcParticipant|null>(null);const [ready,setReady]=useState(false);
 useEffect(()=>{const saved=sessionStorage.getItem(SESSION_KEY);if(saved){try{const stored=JSON.parse(saved) as YlcParticipant;const match=findParticipantByAccessCode(stored.accessCode);if(match)setCurrentParticipant(match);else sessionStorage.removeItem(SESSION_KEY)}catch{sessionStorage.removeItem(SESSION_KEY)}}setReady(true)},[]);
 const value=useMemo<ParticipantSession>(()=>({currentParticipant,ready,signIn(code){const participant=findParticipantByAccessCode(code);if(!participant)return null;setCurrentParticipant(participant);sessionStorage.setItem(SESSION_KEY,JSON.stringify(participant));return participant},signOut(){setCurrentParticipant(null);sessionStorage.removeItem(SESSION_KEY)}}),[currentParticipant,ready]);
 return <ParticipantContext.Provider value={value}>{children}</ParticipantContext.Provider>
}
export function useParticipant(){const value=useContext(ParticipantContext);if(!value)throw new Error("useParticipant must be used within ParticipantProvider");return value}
