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

export const metadata: Metadata = { title: "YLC Field Guide", description: "Your Youth Leadership Conference companion." };
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#294956" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${magison.variable}`}><ParticipantProvider>{children}</ParticipantProvider></body></html>;
}
