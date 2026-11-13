"use client";
import { STATUS_ICON, TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { ThreatRibbonProps } from "@/types";
import { ShieldAlert, ShieldCheck } from "lucide-react";

export const ThreatRibbon: React.FC<ThreatRibbonProps> = ({ threatLevel, alertMsg }) => {
  const isDanger = threatLevel === "INTRUSION";

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
      {isDanger
        ? <ShieldAlert aria-hidden="true" className={`${STATUS_ICON.base} ${STATUS_ICON.danger}`} />
        : <ShieldCheck aria-hidden="true" className={`${STATUS_ICON.base} ${STATUS_ICON.ok}`} />}
      <span>{displayLabel}</span>
    </div>
  );
};

export default ThreatRibbon;
