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
  description: "Youth Leadership Conference pocket guide",
  applicationName: "YLC 2026",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "YLC 2026",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2f9f9a",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${magison.variable}`}><ParticipantProvider>{children}</ParticipantProvider></body></html>;
}
