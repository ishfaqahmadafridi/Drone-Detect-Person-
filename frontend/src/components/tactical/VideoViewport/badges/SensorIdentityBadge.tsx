"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { SensorIdentityBadgeProps } from "@/types";
import { useActiveCamera, useSystemClock } from "@/hooks";

export const SensorIdentityBadge: React.FC<SensorIdentityBadgeProps> = ({
  className = "",
}) => {
  const { sensorTag } = useActiveCamera();
  const { utcTime } = useSystemClock();

  return (
    <div
      className={`absolute top-10 left-3.5 z-20 pointer-events-none flex flex-col gap-1 select-none ${className}`}
    >
      <div className={TACTICAL_VIEW_STYLES.SensorIdentityBadge_div_className}>
        {sensorTag}
      </div>
      <div
        className={TACTICAL_VIEW_STYLES.SensorIdentityBadge_div_className_2}
        suppressHydrationWarning
      >
        {utcTime} UTC
      </div>
    </div>
  );
};

export default SensorIdentityBadge;
