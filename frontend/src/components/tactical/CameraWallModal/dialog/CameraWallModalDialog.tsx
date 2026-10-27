"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { CameraWallModalDialogProps } from "@/types";
import { CameraWallHeader } from "../header";
import { CameraWallGrid } from "../grid";

export const CameraWallModalDialog: React.FC<CameraWallModalDialogProps> = ({
  onClose,
  connectedCount,
  totalCount,
  onConnectAll,
  onLaunchSplit,
  activeSource,
  activeCameraId,
  connectedCameraIds,
  onSelectFeed,
  onToggleConnectCamera,
  onOpenWizard,
}) => {
  return (
    <div className={TACTICAL_VIEW_STYLES.CameraWallModalDialog_div_className}>
      <div className={TACTICAL_VIEW_STYLES.CameraWallModalDialog_div_className_2}>
        {/* 1. Modal Tactical Header */}
        <CameraWallHeader
          onClose={onClose}
          connectedCount={connectedCount}
          totalCount={totalCount}
          onConnectAll={onConnectAll}
          onLaunchSplit={onLaunchSplit}
        />

        {/* 2. Tactical Sensor Matrix Grid */}
        <CameraWallGrid
          activeSource={activeSource}
          activeCameraId={activeCameraId}
          connectedCameraIds={connectedCameraIds}
          onSelectFeed={onSelectFeed}
          onToggleConnectCamera={onToggleConnectCamera}
          onLaunchSplit={onLaunchSplit}
          onOpenWizard={onOpenWizard}
        />
      </div>
    </div>
  );
};

export default CameraWallModalDialog;
