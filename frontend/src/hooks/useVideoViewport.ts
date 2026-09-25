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
  const { fps, source_type, zone_polygon } = useAppSelector((state) => state.telemetry);
  const { isEditingZone } = useAppSelector((state) => state.ui);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [streamKey, setStreamKey] = useState<number>(0);
  const [rtspInput, setRtspInput] = useState("");
  const [showRtspField, setShowRtspField] = useState(false);
  const [showUploadField, setShowUploadField] = useState(false);

  const configMutation = useConfigMutation();
  const { switchSource, uploadVideo } = useStreamMutation();
  const { toggleFullscreen } = useFullscreen(containerRef);

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    saveZone,
    resetZone,
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

  const handleCancel = () => {
    dispatch(setIsEditingZone(false));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadVideo.mutateAsync(file);
    setShowUploadField(false);
  };

  const handleRtspSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rtspInput.trim()) return;
    await switchSource.mutateAsync({ sourceType: "rtsp", sourcePath: rtspInput.trim() });
    setShowRtspField(false);
  };

  const handleSourceSelect = async (type: StreamSourceType) => {
    if (type === "file") {
      setShowUploadField(true);
      setShowRtspField(false);
    } else if (type === "rtsp") {
      setShowRtspField(true);
      setShowUploadField(false);
    } else {
      setShowUploadField(false);
      setShowRtspField(false);
      await switchSource.mutateAsync({ sourceType: type });
    }
  };

  const handleStreamError = () => {
    setTimeout(() => setStreamKey((prev) => prev + 1), 2000);
  };

  return {
    sourceType: source_type,
    fps,
    isEditingZone,
    containerRef,
    canvasRef,
    fileInputRef,
    streamKey,
    rtspInput,
    setRtspInput,
    showRtspField,
    showUploadField,
    isUploading: uploadVideo.isPending,
    isConnectingRtsp: switchSource.isPending,
    toggleFullscreen,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleStartEditing,
    handleSaveAndClose,
    handleResetAndClose,
    handleCancel,
    handleFileUpload,
    handleRtspSubmit,
    handleSourceSelect,
    handleStreamError,
  };
}
