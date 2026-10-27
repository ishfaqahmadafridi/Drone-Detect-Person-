import { useAppDispatch, useAppSelector } from "@/store";
import { setViewportLayout, setTrackingMode } from "@/store/slices/telemetrySlice";
import { usePerspectiveSelection } from "./usePerspectiveSelection";
import { trackingApi } from "@/services/api/trackingApi";
import { useChannelPanel } from "./useChannelPanel";
import type { ViewportLayoutMode, StreamChannel } from "@/types";
import { useCameraFleet } from "./useCameraFleet";

export function useVideoViewport() {
  const dispatch = useAppDispatch();
  const { view_mode, viewport_layout, connected_camera_ids, tracking_mode } = useAppSelector(state => state.telemetry);
  const channel: StreamChannel = view_mode === "ground" ? "ground" : "aerial";
  const panel = useChannelPanel(channel);
  const { cameras } = useCameraFleet();
  const connectedCount = cameras.filter(camera => camera.viewMode === channel && connected_camera_ids.includes(camera.id)).length;
  const portraits = useAppSelector(state => state.ui.suspectPortraits);
  const handleViewSelect = usePerspectiveSelection();

  const handleTrackingModeChange = async (mode: "auto" | "manual") => {
    dispatch(setTrackingMode(mode));
    try {
      await trackingApi.setMode(mode, mode === "manual" ? panel.telemetry.selected_target_ids : [], channel);
    } catch {
      // Stream state will reconcile on next telemetry frame
    }
  };

  const handleClearSelectedTargets = async () => {
    try {
      await trackingApi.clearTargets(channel);
      await trackingApi.setMode("auto", [], channel);
      dispatch(setTrackingMode("auto"));
    } catch {
      // Reconciled via telemetry
    }
  };

  return {
    sourceType: panel.sourceType,
    fps: panel.telemetry.fps ?? 0,
    containerRef: panel.containerRef,
    streamKey: panel.revision,
    rtspInput: panel.networkUrl,
    setRtspInput: panel.setNetworkUrl,
    showRtspField: panel.showNetwork,
    isConnectingRtsp: panel.pending,
    toggleFullscreen: panel.toggleFullscreen,
    handleRtspSubmit: panel.submitNetwork,
    handleSourceSelect: panel.selectSource,
    handleViewSelect,
    viewMode: channel,
    streamError: panel.streamError,
    handleStreamError: () => panel.setStreamError(true),
    handleStreamLoad: () => panel.setStreamError(false),
    trackingMode: panel.telemetry.tracking_mode ?? tracking_mode ?? "auto",
    selectedTargetIds: panel.telemetry.selected_target_ids ?? [],
    handleTrackingModeChange,
    handleClearSelectedTargets,
    upload: panel.upload,
    portraits,
    error: panel.error,
    replay: panel.replay,
    videoFinished: panel.telemetry.video_finished,
    viewportLayout: connectedCount > 1 ? viewport_layout : "single",
    handleLayoutChange: (layout: ViewportLayoutMode) => dispatch(setViewportLayout(layout)),
  };
}
