import type { Metadata } from "next";
import { DroneDashboard } from "@/components/tactical";

export const metadata: Metadata = {
  title: "AERO-GUARD | Video Recordings & Evidence Gallery",
  description: "Mission playback recordings, MP4 session archives, and evidence snapshot gallery.",
};

export default function RecordingsPage() {
  return <DroneDashboard initialTab="recordings" />;
}
