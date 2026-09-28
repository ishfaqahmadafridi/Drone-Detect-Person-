"use client";

import React from "react";
import { MissionCommandViewportProps } from "@/types";
import { Header } from "./Header";
import { TacticalViewRouter } from "./views/TacticalViewRouter";

export const MissionCommandViewport: React.FC<MissionCommandViewportProps> = ({
  activeTab,
  avionics,
  flightState,
  altitude,
  batteryPercent,
  isCommandPending,
  onCommand,
  onConnectWebcam,
  onOpenFlightDeck,
  onRefresh,
  onOpenWall,
}) => {
  return (
    <main className="flex-1 flex flex-col h-full overflow-y-auto min-w-0 p-3.5 md:p-5 gap-4">
      {/* Top Tactical Header */}
      <Header
        onRefresh={onRefresh}
        onOpenWall={onOpenWall}
        avionics={avionics}
      />

      {/* Dynamic Command Modes */}
      <TacticalViewRouter
        activeTab={activeTab}
        onSnapshotTrigger={onRefresh}
        flightState={flightState}
        altitude={altitude}
        batteryPercent={batteryPercent}
        isCommandPending={isCommandPending}
        onCommand={onCommand}
        onConnectWebcam={onConnectWebcam}
        onOpenFlightDeck={onOpenFlightDeck}
        avionics={avionics}
      />
    </main>
  );
};
