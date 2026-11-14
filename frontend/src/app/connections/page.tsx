import type { Metadata } from "next";
import { DroneDashboard } from "@/components/tactical";

export const metadata: Metadata = {
  title: "AERO-GUARD | Connections",
  description: "Connect the drone and ground cameras, and see which devices are live.",
};

export default function ConnectionsPage() {
  return <DroneDashboard initialTab="connections" />;
}
