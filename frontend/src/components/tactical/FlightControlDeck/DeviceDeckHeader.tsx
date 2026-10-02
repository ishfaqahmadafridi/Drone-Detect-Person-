"use client";

import React from "react";
import { DeviceDeckHeaderProps } from "@/types";

export const DeviceDeckHeader: React.FC<DeviceDeckHeaderProps> = ({
  viewMode = "aerial",
}) => {
  const isGround = viewMode === "ground";

  return (
    <div className="select-none">
      <div className="text-[10px] font-mono-code uppercase tracking-wider text-slate-400 font-semibold">
        DEVICE DECK
      </div>
      <h3 className="text-sm font-semibold text-slate-200 mt-0.5">
        {isGround ? "Perimeter sensor telemetry" : "Flight telemetry"}
      </h3>
    </div>
  );
};

export default DeviceDeckHeader;
