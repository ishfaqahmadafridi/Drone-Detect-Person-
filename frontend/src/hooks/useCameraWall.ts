import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useStreamMutation } from "@/services/queries/useStreamMutation";
import { useAppDispatch, useAppSelector } from "@/store";
import { setActiveCamera, toggleConnectCamera, setConnectedCameras, setViewportLayout } from "@/store/slices/telemetrySlice";
import { setSuspectPortraits } from "@/store/slices/uiSlice";
import { cameraApi } from "@/services/api/cameraApi";
import { streamApi } from "@/services/api/streamApi";
import { useCameraFleet, CAMERA_FLEET_QUERY_KEY } from "./useCameraFleet";
import type { StreamSourceType, TacticalCameraChannel } from "@/types";

export function useCameraWall() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { cameras } = useCameraFleet();
  const { source_type, active_camera_id, connected_camera_ids, view_mode, primary_camera_ids } = useAppSelector(state => state.telemetry);
  const { switchView } = useStreamMutation();

  const toggleConnect = async (cameraId: string) => {
    if (connected_camera_ids.includes(cameraId)) {
      if (cameraId === active_camera_id) {
        const replacement = cameras.find(camera => camera.viewMode === view_mode && camera.id !== cameraId && connected_camera_ids.includes(camera.id));
        if (!replacement) return;
        await selectFeed(replacement.sourceType, replacement.viewMode, replacement);
      }
      dispatch(toggleConnectCamera(cameraId));
    } else {
      dispatch(setConnectedCameras([...new Set([...connected_camera_ids, primary_camera_ids[view_mode === "ground" ? "ground" : "aerial"], cameraId])]));
    }
    dispatch(setViewportLayout("dual"));
  };

  const connectAll = () => {
    dispatch(setConnectedCameras([...new Set([...connected_camera_ids, ...cameras.filter(camera => camera.viewMode === view_mode).map(camera => camera.id)])]));
    dispatch(setViewportLayout("quad"));
  };

  const selectFeed = async (feedType: StreamSourceType, viewMode: "aerial" | "ground", camera?: TacticalCameraChannel) => {
    if (camera) {
      await streamApi.selectCamera(camera.id);
      if (viewMode === "ground" && camera.id !== active_camera_id) dispatch(setSuspectPortraits([]));
      dispatch(setActiveCamera(camera));
      dispatch(setConnectedCameras([...new Set([...connected_camera_ids, primary_camera_ids[viewMode], camera.id])]));
      dispatch(setViewportLayout("dual"));
    } else {
      await streamApi.switchSource(feedType, undefined, viewMode);
      if (viewMode === "ground") dispatch(setSuspectPortraits([]));
    }
    await switchView.mutateAsync(viewMode);
    setIsOpen(false);
  };

  const connectRtsp = async (url: string, viewMode: "aerial" | "ground" = "ground") => {
    const isHttp = url.startsWith("http://") || url.startsWith("https://");
    const sourceType: StreamSourceType = isHttp ? "http" : "rtsp";
    const camera = await cameraApi.registerCamera({
      name: isHttp ? "Mobile IP Camera" : `Ground camera ${cameras.filter(camera => camera.viewMode === "ground").length + 1}`,
      location: isHttp ? "Smartphone Patrol Link" : "Ground perimeter",
      source_type: sourceType,
      view_mode: viewMode,
      stream_url: url,
      device_type: isHttp ? "mobile_phone" : "poe_cctv",
    });
    await queryClient.invalidateQueries({ queryKey: CAMERA_FLEET_QUERY_KEY });
    await selectFeed(sourceType, viewMode, camera);
    dispatch(setViewportLayout("dual"));
  };

  return {
    isWallOpen: isOpen,
    activeSource: source_type,
    activeCameraId: active_camera_id,
    connectedCameraIds: connected_camera_ids,
    openWall: () => setIsOpen(true),
    closeWall: () => setIsOpen(false),
    selectFeed,
    connectRtsp,
    toggleConnect,
    connectAll,
    setLayout: (layout: "single" | "dual" | "quad") => dispatch(setViewportLayout(layout)),
  };
}
