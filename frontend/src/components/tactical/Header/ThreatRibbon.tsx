"use client";

import React from "react";
import { ThreatRibbonProps } from "@/types";
import { getThreatRibbonStyle, isThreatDanger } from "@/utils/threatUtils";
import { Shield, AlertTriangle } from "lucide-react";

export const ThreatRibbon: React.FC<ThreatRibbonProps> = ({ threatLevel, alertMsg }) => {
  const ribbonStyle = getThreatRibbonStyle(threatLevel);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center gap-3 px-4 py-1.5 rounded-lg border transition-all duration-300 ${ribbonStyle}`}
    >
      {isThreatDanger(threatLevel) ? (
        <AlertTriangle className="w-5 h-5 text-red-400 animate-bounce" />
      ) : (
        <Shield className="w-5 h-5 text-current" />
      )}
      <div className="flex flex-col">
        <span className="font-mono-code text-[9px] tracking-widest uppercase opacity-75">DEFENSE STATE</span>
        <span className="font-display font-bold text-sm tracking-wide">{alertMsg || "AIRSPACE SECURE"}</span>
      </div>
    </div>
  );
};
