import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { StreamChannel, StreamSourceType, TelemetryData } from "@/types";
import { apiClient } from "@/services/api/client";
import { streamApi } from "@/services/api/streamApi";
import { CHANNEL_POLL_INTERVAL_MS, CHANNEL_STATUS_PATH } from "@/constants/network";
import { apiErrorMessage } from "@/utils/apiError";
import { useVideoUpload } from "./useVideoUpload";
import { useFullscreen } from "./useFullscreen";
import { useAppDispatch } from "@/store";
import { setSuspectPortraits } from "@/store/slices/uiSlice";

export function useChannelPanel(channel: StreamChannel) {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const [telemetry, setTelemetry] = useState<Partial<TelemetryData>>({});
  const [revision, setRevision] = useState(0);
  const [sourceType, setSourceType] = useState<StreamSourceType>("synthetic");
  const [networkUrl, setNetworkUrl] = useState("");
  const [showNetwork, setShowNetwork] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [streamError, setStreamError] = useState(false);
  const { toggleFullscreen } = useFullscreen(containerRef);
  const upload = useVideoUpload(() => {
    if (channel === "ground") dispatch(setSuspectPortraits([]));
    setSourceType("file");
    setRevision(value => value + 1);
    setStreamError(false);
  }, channel);

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
      await streamApi.switchSource(source, path, channel);
      if (channel === "ground") dispatch(setSuspectPortraits([]));
      setSourceType(source);
      setRevision(value => value + 1);
      setStreamError(false);
      setShowNetwork(false);
    } catch (error) { setError(apiErrorMessage(error)); }
    finally { setPending(false); }
  };

  const selectSource = (source: StreamSourceType) => {
    if (source === "file") upload.inputRef.current?.click();
    else if (source === "rtsp") setShowNetwork(true);
    else void connect(source);
  };
  const submitNetwork = (event: FormEvent) => {
    event.preventDefault();
    if (networkUrl.trim()) void connect("rtsp", networkUrl.trim());
  };
  const reconnect = () => { setRevision(value => value + 1); setStreamError(false); };
  const replay = async () => {
    if (pending || upload.pending) return;
    setPending(true);
    setError("");
    try {
      await streamApi.replayVideo(channel);
      if (channel === "ground") dispatch(setSuspectPortraits([]));
      setTelemetry(value => ({ ...value, video_finished: false, selected_target_ids: [] }));
      reconnect();
    } catch (failure) { setError(apiErrorMessage(failure)); }
    finally { setPending(false); }
  };
  return { containerRef, telemetry, revision, sourceType, networkUrl, setNetworkUrl, showNetwork, pending, error, streamError, setStreamError, toggleFullscreen, upload, selectSource, submitNetwork, reconnect, replay };
}
