
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";
import type { Metadata, Viewport } from "next";
import type { ChildrenProps } from "@/types";
import { inter, jetbrainsMono } from "./fonts";
import { siteMetadata, siteViewport } from "@/constants/site";
import { AppProviders } from "@/providers/AppProviders";
import "./globals.css";

export const metadata: Metadata = siteMetadata;
export const viewport: Viewport = siteViewport;

export default function RootLayout({
  children,
}: ChildrenProps) {
  return (
    <html
      lang="en"
      className={`dark h-full antialiased ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className={TACTICAL_VIEW_STYLES.layout_body_className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
