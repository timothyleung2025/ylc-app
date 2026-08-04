"use client";
import { AccessCodeScreen } from "./access-code-screen";
import { useParticipant } from "./participant-session";

export function AccessBoundary({ children }: { children: React.ReactNode }) {
  const { currentParticipant, ready } = useParticipant();
  if (!ready) return <div className="paper-texture min-h-dvh" />;
  if (!currentParticipant) return <AccessCodeScreen />;
  return children;
}
