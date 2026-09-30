/**
 * Tactical Network & WebSocket Configuration Constants
 */
export const NETWORK_CONFIG = {
  API_TIMEOUT_MS: 15000,
  WS_RECONNECT_INTERVAL_MS: 3000,
  WS_TELEMETRY_PATH: "/ws/telemetry",
} as const;

/**
 * Resolves the appropriate WebSocket URL based on runtime browser environment.
 */
export function getWebSocketTelemetryUrl(): string {
  if (typeof window === "undefined") return "";

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host =
    window.location.port === "3000"
      ? `${window.location.hostname}:8000`
      : window.location.host;

  return `${protocol}//${host}${NETWORK_CONFIG.WS_TELEMETRY_PATH}`;
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
