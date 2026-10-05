"use client";

import React from "react";
import { ViewportHeaderProps } from "@/types";
import { SensorTitleCluster } from "./SensorTitleCluster";
import { SourceBadge } from "./SourceBadge";
import { PerspectiveBadge } from "./PerspectiveBadge";
import { ViewportLayoutSelector } from "./ViewportLayoutSelector";
import { ViewportHeaderActions } from "./ViewportHeaderActions";

export const ViewportHeader: React.FC<ViewportHeaderProps> = ({
  sourceType,
  viewMode = "aerial",
  layoutMode = "single",
  onLayoutChange,
  onSnapshotTrigger,
  onToggleFullscreen,
}) => {
  return (
    <div className="flex flex-wrap gap-3 items-center justify-between p-3 px-4 bg-slate-950/60 border-b border-slate-700/60">
      {/* Primary Optical Sensor Telemetry Cluster */}
      <div className="flex items-center gap-2.5">
        <SensorTitleCluster />
        <SourceBadge sourceType={sourceType} />
        <PerspectiveBadge viewMode={viewMode} />
      </div>

      {/* Viewport Layout Mode Selector & Action Controls */}
      <div className="flex items-center gap-3">
        {onLayoutChange && (
          <ViewportLayoutSelector
            layoutMode={layoutMode}
            onLayoutChange={onLayoutChange}
          />
        )}
        <ViewportHeaderActions
          onSnapshotTrigger={onSnapshotTrigger}
          onToggleFullscreen={onToggleFullscreen}
        />
      </div>
    </div>
  );
};

export default ViewportHeader;
export * from "./SensorTitleCluster";
export * from "./SourceBadge";
export * from "./PerspectiveBadge";
export * from "./DetectionModeToggle";
export * from "./ViewportLayoutSelector";
export * from "./ViewportHeaderActions";
