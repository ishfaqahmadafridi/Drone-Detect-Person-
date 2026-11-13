import type { TelemetryCardMetrics, TelemetryCardDefinition } from "@/types";
import { TELEMETRY_DISPLAY } from "@/constants/tactical";

export function buildTelemetryCards(
  { totalPersons, intrudersCount, fps, evidenceCount }: TelemetryCardMetrics,
  onInspect: () => void,
): TelemetryCardDefinition[] {
  return [
    {
      id: "persons",
      title: "Total Persons",
      value: String(totalPersons),
      subText: "Detected tracks",
      isAlert: false,
      onClick: onInspect,
    },
    {
      id: "intruders",
      title: "Active Intruders",
      value: String(intrudersCount),
      subText: "Restricted zone",
      isAlert: intrudersCount > 0,
      onClick: onInspect,
    },
    {
      id: "processing",
      title: "Processing FPS",
      value: fps.toFixed(1),
      subText: "Analyzed frames / second",
      isAlert: false,
      onClick: undefined,
    },
    {
      id: "evidence",
      title: "Evidence Captures",
      value: evidenceCount === undefined ? "—" : String(evidenceCount),
      subText: "Saved snapshots",
      isAlert: false,
      onClick: undefined,
    },
    {
      id: "latency",
      title: "Frame Interval",
      value: fps > 0 ? `${Math.round(TELEMETRY_DISPLAY.millisecondsPerSecond / fps)} ms` : "—",
      subText: "Measured processing interval",
      isAlert: false,
      onClick: undefined,
    },
  ];
}
