"use client";

import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setIsEditingZone } from "@/store/slices/uiSlice";
import { useConfigMutation } from "@/services/queries/useConfigMutation";
import { useStreamMutation } from "@/services/queries/useStreamMutation";
import { useFullscreen } from "./useFullscreen";
import { useZoneCanvas } from "./useZoneCanvas";
import { StreamSourceType } from "@/types";

export function useVideoViewport() {
  const dispatch = useAppDispatch();
  const { fps, source_type, view_mode, zone_polygon } = useAppSelector((state) => state.telemetry);
  const { isEditingZone } = useAppSelector((state) => state.ui);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [streamKey, setStreamKey] = useState<number>(0);
  const [streamError, setStreamError] = useState<boolean>(false);
  const [rtspInput, setRtspInput] = useState("http://10.10.20.117:8080");
  const [showRtspField, setShowRtspField] = useState(false);

  const configMutation = useConfigMutation();
  const { switchSource, switchView } = useStreamMutation();
  const { toggleFullscreen } = useFullscreen(containerRef);

  const handleViewSelect = async (view: "aerial" | "ground") => {
    setStreamError(false);
    await switchView.mutateAsync(view);
    await switchSource.mutateAsync({ sourceType: "synthetic" });
    setStreamKey((prev) => prev + 1);
  };

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    saveZone,
    resetZone,
    clearZone,
    syncPolygon,
  } = useZoneCanvas({
    canvasRef,
    isEditingZone,
    initialPolygon: zone_polygon,
    onSaveZone: async (points) => {
      await configMutation.mutateAsync({ zone_polygon: points });
    },
  });

  const handleStartEditing = () => {
    if (!isEditingZone) {
      syncPolygon(zone_polygon);
    }
    dispatch(setIsEditingZone(!isEditingZone));
  };

  const handleSaveAndClose = async () => {
    await saveZone();
    dispatch(setIsEditingZone(false));
  };

  const handleResetAndClose = async () => {
    await resetZone();
    dispatch(setIsEditingZone(false));
  };

  const handleClearAndClose = async () => {
    await clearZone();
    dispatch(setIsEditingZone(false));
  };

  const handleCancel = () => {
    dispatch(setIsEditingZone(false));
  };

  const handleRtspSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rtspInput.trim()) return;
    setStreamError(false);
    await switchSource.mutateAsync({ sourceType: "rtsp", sourcePath: rtspInput.trim() });
    setStreamKey((prev) => prev + 1);
    setShowRtspField(false);
  };

  const handleSourceSelect = async (type: StreamSourceType) => {
    if (type === "rtsp") {
      setShowRtspField(true);
    } else {
      setShowRtspField(false);
      setStreamError(false);
      await switchSource.mutateAsync({ sourceType: type });
      setStreamKey((prev) => prev + 1);
    }
  };

  const handleStreamError = () => {
    setStreamError(true);
    setTimeout(() => {
      setStreamError(false);
      setStreamKey((prev) => prev + 1);
    }, 2000);
  };

  const handleStreamLoad = () => {
    setStreamError(false);
  };

  return {
    sourceType: source_type,
    fps,
    isEditingZone,
    containerRef,
    canvasRef,
    streamKey,
    streamError,
    rtspInput,
    setRtspInput,
    showRtspField,
    isConnectingRtsp: switchSource.isPending,
    toggleFullscreen,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleStartEditing,
    handleSaveAndClose,
    handleResetAndClose,
    handleClearAndClose,
    handleCancel,
    handleRtspSubmit,
    handleSourceSelect,
    handleViewSelect,
    viewMode: (view_mode as "aerial" | "ground") || "aerial",
    handleStreamError,
    handleStreamLoad,
  };
}
