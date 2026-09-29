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

export const AERIAL_STREAM_SOURCES = [
  { label: "Synthetic Drone", value: "synthetic" },
  { label: "Drone RTSP Link", value: "rtsp" },
] as const;

export const GROUND_STREAM_SOURCES = [
  { label: "Synthetic CCTV", value: "synthetic" },
  { label: "Phone Camera (IP Stream)", value: "rtsp" },
] as const;

export const STREAM_SOURCE_OPTIONS = [
  { label: "Synthetic Drone", value: "synthetic" },
  { label: "Phone Camera (IP / RTSP)", value: "rtsp" },
  { label: "Synthetic CCTV", value: "synthetic" },
] as const;

export const RECORDINGS_PERSPECTIVE_LABELS: Record<string, string> = {
  aerial: "AERIAL",
  ground: "GROUND",
};

export const RECORDINGS_PERSPECTIVE_COLORS: Record<string, string> = {
  aerial: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
  ground: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
};

export const RECORDINGS_FILTER_OPTIONS: readonly { value: "all" | "aerial" | "ground"; label: string }[] = [
  { value: "all", label: "ALL" },
  { value: "aerial", label: "AERIAL" },
  { value: "ground", label: "GROUND" },
] as const;
