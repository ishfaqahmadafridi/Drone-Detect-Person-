"use client";

import React from "react";
import { TacticalViewRouterProps } from "@/types";
import { AirspaceCommandView } from "./AirspaceCommandView";
import { ConnectionsView } from "./ConnectionsView";
import { IncidentAuditView } from "./IncidentAuditView";
import { SettingsView } from "./SettingsView";
import { RecordingsView } from "./RecordingsView";

export const TacticalViewRouter: React.FC<TacticalViewRouterProps> = ({
  activeTab,
  onSnapshotTrigger,
  viewMode,
  onOpenWall,
  onTabChange,
}) => {
  switch (activeTab) {
    case "connections":
      return <ConnectionsView onTabChange={onTabChange} />;
    case "incidents":
      return <IncidentAuditView />;
    case "recordings":
      return <RecordingsView />;
    case "settings":
      return <SettingsView />;
    case "airspace":
    default:
      return (
        <AirspaceCommandView
          onSnapshotTrigger={onSnapshotTrigger}
          viewMode={viewMode}
          onOpenWall={onOpenWall}
          onTabChange={onTabChange}
        />
      );
  }
};
