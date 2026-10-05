import type { Metadata } from "next";
import { DroneDashboard } from "@/components/tactical";

export const metadata: Metadata = {
  title: "AERO-GUARD | Detection Calibration & Tactical Settings",
  description: "AI model thresholds, intrusion zone geometry, alert distances, and hardware sensor configuration.",
};

export default function SettingsPage() {
  return <DroneDashboard initialTab="settings" />;
}
