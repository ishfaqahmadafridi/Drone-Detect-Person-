import { useMemo } from "react";
import {
  UseViewportSplitGridProps,
  UseViewportSplitGridReturn,
  TacticalCameraChannel,
} from "@/types";
import { DEFAULT_CONNECTED_CAMERA_IDS } from "@/constants/tactical";
import { getSplitGridLayoutClass } from "@/utils";
import { useCameraFleet } from "./useCameraFleet";
import { useAppSelector, useAppDispatch } from "@/store";
import { toggleConnectCamera } from "@/store/slices/telemetrySlice";

export const useViewportSplitGrid = ({
  onSelectCamera,
}: UseViewportSplitGridProps): UseViewportSplitGridReturn => {
  const dispatch = useAppDispatch();
  const { cameras } = useCameraFleet();
  const viewMode = useAppSelector(state => state.telemetry.view_mode);
  const activeId = useAppSelector(state => state.telemetry.active_camera_id);
  const connectedIds = useAppSelector(
    (state) => state.telemetry.connected_camera_ids || DEFAULT_CONNECTED_CAMERA_IDS
  );

  const channelsToDisplay = useMemo(
    () => cameras.filter(camera => connectedIds.includes(camera.id) && camera.viewMode === viewMode),
    [cameras, connectedIds, viewMode]
  );

  const gridClass = useMemo(
    () => getSplitGridLayoutClass(channelsToDisplay.length),
    [channelsToDisplay.length]
  );

  const handlePromoteCamera = (channel: TacticalCameraChannel) => {
    onSelectCamera(channel);
  };

  const handleDisconnectCamera = async (cameraId: string) => {
    if (cameraId === activeId) {
      const replacement = channelsToDisplay.find(camera => camera.id !== cameraId);
      if (!replacement) return;
      await onSelectCamera(replacement);
    }
    dispatch(toggleConnectCamera(cameraId));
  };

  return {
    channelsToDisplay,
    gridClass,
    handlePromoteCamera,
    handleDisconnectCamera,
  };
};

export default useViewportSplitGrid;
