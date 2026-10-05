"use client";

import { useAppSelector } from "@/store";

export function useTelemetryMetrics() {
  const {
    total_persons,
    intruders_count,
    fps,
    threat_level,
    alert_msg,
    isConnected,
    view_mode,
  } = useAppSelector((state) => state.telemetry);

  return {
    totalPersons: total_persons,
    intrudersCount: intruders_count,
    fps,
    threatLevel: threat_level,
    alertMsg: alert_msg,
    isConnected,
    viewMode: (view_mode as "aerial" | "ground") || "aerial",
  };
}
