"use client";

import React from "react";
import { ViewportHeaderProps } from "@/types";
import { SensorTitleCluster } from "./SensorTitleCluster";
import { SourceBadge } from "./SourceBadge";
import { PerspectiveBadge } from "./PerspectiveBadge";
import { DetectionModeToggle } from "./DetectionModeToggle";
import { ViewportHeaderActions } from "./ViewportHeaderActions";

export const ViewportHeader: React.FC<ViewportHeaderProps> = ({
  sourceType,
  viewMode = "aerial",
  trackingMode = "auto",
  selectedCount = 0,
  onTrackingModeChange,
  onClearSelectedTargets,
  onSnapshotTrigger,
  onToggleFullscreen,
}) => {
  return (
    <div className="flex items-center justify-between p-3 px-4 bg-slate-950/60 border-b border-slate-800">
      {/* Primary Optical Sensor Telemetry Cluster */}
      <div className="flex items-center gap-2.5">
        <SensorTitleCluster />
        <SourceBadge sourceType={sourceType} />
        <PerspectiveBadge viewMode={viewMode} />
        <DetectionModeToggle
          trackingMode={trackingMode}
          selectedCount={selectedCount}
          onTrackingModeChange={onTrackingModeChange}
          onClearSelectedTargets={onClearSelectedTargets}
        />
      </div>

      {/* Viewport Action Controls */}
      <ViewportHeaderActions
        onSnapshotTrigger={onSnapshotTrigger}
        onToggleFullscreen={onToggleFullscreen}
      />
    </div>
  );
};

export default ViewportHeader;
export * from "./SensorTitleCluster";
export * from "./SourceBadge";
export * from "./PerspectiveBadge";
export * from "./DetectionModeToggle";
export * from "./ViewportHeaderActions";
