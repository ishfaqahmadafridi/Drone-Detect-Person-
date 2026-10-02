"use client";

import React from "react";
import { MissionCommandViewportProps } from "@/types";
import { TacticalViewRouter } from "./views/TacticalViewRouter";

export const MissionCommandViewport: React.FC<MissionCommandViewportProps> = ({
  activeTab,
  avionics,
  flightState,
  altitude,
  batteryPercent,
  isCommandPending,
  onCommand,
  onConnectAirLink,
  onOpenFlightDeck,
  onRefresh,
  onSnapshotTrigger,
  viewMode,
  onOpenWall,
  onTabChange,
}) => {
  return (
    <main className="flex-1 flex flex-col h-full overflow-y-auto min-w-0 p-4 md:p-6 gap-5">
      {/* Dynamic Command Modes */}
      <TacticalViewRouter
        activeTab={activeTab}
        onSnapshotTrigger={onSnapshotTrigger || onRefresh}
        flightState={flightState}
        altitude={altitude}
        batteryPercent={batteryPercent}
        isCommandPending={isCommandPending}
        onCommand={onCommand}
        onConnectAirLink={onConnectAirLink}
        onOpenFlightDeck={onOpenFlightDeck}
        avionics={avionics}
        viewMode={viewMode}
        onOpenWall={onOpenWall}
        onTabChange={onTabChange}
      />
    </main>
  );
};
