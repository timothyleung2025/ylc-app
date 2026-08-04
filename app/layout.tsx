import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ParticipantProvider } from "@/components/participant-session";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const magison = localFont({
  src: "./fonts/Magison-Font/Magison.otf",
  variable: "--font-magison",
  display: "swap",
});

export const metadata: Metadata = {
  title: "YLC 2026",
  description: "Your mobile guide to the 2026 Youth Leadership Conference.",
  applicationName: "YLC 2026",
  appleWebApp: {
    capable: true,
    title: "YLC 2026",
    statusBarStyle: "default",
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    shortcut: ["/icon.png"],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#294956" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${magison.variable}`}><ParticipantProvider>{children}</ParticipantProvider></body></html>;
}
