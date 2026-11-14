"use client";

import React from "react";
import { ViewportTelemetryBadgesProps } from "@/types";
import { ClassificationLegendBadge } from "./badges";

export const ViewportTelemetryBadges: React.FC<ViewportTelemetryBadgesProps> = () => {
  return (
    <>
      {/* Camera name, feed type and time are shown once, in the panel header and page status. */}
      <ClassificationLegendBadge />
    </>
  );
};

export default ViewportTelemetryBadges;
export * from "./badges";
