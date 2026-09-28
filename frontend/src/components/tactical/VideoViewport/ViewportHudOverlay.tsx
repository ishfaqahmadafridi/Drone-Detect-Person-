"use client";

import React from "react";
import { ViewportHudOverlayProps } from "@/types";
import { ViewportHudReticle } from "./ViewportHudReticle";
import { ViewportTelemetryBadges } from "./ViewportTelemetryBadges";
import { ZoneBanner } from "./ZoneBanner";

export const ViewportHudOverlay: React.FC<ViewportHudOverlayProps> = ({
  fps,
  isEditingZone,
  onSaveZone,
  onResetZone,
  onCancelZone,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <ViewportHudReticle />
      <ViewportTelemetryBadges fps={fps} />

      {isEditingZone && (
        <ZoneBanner
          onSave={onSaveZone}
          onReset={onResetZone}
          onCancel={onCancelZone}
        />
      )}
    </div>
  );
};
