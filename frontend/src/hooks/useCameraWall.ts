import { useState } from "react";
import { useStreamMutation } from "@/services/queries/useStreamMutation";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setActiveCamera,
  setViewportLayout,
  toggleConnectCamera,
  connectAllCameras,
} from "@/store/slices/telemetrySlice";
import { cameraApi } from "@/services/api/cameraApi";
import { StreamSourceType, TacticalCameraChannel } from "@/types";

export function useCameraWall() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { source_type, active_camera_id, connected_camera_ids } = useAppSelector(
    (state) => state.telemetry
  );
  const { switchSource, switchView } = useStreamMutation();

  const openWall = () => setIsOpen(true);
  const closeWall = () => setIsOpen(false);

  const setLayout = (mode: "single" | "dual" | "quad") => {
    dispatch(setViewportLayout(mode));
  };

  const toggleConnect = (cameraId: string) => {
    dispatch(toggleConnectCamera(cameraId));
  };

  const connectAll = () => {
    dispatch(connectAllCameras());
  };

  const selectFeed = async (
    feedType: StreamSourceType,
    viewMode: "aerial" | "ground",
    channel?: TacticalCameraChannel
  ) => {
    if (channel) {
      dispatch(
        setActiveCamera({
          id: channel.id,
          name: channel.name,
          location: channel.location,
        })
      );
      // Synchronize with backend camera registry service
      try {
        await cameraApi.activateCamera(channel.id);
      } catch {
        // Fallback to direct stream switch if needed
        await switchSource.mutateAsync({
          sourceType: feedType,
          sourcePath: channel.streamUrl,
        });
        await switchView.mutateAsync(viewMode);
      }
    } else {
      dispatch(
        setActiveCamera(
          viewMode === "aerial"
            ? { id: "CAM-01", name: "UAV-01 Aerial Gimbal", location: "North Airspace - Sector 04" }
            : { id: "CAM-02", name: "Gate 01 Perimeter CCTV", location: "North Perimeter - Gate 01" }
        )
      );
      await switchSource.mutateAsync({ sourceType: feedType });
      await switchView.mutateAsync(viewMode);
    }
    setIsOpen(false);
  };

  const connectRtsp = async (rtspUrl: string, viewMode: "aerial" | "ground" = "ground") => {
    dispatch(
      setActiveCamera({
        id: "CAM-02",
        name: "Custom RTSP Sensor",
        location: "Perimeter Stream Link",
      })
    );
    await switchSource.mutateAsync({ sourceType: "rtsp", sourcePath: rtspUrl });
    await switchView.mutateAsync(viewMode);
    setIsOpen(false);
  };

  return {
    isWallOpen: isOpen,
    activeSource: source_type,
    activeCameraId: active_camera_id,
    connectedCameraIds: connected_camera_ids || ["CAM-01", "CAM-02"],
    openWall,
    closeWall,
    selectFeed,
    connectRtsp,
    setLayout,
    toggleConnect,
    connectAll,
  };
}
