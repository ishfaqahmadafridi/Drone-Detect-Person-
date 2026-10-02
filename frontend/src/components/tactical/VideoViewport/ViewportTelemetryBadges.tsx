"use client";

import React from "react";
import { ViewportTelemetryBadgesProps } from "@/types";
import {
  SensorIdentityBadge,
  StreamStatusBadge,
  ClassificationLegendBadge,
} from "./badges";

export const ViewportTelemetryBadges: React.FC<ViewportTelemetryBadgesProps> = () => {
  return (
    <>
      {/* 1. Top-Left OSD Sensor Identifier & Timestamp */}
      <SensorIdentityBadge />

      {/* 2. Top-Right OSD Stream State Badge */}
      <StreamStatusBadge />

      {/* 3. Bottom OSD Legend & Telemetry Status Bar */}
      <ClassificationLegendBadge />
    </>
  );
};

export default ViewportTelemetryBadges;
export * from "./badges";
