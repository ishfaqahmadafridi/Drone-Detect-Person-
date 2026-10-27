"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { PerimeterSecurityDeckProps } from "@/types";
import { PerimeterDeckHeader } from "./PerimeterDeckHeader";
import { PerimeterTelemetryBar } from "./PerimeterTelemetryBar";
import { PerimeterActionGrid } from "./PerimeterActionGrid";

export const PerimeterSecurityDeck: React.FC<PerimeterSecurityDeckProps> = ({
  onReconnectStream,
  onSnapshotTrigger,
  className = "",
}) => {
  return (
    <div
      className={`${TACTICAL_VIEW_STYLES.PerimeterCameraCard_div_className}${className}`}
    >
      {/* 1. Perimeter Deck Title & Status Header */}
      <PerimeterDeckHeader />

      {/* 2. Perimeter Telemetry Specs Bar */}
      <PerimeterTelemetryBar />

      {/* 3. Tactical Action & Zoom Controls Grid */}
      <PerimeterActionGrid
        onReconnectStream={onReconnectStream}
        onSnapshotTrigger={onSnapshotTrigger}
      />
    </div>
  );
};

export default PerimeterSecurityDeck;
export * from "./PerimeterDeckHeader";
export * from "./PerimeterTelemetryBar";
export * from "./PerimeterActionGrid";
