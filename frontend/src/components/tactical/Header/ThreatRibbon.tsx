"use client";

import React from "react";
import { ThreatRibbonProps } from "@/types";
import { getThreatRibbonStyle, isThreatDanger } from "@/utils/threatUtils";
import { ShieldCheck, AlertTriangle } from "lucide-react";

export const ThreatRibbon: React.FC<ThreatRibbonProps> = ({ threatLevel, alertMsg }) => {
  const ribbonStyle = getThreatRibbonStyle(threatLevel);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md border text-xs transition-colors duration-200 ${ribbonStyle}`}
    >
      {isThreatDanger(threatLevel) ? (
        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
      ) : (
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
      )}
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-slate-400 font-medium">Status:</span>
        <span className="font-semibold text-slate-100 tracking-tight">
          {alertMsg || "Airspace Nominal"}
        </span>
      </div>
    </div>
  );
};

export default ThreatRibbon;
