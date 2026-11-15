import type { Metadata } from "next";
import { DroneDashboard } from "@/components/tactical";

export const metadata: Metadata = {
  title: { absolute: "Drone Clock" },
  description: "Real-time tactical drone aerial surveillance, perimeter monitoring, and AI intrusion analytics.",
};

export default function RootDashboardPage() {
  return <DroneDashboard initialTab="airspace" />;
}
