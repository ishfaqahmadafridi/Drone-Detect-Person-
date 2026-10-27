"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { DeviceDeckHeaderProps } from "@/types";

export const DeviceDeckHeader: React.FC<DeviceDeckHeaderProps> = ({
  viewMode = "aerial",
}) => {
  const isGround = viewMode === "ground";

  return (
    <div className="select-none">
      <div className={TACTICAL_VIEW_STYLES.DeviceDeckHeader_div_className}>
        DEVICE DECK
      </div>
      <h3 className={TACTICAL_VIEW_STYLES.DeviceDeckHeader_h3_className}>
        {isGround ? "Perimeter sensor telemetry" : "Flight telemetry"}
      </h3>
    </div>
  );
};

export default DeviceDeckHeader;
