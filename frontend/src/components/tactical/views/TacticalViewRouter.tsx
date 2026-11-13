"use client";

import React from "react";
import { TacticalViewRouterProps } from "@/types";
import { AirspaceCommandView } from "./AirspaceCommandView";
import { IncidentAuditView } from "./IncidentAuditView";
import { CalibrationView } from "./CalibrationView";
import { RecordingsView } from "./RecordingsView";

export const TacticalViewRouter: React.FC<TacticalViewRouterProps> = ({
  activeTab,
  onSnapshotTrigger,
  isCommandPending,
  onCommand,
  viewMode,
  onOpenWall,
  onTabChange,
}) => {
  switch (activeTab) {
    case "incidents":
      return <IncidentAuditView />;
    case "recordings":
      return <RecordingsView />;
    case "settings":
      return (
        <CalibrationView
          viewMode={viewMode}
          onOpenWall={onOpenWall}
        />
      );
    case "airspace":
    default:
      return (
        <AirspaceCommandView
          onSnapshotTrigger={onSnapshotTrigger}
          isCommandPending={isCommandPending}
          onCommand={onCommand}
          viewMode={viewMode}
          onOpenWall={onOpenWall}
          onTabChange={onTabChange}
        />
      );
  }
};
