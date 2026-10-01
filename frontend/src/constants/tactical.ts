import { ThreatLevel } from "@/types";

export const THREAT_RIBBON_STYLES: Record<ThreatLevel, string> = {
  INTRUSION: "bg-red-950/60 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse",
  MULTI_PERSON: "bg-amber-950/60 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]",
  MONITORING: "bg-cyan-950/40 border-cyan-500 text-cyan-300",
  CLEAR: "bg-emerald-950/40 border-emerald-500 text-emerald-400",
  MANUAL: "bg-amber-950/50 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]",
};

export const DEFAULT_RESTRICTED_ZONE: [number, number][] = [];

export const AERIAL_STREAM_SOURCES = [
  { label: "Synthetic Drone", value: "synthetic" },
  { label: "Flight Video", value: "file" },
  { label: "Drone RTSP Link", value: "rtsp" },
] as const;

export const GROUND_STREAM_SOURCES = [
  { label: "Synthetic CCTV", value: "synthetic" },
  { label: "CCTV Video", value: "file" },
  { label: "Phone Camera (IP Stream)", value: "rtsp" },
] as const;

export const STREAM_SOURCE_OPTIONS = [
  { label: "Synthetic Drone", value: "synthetic" },
  { label: "Flight Video", value: "file" },
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

export const RECORDINGS_FILTER_OPTIONS: readonly { value: "all" | "aerial" | "ground" | "video" | "image"; label: string }[] = [
  { value: "all", label: "ALL" },
  { value: "aerial", label: "AERIAL" },
  { value: "ground", label: "GROUND" },
  { value: "video", label: "VIDEOS" },
  { value: "image", label: "IMAGES" },
] as const;

export const CCTV_CAMERA_CONFIG = {
  id: "CAM-01",
  name: "PERIMETER CCTV SENSOR",
  location: "Sector North Perimeter - Post 03",
  mountHeight: "2.8m Fixed Wall Mount",
  lens: "3.6mm Fixed Focal (110° FOV)",
  powerSource: "PoE+ 48V (IEEE 802.3at) / Mains",
  powerStatus: "100% STABLE (12.4W Nominal)",
  voltage: "48.2V PoE",
  resolution: "1080p FHD (1920x1080)",
  networkProtocol: "Gigabit LAN / RTSP Link",
  tamperStatus: "ACTIVE (Secure Housing)",
  irNightVision: "Auto IR-Cut Filter (850nm)",
  weatherRating: "IP67 Weatherproof / NEMA 4X",
} as const;

export const PERIMETER_ZOOM_PRESETS = [
  { label: "1.0x Wide", value: 1.0 },
  { label: "2.0x Tactical", value: 2.0 },
  { label: "4.0x Tele", value: 4.0 },
] as const;

export const DEFAULT_AERIAL_MODEL_NAME = "visdrone_person_best.pt";
export const DEFAULT_GROUND_MODEL_NAME = "mot20_yolo26s_pedestrian.pt";
export const DEFAULT_AERIAL_ENGINE = "YOLO11n + BoT-SORT";
export const DEFAULT_GROUND_ENGINE = "YOLO26s + ByteTrack";


