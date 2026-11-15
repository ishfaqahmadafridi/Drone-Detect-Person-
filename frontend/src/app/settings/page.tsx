import type { Metadata } from "next";
import { DroneDashboard } from "@/components/tactical";

export const metadata: Metadata = {
  title: "Settings",
  description: "AI model thresholds, intrusion zone geometry, alert distances, and hardware sensor configuration.",
};

export default function SettingsPage() {
  return <DroneDashboard initialTab="settings" />;
}
