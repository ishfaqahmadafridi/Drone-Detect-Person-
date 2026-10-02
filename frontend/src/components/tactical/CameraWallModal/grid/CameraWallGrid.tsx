"use client";

import React from "react";
import { CameraWallGridProps } from "@/types";
import { DEFAULT_TACTICAL_CAMERAS } from "@/constants/tactical";
import { CameraWallCard } from "../CameraWallCard";
import { AddSensorCard } from "./AddSensorCard";

export const CameraWallGrid: React.FC<CameraWallGridProps> = ({
  activeSource,
  activeCameraId,
  connectedCameraIds,
  onSelectFeed,
  onToggleConnectCamera,
  onLaunchSplit,
  onOpenWizard,
}) => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
      {DEFAULT_TACTICAL_CAMERAS.map((cam) => {
        const isCamActive =
          activeCameraId === cam.id ||
          (activeSource === cam.sourceType && cam.deviceType === "drone_uav");
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
