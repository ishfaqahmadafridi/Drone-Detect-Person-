import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setIsEditingZone } from "@/store/slices/uiSlice";
import { setTrackingMode, setSelectedTargetIds } from "@/store/slices/telemetrySlice";
import { useConfigMutation } from "@/services/queries/useConfigMutation";
import { useStreamMutation } from "@/services/queries/useStreamMutation";
import { trackingApi } from "@/services/api/trackingApi";
import { useFullscreen } from "./useFullscreen";
import { useZoneCanvas } from "./useZoneCanvas";
import { StreamSourceType, TrackingMode } from "@/types";

export function useVideoViewport() {
  const dispatch = useAppDispatch();
  const {
    fps,
    source_type,
    view_mode,
    zone_polygon,
    tracking_mode,
    selected_target_ids,
    detections,
  } = useAppSelector((state) => state.telemetry);
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

  const trackingMode: TrackingMode = (tracking_mode as TrackingMode) || "auto";
  const selectedCount = selected_target_ids?.length || 0;

  const handleTrackingModeChange = async (mode: TrackingMode) => {
    try {
      const res = await trackingApi.setMode(mode);
      dispatch(setTrackingMode(res.mode as TrackingMode));
      if (res.selected_ids) {
        dispatch(setSelectedTargetIds(res.selected_ids));
      }
    } catch (err) {
      console.error("Failed to update tracking mode:", err);
    }
  };

  const handleClearSelectedTargets = async () => {
    try {
      const res = await trackingApi.clearTargets();
      dispatch(setSelectedTargetIds(res.selected_ids || []));
    } catch (err) {
      console.error("Failed to clear manual targets:", err);
    }
  };

  const handleSelectTargetAt = async (normX: number, normY: number) => {
    if (trackingMode !== "manual") return;
    try {
      let targetId: number | undefined;
      const px = normX * 1280;
      const py = normY * 720;

      for (const d of detections || []) {
        const [x1, y1, x2, y2] = d.bbox || [0, 0, 0, 0];
        if (px >= x1 - 35 && px <= x2 + 35 && py >= y1 - 35 && py <= y2 + 35) {
          targetId = d.id;
          break;
        }
      }

      const res = await trackingApi.selectTarget({ x: normX, y: normY, target_id: targetId });
      if (res?.selected_ids) {
        dispatch(setSelectedTargetIds(res.selected_ids));
      }
    } catch (err) {
      console.error("Failed to select target:", err);
    }
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
    trackingMode,
    selectedTargetIds: selected_target_ids || [],
    selectedCount,
    handleTrackingModeChange,
    handleClearSelectedTargets,
    handleSelectTargetAt,
  };
}
