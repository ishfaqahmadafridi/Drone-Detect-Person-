import { useAppDispatch, useAppSelector } from "@/store";
import { setViewportLayout, setActiveCamera } from "@/store/slices/telemetrySlice";
import { useStreamMutation } from "@/services/queries/useStreamMutation";
import { useChannelPanel } from "./useChannelPanel";
import type { ViewportLayoutMode, StreamChannel } from "@/types";
import { useCameraFleet } from "./useCameraFleet";

export function useVideoViewport() {
  const dispatch = useAppDispatch();
  const { view_mode, viewport_layout, connected_camera_ids, primary_camera_ids } = useAppSelector(state => state.telemetry);
  const channel: StreamChannel = view_mode === "ground" ? "ground" : "aerial";
  const panel = useChannelPanel(channel);
  const { cameras } = useCameraFleet();
  const connectedCount = cameras.filter(camera => camera.viewMode === channel && connected_camera_ids.includes(camera.id)).length;
  const portraits = useAppSelector(state => state.ui.suspectPortraits);
  const { switchView } = useStreamMutation();
  const handleViewSelect = async (view: StreamChannel) => {
    await switchView.mutateAsync(view);
    const camera = cameras.find(camera => camera.id === primary_camera_ids[view]);
    if (camera) dispatch(setActiveCamera(camera));
    const count = cameras.filter(camera => camera.viewMode === view && connected_camera_ids.includes(camera.id)).length;
    dispatch(setViewportLayout(count > 1 ? "dual" : "single"));
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
    selectedTargetIds: panel.telemetry.selected_target_ids ?? [],
    upload: panel.upload,
    portraits,
    error: panel.error,
    replay: panel.replay,
    videoFinished: panel.telemetry.video_finished,
    viewportLayout: connectedCount > 1 ? viewport_layout : "single",
    handleLayoutChange: (layout: ViewportLayoutMode) => dispatch(setViewportLayout(layout)),
  };
}
