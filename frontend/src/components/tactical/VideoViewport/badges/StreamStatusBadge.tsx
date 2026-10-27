"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { StreamStatusBadgeProps } from "@/types";
import { useActiveCamera } from "@/hooks";

export const StreamStatusBadge: React.FC<StreamStatusBadgeProps> = ({
  className = "",
}) => {
  const { isSimulation } = useActiveCamera();

  return (
    <div
      className={`absolute top-10 right-3.5 z-20 pointer-events-none select-none ${className}`}
    >
      <div className={TACTICAL_VIEW_STYLES.StreamStatusBadge_div_className}>
        <span className={TACTICAL_VIEW_STYLES.PerimeterNetworkStatus_span_className_2} />
        <span>{isSimulation ? "SIMULATED • ONLINE" : "LIVE LINK • ONLINE"}</span>
      </div>
    </div>
  );
};

export default StreamStatusBadge;
