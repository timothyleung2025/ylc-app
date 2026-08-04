"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AccessCodeScreen } from "@/components/access-code-screen";
import { useParticipant } from "@/components/participant-session";
export default function Welcome(){const router=useRouter();const {currentParticipant,ready}=useParticipant();useEffect(()=>{if(ready&&currentParticipant)router.replace("/home")},[currentParticipant,ready,router]);if(!ready||currentParticipant)return <div className="paper-texture min-h-dvh"/>;return <AccessCodeScreen/>}
