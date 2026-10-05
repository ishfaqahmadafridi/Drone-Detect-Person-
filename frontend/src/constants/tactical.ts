import { ThreatLevel, TacticalCameraChannel, ClassificationLegendItem, ViewportLayoutOption } from "@/types";

export const THREAT_RIBBON_STYLES: Record<ThreatLevel, string> = {
  INTRUSION: "bg-red-950/30 border-red-500/50 text-red-300",
  MONITORING: "bg-blue-950/30 border-blue-500/40 text-blue-300",
  CLEAR: "bg-emerald-950/30 border-emerald-500/40 text-emerald-300",
  MANUAL: "bg-slate-900/80 border-slate-700 text-slate-300",
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
  aerial: "Aerial Drone",
  ground: "Ground CCTV",
};

export const RECORDINGS_PERSPECTIVE_COLORS: Record<string, string> = {
  aerial: "bg-blue-500/10 text-blue-300 border-blue-500/30",
  ground: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
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
  lens: "3.6mm Fixed Focal (110Ãƒâ€šÃ‚Â° FOV)",
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
export const DEFAULT_GROUND_MODEL_NAME = "yolo26n.pt";
export const DEFAULT_AERIAL_ENGINE = "YOLO11n + BoT-SORT";
export const DEFAULT_GROUND_ENGINE = "YOLO26n + ByteTrack";

export const DEFAULT_TACTICAL_CAMERAS: readonly TacticalCameraChannel[] = [
  {
    id: "CAM-01",
    channelNum: "CH-01",
    name: "UAV-01 Aerial Gimbal",
    location: "North Airspace - Sector 04",
    deviceType: "drone_uav",
    viewMode: "aerial",
    sourceType: "synthetic",
    status: "ONLINE",
    resolution: "1080p FHD @ 25 FPS",
    ipAddress: "10.10.10.1 (Avionics Link)",
  },
  {
    id: "CAM-02",
    channelNum: "CH-02",
    name: "Gate 01 Perimeter CCTV",
    location: "North Perimeter - Gate 01",
    deviceType: "poe_cctv",
    viewMode: "ground",
    sourceType: "rtsp",
    streamUrl: "rtsp://192.168.1.100:554/live",
    status: "ONLINE",
    resolution: "1080p FHD @ 25 FPS",
    ipAddress: "192.168.1.100:554",
  },
  {
    id: "CAM-03",
    channelNum: "CH-03",
    name: "East Perimeter Fence CCTV",
    location: "Perimeter East - Fence Line",
    deviceType: "poe_cctv",
    viewMode: "ground",
    sourceType: "rtsp",
    streamUrl: "rtsp://192.168.1.101:554/live",
    status: "STANDBY",
    resolution: "1080p FHD @ 25 FPS",
    ipAddress: "192.168.1.101:554",
  },
  {
    id: "CAM-04",
    channelNum: "CH-04",
    name: "South Loading Dock CCTV",
    location: "Loading Dock South - Post 07",
    deviceType: "poe_cctv",
    viewMode: "ground",
    sourceType: "rtsp",
    streamUrl: "rtsp://192.168.1.102:554/live",
    status: "STANDBY",
    resolution: "1080p FHD @ 25 FPS",
    ipAddress: "192.168.1.102:554",
  },
  {
    id: "CAM-05",
    channelNum: "CH-05",
    name: "Mobile Patrol Unit (Pixel 6A)",
    location: "West Perimeter - Mobile Patrol",
    deviceType: "mobile_phone",
    viewMode: "ground",
    sourceType: "rtsp",
    streamUrl: "http://10.10.20.117:8080/video",
    status: "STANDBY",
    resolution: "1080p FHD @ 30 FPS",
    ipAddress: "10.10.20.117:8080",
  },
] as const;

export const DEFAULT_CONNECTED_CAMERA_IDS = ["CAM-01"] as const;

export const VIEWPORT_LAYOUT_OPTIONS: readonly ViewportLayoutOption[] = [
  { mode: "single", label: "1-UP", tooltip: "Single Sensor Focus (Maximized HUD)" },
  { mode: "dual", label: "2-UP", tooltip: "Connected cameras side by side" },
  { mode: "quad", label: "4-UP", tooltip: "Connected camera grid" },
];


export const CLASSIFICATION_LEGEND_ITEMS: readonly ClassificationLegendItem[] = [
  { label: "Person", dotClass: "bg-emerald-400" },
  { label: "Selected suspect", dotClass: "bg-amber-400" },
] as const;

export const TACTICAL_FEED_PREVIEW_TOKENS = {
  canvasWidth: 320,
  canvasHeight: 180,
  gridSize: 24,
  scanlineSpeed: 1.5,
  cornerBracketLength: 10,
  colors: {
    background: "#030712",
    grid: "rgba(30, 41, 59, 0.4)",
    groundHorizon: "rgba(59, 130, 246, 0.25)",
    groundWireframe: "rgba(71, 85, 105, 0.3)",
    aerialRadar: "rgba(59, 130, 246, 0.25)",
    scanline: "rgba(59, 130, 246, 0.35)",
    brackets: "rgba(148, 163, 184, 0.6)",
    timestamp: "rgba(226, 232, 240, 0.75)",
    targetBox: "#10B981",
    targetLabelBg: "rgba(16, 185, 129, 0.9)",
    targetLabelText: "#000000",
  },
  typography: {
    tagFont: "bold 8px monospace",
    timestampFont: "9px monospace",
  },
  labels: {
    liveAiDetect: "LIVE ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ AI DETECT",
    feedReestablishing: "FEED RE-ESTABLISHING...",
    liveCoverageSuffix: "LIVE COVERAGE",
    defaultFpsResolution: "1080p @ 25 FPS",
  },
} as const;



export const VIDEO_TESTING = {
  referenceBoxClass: "w-full rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-slate-200",
  portraitCardClass: "shrink-0 w-40 rounded-lg border border-slate-600 bg-slate-950 p-3 space-y-2",
  cameraInputClass: "min-w-0 flex-1 rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100",
  cameraQueryStaleMs: 15000,
  extensions: [".mp4", ".avi", ".mov", ".mkv", ".webm", ".m4v"] as string[],
  maxBytes: 500 * 1024 * 1024,
  uploadTimeoutMs: 10 * 60 * 1000,
  panelClass: "flex flex-wrap items-center gap-3 p-3 border-t border-slate-700 bg-slate-950 text-slate-200",
  buttonClass: "inline-flex items-center justify-center rounded border border-cyan-700/80 bg-slate-900 px-3 py-1.5 text-xs font-medium text-cyan-200 hover:bg-slate-800 hover:border-cyan-500 whitespace-nowrap cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  dialogBackdropClass: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4",
  dialogClass: "w-full max-w-5xl max-h-[95vh] overflow-auto rounded-xl border border-slate-600 bg-slate-950 p-4 space-y-3 text-slate-100",
  boxClass: "absolute border-2 border-cyan-400 bg-transparent hover:bg-cyan-400/20",
  selectedBoxClass: "absolute border-4 border-amber-400 bg-amber-400/20",
  boxLabelClass: "absolute top-0 left-0 whitespace-nowrap bg-slate-950 text-xs text-white px-1",
} as const;

export const REID_UI = {
  panelClass: "rounded-xl border border-slate-700 bg-slate-950 p-4 text-slate-200 space-y-4",
  mutedClass: "text-sm text-slate-400",
  errorClass: "text-sm text-amber-300",
  cardClass: "rounded-lg border border-slate-700 bg-slate-900 p-3 space-y-2",
  portraitClass: "h-40 w-20 object-contain rounded bg-slate-950",
  stateLabels: {
    collecting: "Collecting clear ground frames",
    searching: "Waiting for complete aerial tracks and matching results",
    candidates: "Possible aerial matches — review visually",
    no_match: "No candidate meets the configured similarity threshold",
  },
} as const;
