"use client";

import React from "react";
import { ViewportHudOverlayProps } from "@/types";
import { ViewportHudReticle } from "./ViewportHudReticle";
import { ViewportTelemetryBadges } from "./ViewportTelemetryBadges";

export const ViewportHudOverlay: React.FC<ViewportHudOverlayProps> = ({
  fps,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <ViewportHudReticle />
      <ViewportTelemetryBadges fps={fps} />
    </div>
  );
};
