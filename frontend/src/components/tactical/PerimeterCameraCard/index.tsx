"use client";

import React from "react";
import { PerimeterCameraCardProps } from "@/types";
import { PerimeterCardHeader } from "./PerimeterCardHeader";
import { PerimeterPowerStatus } from "./PerimeterPowerStatus";
import { PerimeterOpticsGrid } from "./PerimeterOpticsGrid";
import { PerimeterNetworkStatus } from "./PerimeterNetworkStatus";
import { PerimeterActionButtons } from "./PerimeterActionButtons";

export const PerimeterCameraCard: React.FC<PerimeterCameraCardProps> = ({
  onOpenWall,
  onReconnectStream,
  className = "",
}) => {
  return (
    <div
      className={`glass-panel p-4 rounded-xl flex flex-col gap-3.5 border border-slate-800 interactive-tactical-tile ${className}`}
    >
      {/* 1. Card Header: CCTV Sensor ID & Secure State */}
      <PerimeterCardHeader />

      {/* 2. PoE 48V / Mains Continuous Power Telemetry */}
      <PerimeterPowerStatus />

      {/* 3. Fixed Mount & Optics Specifications Grid */}
      <PerimeterOpticsGrid />

      {/* 4. RTSP Stream Network & CV AI Condition */}
      <PerimeterNetworkStatus />

      {/* 5. Camera Management Action Directives */}
      <PerimeterActionButtons
        onOpenWall={onOpenWall}
        onReconnectStream={onReconnectStream}
      />
    </div>
  );
};

export default PerimeterCameraCard;
export * from "./PerimeterCardHeader";
export * from "./PerimeterPowerStatus";
export * from "./PerimeterOpticsGrid";
export * from "./PerimeterNetworkStatus";
export * from "./PerimeterActionButtons";
