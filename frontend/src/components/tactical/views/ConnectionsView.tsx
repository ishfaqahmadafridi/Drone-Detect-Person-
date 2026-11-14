"use client";
import React from "react";
import { CONNECTIONS_UI, TACTICAL_VIEW_STYLES } from "@/constants/tactical";
import { usePerspectiveSelection } from "@/hooks/usePerspectiveSelection";
import type { ConnectionsViewProps } from "@/types";
import { DroneConnectionCard, GroundCamerasCard } from "../Connections";

export const ConnectionsView: React.FC<ConnectionsViewProps> = ({ onTabChange }) => {
  const selectPerspective = usePerspectiveSelection();
  const openFlightControls = async () => {
    await selectPerspective("aerial");
    onTabChange?.("airspace");
  };

  return (
    <div className={CONNECTIONS_UI.pageClass}>
      <h1 className={TACTICAL_VIEW_STYLES.AirspaceCommandView_h1_className}>Connections</h1>
      <div className={CONNECTIONS_UI.gridClass}>
        <DroneConnectionCard onOpenFlightControls={() => void openFlightControls()} />
        <GroundCamerasCard />
      </div>
    </div>
  );
};

export default ConnectionsView;
