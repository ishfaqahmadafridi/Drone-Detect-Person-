"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { DroneBatteryPillProps } from "@/types";
import { Battery, BatteryWarning } from "lucide-react";

export const DroneBatteryPill: React.FC<DroneBatteryPillProps> = ({
  batteryPct,
  isBatteryLow,
  health,
  voltage,
}) => {
  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono-code font-medium border ${
        isBatteryLow
          ? TACTICAL_VIEW_STYLES.DroneBatteryPill_div_className
          : TACTICAL_VIEW_STYLES.DroneBatteryPill_div_className_2
      }`}
      title={`Battery Health: ${health}% • Operating Voltage: ${voltage.toFixed(1)}V`}
    >
      {isBatteryLow ? (
        <BatteryWarning className={TACTICAL_VIEW_STYLES.HeaderActions_VolumeX_className} />
      ) : (
        <Battery className={TACTICAL_VIEW_STYLES.DroneBatteryPill_Battery_className} />
      )}
      <span>{batteryPct}%</span>
    </div>
  );
};

export default DroneBatteryPill;
