import type { Metadata } from "next";
import { DroneDashboard } from "@/components/tactical";

export const metadata: Metadata = {
  title: "AERO-GUARD | Airspace Command Deck",
  description: "Tactical UAV airspace telemetry, gimbal optical sensor feed, and active aerial perimeter monitoring.",
};

export default function AirspacePage() {
  return <DroneDashboard initialTab="airspace" />;
}
