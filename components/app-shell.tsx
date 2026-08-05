"use client";
import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { AccessCodeScreen } from "./access-code-screen";
import { BottomNav } from "./bottom-nav";
import { useParticipant } from "./participant-session";
import { PostSigninNotificationPrompt } from "./post-signin-notification-prompt";
export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentParticipant, ready, signOut } = useParticipant();
  if (!ready) return <div className="paper-texture min-h-dvh" />;
  if (!currentParticipant) return <AccessCodeScreen />;
  return (
    <div className="paper-texture min-h-dvh">
      <main className="app-shell safe-bottom safe-top relative px-4 pb-28 md:px-8">
        <button
          onClick={() => {
            signOut();
            router.replace("/");
          }}
          aria-label="Sign out"
          title="Sign out"
          className="signout-safe absolute right-4 z-10 grid size-9 place-items-center rounded-full bg-white/80 text-[var(--muted)] shadow-sm transition hover:text-[var(--forest)] md:right-8"
        >
          <LogOut size={16} />
        </button>
        <div key={pathname} className="page-enter">{children}</div>
      </main>
      <BottomNav />
      <PostSigninNotificationPrompt />
    </div>
  );
}
