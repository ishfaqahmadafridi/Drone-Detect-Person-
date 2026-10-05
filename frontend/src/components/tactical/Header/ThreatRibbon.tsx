"use client";

import React from "react";
import { ThreatRibbonProps } from "@/types";

export const ThreatRibbon: React.FC<ThreatRibbonProps> = ({ threatLevel, alertMsg }) => {
  const isDanger = threatLevel === "INTRUSION";

  const dotColor = isDanger
    ? "bg-red-400"
    : "bg-emerald-400";

  const pillStyle = isDanger
    ? "border-red-500/40 bg-red-950/30 text-red-300"
    : "border-emerald-500/30 bg-emerald-950/20 text-emerald-300";

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
