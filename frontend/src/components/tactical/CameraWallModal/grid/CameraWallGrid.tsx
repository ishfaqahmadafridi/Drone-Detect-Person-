"use client";

import React from "react";
import { CameraWallGridProps } from "@/types";
import { useCameraFleet } from "@/hooks/useCameraFleet";
import { useAppSelector } from "@/store";
import { CameraWallCard } from "../CameraWallCard";
import { AddSensorCard } from "./AddSensorCard";

export const CameraWallGrid: React.FC<CameraWallGridProps> = ({
  activeCameraId,
  connectedCameraIds,
  onSelectFeed,
  onToggleConnectCamera,
  onLaunchSplit,
  onOpenWizard,
}) => {
  const { cameras } = useCameraFleet();
  const viewMode = useAppSelector(state => state.telemetry.view_mode);
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
      {cameras.filter(camera => camera.viewMode === viewMode).map((cam) => {
        const isCamActive = activeCameraId === cam.id;
        const isCamConnected = connectedCameraIds.includes(cam.id);

        return (
          <CameraWallCard
            key={cam.id}
            channel={cam}
            isActive={isCamActive}
            isConnected={isCamConnected}
            onToggleConnect={() => {
              if (onToggleConnectCamera) {
                onToggleConnectCamera(cam.id);
              }
            }}
            onSelect={() => onSelectFeed(cam.sourceType, cam.viewMode, cam)}
            onLaunchSplit={onLaunchSplit}
          />
        );
      })}

      {/* "+ CONNECT NEW SENSOR" Action Card */}
      <AddSensorCard onClick={onOpenWizard} />
    </div>
  );
};

export default CameraWallGrid;
