/**
 * Tactical Network & WebSocket Configuration Constants
 */
export const NETWORK_CONFIG = {
  API_TIMEOUT_MS: 15000,
  WS_RECONNECT_INTERVAL_MS: 3000,
  WS_TELEMETRY_PATH: "/ws/telemetry",
  DEV_FRONTEND_PORT: "3000",
  DEV_API_PORT: "8000",
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

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host =
    window.location.port === "3000"
      ? `${window.location.hostname}:8000`
      : window.location.host;

  return `${protocol}//${host}${NETWORK_CONFIG.WS_TELEMETRY_PATH}${channel ? `?channel=${channel}` : ""}`;
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
