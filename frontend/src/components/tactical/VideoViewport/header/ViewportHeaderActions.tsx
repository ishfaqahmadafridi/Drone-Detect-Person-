"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { ViewportHeaderActionsProps } from "@/types";
import { Maximize, Camera } from "lucide-react";

export const ViewportHeaderActions: React.FC<ViewportHeaderActionsProps> = ({
  onSnapshotTrigger,
  onToggleFullscreen,
}) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onSnapshotTrigger}
        className={TACTICAL_VIEW_STYLES.ViewportHeaderActions_button_className}
        title="Trigger Instant Evidence Snapshot"
      >
        <Camera className={TACTICAL_VIEW_STYLES.PerimeterNetworkStatus_Network_className} />
        <span>Snap</span>
      </button>

      <button
        onClick={onToggleFullscreen}
        className={TACTICAL_VIEW_STYLES.ViewportHeaderActions_button_className_2}
        title="Toggle Fullscreen"
        aria-label="Toggle Fullscreen View"
      >
        <Maximize className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
