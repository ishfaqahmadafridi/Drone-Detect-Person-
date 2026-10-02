import { useMemo } from "react";
import {
  UseViewportSplitGridProps,
  UseViewportSplitGridReturn,
  TacticalCameraChannel,
} from "@/types";
import {
  DEFAULT_TACTICAL_CAMERAS,
  DEFAULT_CONNECTED_CAMERA_IDS,
} from "@/constants/tactical";
import { filterConnectedChannels, getSplitGridLayoutClass } from "@/utils";
import { useAppSelector, useAppDispatch } from "@/store";
import { toggleConnectCamera } from "@/store/slices/telemetrySlice";

export const useViewportSplitGrid = ({
  layoutMode,
  onSelectCamera,
}: UseViewportSplitGridProps): UseViewportSplitGridReturn => {
  const dispatch = useAppDispatch();
  const connectedIds = useAppSelector(
    (state) => state.telemetry.connected_camera_ids || DEFAULT_CONNECTED_CAMERA_IDS
  );

  const channelsToDisplay = useMemo(
    () => filterConnectedChannels(DEFAULT_TACTICAL_CAMERAS, connectedIds, layoutMode),
    [connectedIds, layoutMode]
  );

  const gridClass = useMemo(
    () => getSplitGridLayoutClass(channelsToDisplay.length),
    [channelsToDisplay.length]
  );

  const handlePromoteCamera = (channel: TacticalCameraChannel) => {
    onSelectCamera(channel);
  };

  const handleDisconnectCamera = (cameraId: string) => {
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
