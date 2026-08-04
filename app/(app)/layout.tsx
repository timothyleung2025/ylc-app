import { AppShell } from "@/components/app-shell";
import { AnnouncementProvider } from "@/components/announcement-provider";
export default function Layout({children}:{children:React.ReactNode}){return <AnnouncementProvider><AppShell>{children}</AppShell></AnnouncementProvider>}
