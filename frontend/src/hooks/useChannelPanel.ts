import { useEffect, useRef, useState } from "react";
import type { StreamChannel, StreamSourceType, TelemetryData } from "@/types";
import { apiClient } from "@/services/api/client";
import { streamApi } from "@/services/api/streamApi";
import { captureSuspect } from "@/utils/suspectCapture";
import { VIDEO_TESTING } from "@/constants/tactical";
import { CHANNEL_POLL_INTERVAL_MS, CHANNEL_STATUS_PATH } from "@/constants/network";
import { apiErrorMessage } from "@/utils/apiError";
import { useVideoUpload } from "./useVideoUpload";
import { useFullscreen } from "./useFullscreen";
import { useAppDispatch } from "@/store";
import { setSuspectPortraits } from "@/store/slices/uiSlice";
import { setTelemetryData } from "@/store/slices/telemetrySlice";

export function useChannelPanel(channel: StreamChannel) {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const [telemetry, setTelemetry] = useState<Partial<TelemetryData>>({});
  const [revision, setRevision] = useState(0);
  const [sourceType, setSourceType] = useState<StreamSourceType>("synthetic");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [streamError, setStreamError] = useState(false);
  const { toggleFullscreen, isFullscreen, fullscreenSupported } = useFullscreen(containerRef);

  const autoCaptureGround = async () => {
    if (channel !== "ground") return;
    try {
      const { result, portraits } = await captureSuspect(channel);
      dispatch(setSuspectPortraits(portraits));
      dispatch(setTelemetryData({ tracking_mode: result.mode, selected_target_ids: result.selected_ids }));
      setTimeout(() => {
        void streamApi.switchView("aerial").then(() => {
          dispatch(setTelemetryData({ view_mode: "aerial" }));
        }).catch(() => undefined);
      }, VIDEO_TESTING.aerialNavigationDelayMs);
    } catch {
      // Graceful fallback
    }
  };

  const upload = useVideoUpload(
    () => {
      if (channel === "ground") dispatch(setSuspectPortraits([]));
      setSourceType("file");
      setRevision((value) => value + 1);
      setStreamError(false);
    },
    channel,
    channel === "ground" ? autoCaptureGround : undefined
  );

  useEffect(() => {
    let disposed = false;
    let timer: ReturnType<typeof setTimeout>;
    const controller = new AbortController();
    const poll = async () => {
      try {
        const { data } = await apiClient.get<TelemetryData>(CHANNEL_STATUS_PATH, { params: { channel }, signal: controller.signal });
        if (!disposed) {
          setTelemetry(data);
          setSourceType(data.source_type);
        }
      } catch { /* The video panel exposes connection failure and retry. */ }
      if (!disposed) timer = setTimeout(poll, CHANNEL_POLL_INTERVAL_MS);
    };
    void poll();
    return () => { disposed = true; controller.abort(); clearTimeout(timer); };
  }, [channel]);

  const connect = async (source: StreamSourceType, path?: string) => {
    if (pending || upload.pending) return;
    setPending(true);
    setError("");
    try {
      const result = await streamApi.switchSource(source, path, channel);
      setSourceType(result.source_type);
      setRevision(value => value + 1);
      setStreamError(false);
    } catch (error) { setError(apiErrorMessage(error)); }
    finally { setPending(false); }
  };

  const selectSource = (source: StreamSourceType) => {
    if (source === "file") upload.inputRef.current?.click();
    else void connect(source);
  };
  const reconnect = () => { setRevision(value => value + 1); setStreamError(false); };
  const replay = async () => {
    if (pending || upload.pending) return;
    setPending(true);
    setError("");
    try {
      await streamApi.replayVideo(channel);
      setTelemetry(value => ({ ...value, video_finished: false }));
      reconnect();
    } catch (failure) { setError(apiErrorMessage(failure)); }
    finally { setPending(false); }
  };
  return { containerRef, telemetry, revision, sourceType, pending, error, streamError, setStreamError, toggleFullscreen, isFullscreen, fullscreenSupported, upload, selectSource, replay };
}
