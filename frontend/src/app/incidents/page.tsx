import type { Metadata } from "next";
import { DroneDashboard } from "@/components/tactical";

export const metadata: Metadata = {
  title: "AERO-GUARD | Incident Audit Logs & Intrusion Alerts",
  description: "Real-time threat log auditing, multi-person gathering alerts, and security breach event history.",
};

export default function IncidentsPage() {
  return <DroneDashboard initialTab="incidents" />;
}
