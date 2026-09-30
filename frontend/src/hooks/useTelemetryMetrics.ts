"use client";

import { useAppSelector } from "@/store";

export function useTelemetryMetrics() {
  const {
    total_persons,
    intruders_count,
    gathering_pairs,
    fps,
    multi_person_threshold,
    threat_level,
    alert_msg,
    isConnected,
    view_mode,
  } = useAppSelector((state) => state.telemetry);

  return {
    totalPersons: total_persons,
    intrudersCount: intruders_count,
    gatheringPairs: gathering_pairs,
    fps,
    multiPersonThreshold: multi_person_threshold,
    threatLevel: threat_level,
    alertMsg: alert_msg,
    isConnected,
    viewMode: (view_mode as "aerial" | "ground") || "aerial",
  };
}
