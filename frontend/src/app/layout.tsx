import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Inter, JetBrains_Mono } from "next/font/google";
import { AppProviders } from "@/providers/AppProviders";
import "./globals.css";

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  fallback: ["sans-serif"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});


export const metadata: Metadata = {
  title: "AERO-GUARD | Drone Aerial Surveillance & Multi-Person Intrusion HUD",
  description:
    "Real-time aerial drone & ground perimeter surveillance, zone intrusion tracking, and crowd gathering analytics powered by specialized YOLO11n (VisDrone), YOLO26s (MOT20), BoT-SORT, ByteTrack, Next.js, Redux, and TanStack Query.",
  keywords: [
    "drone surveillance",
    "aerial computer vision",
    "YOLO11n VisDrone",
    "YOLO26s MOT20",
    "person detection",
    "intrusion detection",
    "tactical HUD",
    "BoT-SORT",
    "ByteTrack",
    "Next.js",
  ],
  authors: [{ name: "AERO-GUARD Defense Systems" }],
};

export const viewport: Viewport = {
  themeColor: "#060911",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark h-full antialiased ${chakraPetch.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-full bg-[#060911] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
