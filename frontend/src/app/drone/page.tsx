import type { Metadata } from "next";
import { DroneDashboard } from "@/components/tactical";

export const metadata: Metadata = {
  title: "AERO-GUARD | Drone UAV Command & Aerial Surveillance",
  description: "Autonomous drone telemetry, flight controls, live VisDrone AI tracking, and top-down airspace defense.",
};

export default function DronePage() {
  return <DroneDashboard initialTab="airspace" />;
}
