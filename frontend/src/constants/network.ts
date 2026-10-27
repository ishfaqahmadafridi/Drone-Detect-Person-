/**
 * Tactical Network & WebSocket Configuration Constants
 */
import deployment from "./deployment.json";

export const NETWORK_CONFIG = {
  API_BASE_PATH: `${process.env.NEXT_PUBLIC_API_ORIGIN?.replace(/\/$/, "") ?? ""}${deployment.apiBasePath}`,
  API_TIMEOUT_MS: 15000,
  WS_RECONNECT_INTERVAL_MS: 3000,
  WS_TELEMETRY_PATH: "/ws/telemetry",
  DEV_FRONTEND_PORT: deployment.frontendPort,
  DEV_API_PORT: deployment.backendPort,
} as const;

export const DRONE_CONTROL_PATHS = {
  status: "/drone/manual/status",
  connect: "/drone/manual/connect",
  input: "/drone/manual/input",
  action: "/drone/manual/action",
  disconnect: "/drone/manual/disconnect",
} as const;

export function resolveVideoStreamUrl(path: string): string {
  const configuredOrigin = process.env.NEXT_PUBLIC_VIDEO_STREAM_ORIGIN?.replace(/\/$/, "");
  if (configuredOrigin) return `${configuredOrigin}${path}`;
  if (typeof window !== "undefined" && window.location.protocol === "http:" && window.location.port === NETWORK_CONFIG.DEV_FRONTEND_PORT) {
    // Continuous MJPEG responses use a separate browser connection pool from REST.
    return `http://${window.location.hostname}:${NETWORK_CONFIG.DEV_API_PORT}${path}`;
  }
  return path;
}

/**
 * Resolves the appropriate WebSocket URL based on runtime browser environment.
 */
export function getWebSocketTelemetryUrl(channel?: "ground" | "aerial"): string {
  if (typeof window === "undefined") return "";

  const origin = process.env.NEXT_PUBLIC_WS_ORIGIN || process.env.NEXT_PUBLIC_API_ORIGIN ||
    (window.location.port === NETWORK_CONFIG.DEV_FRONTEND_PORT
      ? `${window.location.protocol}//${window.location.hostname}:${NETWORK_CONFIG.DEV_API_PORT}`
      : window.location.origin);
  const url = new URL(NETWORK_CONFIG.WS_TELEMETRY_PATH, origin);
  url.protocol = url.protocol === "https:" || url.protocol === "wss:" ? "wss:" : "ws:";
  if (channel) url.searchParams.set("channel", channel);
  return url.toString();
}

export function getCameraStreamUrl(cameraId: string): string {
  return `/api/stream/video_feed?camera_id=${encodeURIComponent(cameraId)}`;
}

/**
 * Resolves the MJPEG video stream URL.
 * Always returns a relative /api path so SSR and client renders produce the same URL,
 * eliminating the React hydration mismatch.
 * Next.js rewrites /api -> http://localhost:8000 so the stream works correctly in dev.
 */
export function getVideoStreamUrl(streamKey?: number): string {
  const query = streamKey !== undefined ? `?t=${streamKey}` : "";
  return `/api/stream/video_feed${query}`;
}

export const CHANNEL_POLL_INTERVAL_MS = 1500;
export const CHANNEL_STATUS_PATH = "/stream/status";
export const PRIMARY_CAMERA_PATH = "/stream/camera";
export const CHANNEL_REPLAY_PATH = "/stream/replay";
export const REID_API = { status: "/reid/status", retry: "/reid/retry", pollIntervalMs: 2000 } as const;
export function getChannelStreamUrl(channel: "ground" | "aerial", revision: number, cameraId?: string) {
  return `/api/stream/video_feed?channel=${channel}&t=${revision}${cameraId ? `&camera_id=${encodeURIComponent(cameraId)}` : ""}`;
}
export function getChannelSnapshotUrl(channel: "ground" | "aerial") {
  return `/api/stream/snapshot?channel=${channel}`;
}
