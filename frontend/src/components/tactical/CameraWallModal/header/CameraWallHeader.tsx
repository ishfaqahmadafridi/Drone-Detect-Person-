"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { CameraWallHeaderProps } from "@/types";
import { HeaderTitleCluster } from "./HeaderTitleCluster";
import { HeaderConnectionBadge } from "./HeaderConnectionBadge";
import { HeaderActionControls } from "./HeaderActionControls";

export const CameraWallHeader: React.FC<CameraWallHeaderProps> = ({
  onClose,
  connectedCount = 2,
  totalCount = 5,
  onConnectAll,
  onLaunchSplit,
}) => {
  return (
    <div className={TACTICAL_VIEW_STYLES.CameraWallHeader_div_className}>
      {/* 1. Tactical Modal Title & Sensor Subtitle */}
      <HeaderTitleCluster />

      {/* 2. Multi-Camera Connection Telemetry & Controls */}
      <div className="flex items-center gap-2.5">
        <HeaderConnectionBadge
          connectedCount={connectedCount}
          totalCount={totalCount}
        />

        <HeaderActionControls
          onConnectAll={onConnectAll}
          onLaunchSplit={onLaunchSplit}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default CameraWallHeader;
