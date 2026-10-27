"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { ThreatRibbonProps } from "@/types";

export const ThreatRibbon: React.FC<ThreatRibbonProps> = ({ threatLevel, alertMsg }) => {
  const isDanger = threatLevel === "INTRUSION";

  const dotColor = isDanger
    ? TACTICAL_VIEW_STYLES.BatteryHealthGauge_div_className_4
    : TACTICAL_VIEW_STYLES.CardHeader_span_className_2;

  const pillStyle = isDanger
    ? TACTICAL_VIEW_STYLES.ThreatRibbon_color
    : TACTICAL_VIEW_STYLES.ThreatRibbon_color_2;

  const displayLabel = isDanger
    ? "INTRUSION DETECTED"
    : (alertMsg || "AIRSPACE NOMINAL").toUpperCase();

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-mono-code font-medium tracking-wide ${pillStyle}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{displayLabel}</span>
    </div>
  );
};

export default ThreatRibbon;
