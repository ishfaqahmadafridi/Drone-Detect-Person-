import { useAppDispatch, useAppSelector } from "@/store";
import { setViewportLayout } from "@/store/slices/telemetrySlice";
import { useChannelPanel } from "./useChannelPanel";
import type { ViewportLayoutMode, StreamChannel } from "@/types";
import { availableViewportLayouts, resolveViewportLayout } from "@/utils/gridUtils";
import { useCameraFleet } from "./useCameraFleet";

export function useVideoViewport() {
  const dispatch = useAppDispatch();
  const { view_mode, viewport_layout, connected_camera_ids } = useAppSelector(state => state.telemetry);
  const channel: StreamChannel = view_mode === "ground" ? "ground" : "aerial";
  const panel = useChannelPanel(channel);
  const { cameras } = useCameraFleet();
  const connectedCount = cameras.filter(camera => camera.viewMode === channel && connected_camera_ids.includes(camera.id)).length;
  const portraits = useAppSelector(state => state.ui.suspectPortraits);

  const availableLayouts = availableViewportLayouts(connectedCount);
  const viewportLayout = resolveViewportLayout(viewport_layout, connectedCount);
  const handleLayoutChange = (layout: ViewportLayoutMode) => {
    if (availableLayouts.some(option => option.mode === layout)) dispatch(setViewportLayout(layout));
  };

  return {
    sourceType: panel.sourceType,
    fps: panel.telemetry.fps ?? 0,
    containerRef: panel.containerRef,
    streamKey: panel.revision,
    isConnectingRtsp: panel.pending,
    toggleFullscreen: panel.toggleFullscreen,
    isFullscreen: panel.isFullscreen,
    fullscreenSupported: panel.fullscreenSupported,
    handleSourceSelect: panel.selectSource,
    viewMode: channel,
    streamError: panel.streamError,
    handleStreamError: () => panel.setStreamError(true),
    handleStreamLoad: () => panel.setStreamError(false),
    upload: panel.upload,
    portraits,
    error: panel.error,
    replay: panel.replay,
    videoFinished: panel.telemetry.video_finished,
    viewportLayout,
    connectedCameraCount: connectedCount,
    handleLayoutChange,
  };
}
