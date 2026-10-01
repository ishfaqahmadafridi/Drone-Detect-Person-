import type { Metadata, Viewport } from "next";
import { inter, jetbrainsMono } from "./fonts";
import { siteMetadata, siteViewport } from "@/constants/site";
import { AppProviders } from "@/providers/AppProviders";
import "./globals.css";

export const metadata: Metadata = siteMetadata;
export const viewport: Viewport = siteViewport;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark h-full antialiased ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-full bg-[#0B0E14] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-100">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
