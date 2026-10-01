import type { Metadata, Viewport } from "next";

export const siteMetadata: Metadata = {
  title: "AERO-GUARD | Drone Aerial Surveillance & Multi-Person Intrusion Console",
  description:
    "Real-time aerial drone & ground perimeter surveillance, zone intrusion tracking, and crowd gathering analytics powered by specialized YOLO11n (VisDrone), YOLO26s (MOT20), BoT-SORT, ByteTrack, Next.js, Redux, and TanStack Query.",
  keywords: [
    "drone surveillance",
    "aerial computer vision",
    "YOLO11n VisDrone",
    "YOLO26s MOT20",
    "person detection",
    "intrusion detection",
    "tactical operations console",
    "BoT-SORT",
    "ByteTrack",
    "Next.js",
  ],
  authors: [{ name: "AERO-GUARD Defense Systems" }],
};

export const siteViewport: Viewport = {
  themeColor: "#0B0E14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};
