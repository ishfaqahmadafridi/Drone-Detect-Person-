import type { Metadata } from "next";
import { DroneDashboard } from "@/components/tactical";

export const metadata: Metadata = {
  title: "Cameras",
  description: "Fixed CCTV perimeter surveillance, IP camera links, and multi-sensor live stream grid.",
};

export default function CamerasPage() {
  return <DroneDashboard initialTab="cameras" />;
}
