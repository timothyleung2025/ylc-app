"use client";
import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { AccessCodeScreen } from "./access-code-screen";
import { BottomNav } from "./bottom-nav";
import { useParticipant } from "./participant-session";
export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentParticipant, ready, signOut } = useParticipant();
  if (!ready) return <div className="paper-texture min-h-dvh" />;
  if (!currentParticipant) return <AccessCodeScreen />;
  return (
    <div className="paper-texture min-h-dvh">
      <main className="app-shell safe-bottom relative px-4 pb-28 pt-6 md:px-8 md:pt-8">
        <button
          onClick={() => {
            signOut();
            router.replace("/");
          }}
          aria-label="Sign out"
          title="Sign out"
          className="absolute right-4 top-5 z-10 grid size-9 place-items-center rounded-full bg-white/80 text-[var(--muted)] shadow-sm transition hover:text-[var(--forest)] md:right-8 md:top-7"
        >
          <LogOut size={16} />
        </button>
        <div key={pathname} className="page-enter">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
