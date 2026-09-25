import { ThreatLevel } from "@/types";

export const THREAT_RIBBON_STYLES: Record<ThreatLevel, string> = {
  INTRUSION: "bg-red-950/60 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse",
  MULTI_PERSON: "bg-amber-950/60 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]",
  MONITORING: "bg-cyan-950/40 border-cyan-500 text-cyan-300",
  CLEAR: "bg-emerald-950/40 border-emerald-500 text-emerald-400",
};

export const DEFAULT_RESTRICTED_ZONE: [number, number][] = [
  [0.25, 0.25],
  [0.75, 0.25],
  [0.75, 0.75],
  [0.25, 0.75],
];

export const STREAM_SOURCE_OPTIONS = [
  { label: "Synthetic Drone", value: "synthetic" },
  { label: "Webcam", value: "webcam" },
  { label: "Upload Video", value: "file" },
  { label: "RTSP Feed", value: "rtsp" },
] as const;
