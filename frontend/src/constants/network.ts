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
 * Resolves the appropriate MJPEG video stream URL.
 * When developing on port 3000, connects directly to FastAPI on port 8000 to
 * prevent Next.js dev server proxy buffering or socket timeouts on chunked streams.
 */
export function getVideoStreamUrl(streamKey?: number): string {
  if (typeof window === "undefined") {
    return `/api/stream/video_feed${streamKey !== undefined ? `?t=${streamKey}` : ""}`;
  }

  const host =
    window.location.port === "3000"
      ? `${window.location.hostname}:8000`
      : window.location.host;

  const protocol = window.location.protocol;
  const basePath = window.location.port === "3000" ? "/stream/video_feed" : "/api/stream/video_feed";
  const query = streamKey !== undefined ? `?t=${streamKey}` : "";

  return `${protocol}//${host}${basePath}${query}`;
}
