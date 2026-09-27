"use client";

import React from "react";
import { IncidentItemProps } from "@/types";
import { isThreatDanger, isThreatWarning, getThreatBadgeStyle } from "@/utils/threatUtils";

export const IncidentItem: React.FC<IncidentItemProps> = ({ alert }) => {
  const isDanger = isThreatDanger(alert.threat_level);
  const isWarning = isThreatWarning(alert.threat_level);
  const badgeStyle = getThreatBadgeStyle(alert.threat_level);

  return (
    <div
      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
        isDanger
          ? "bg-red-950/20 border-red-500/40 hover:bg-red-950/40"
          : isWarning
          ? "bg-amber-950/20 border-amber-500/40 hover:bg-amber-950/40"
          : "bg-slate-900/50 border-slate-800 hover:bg-slate-800/50"
      }`}
    >
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className={`font-mono-code font-bold text-[10px] px-1.5 py-0.2 rounded ${badgeStyle}`}>
            {alert.threat_level}
          </span>
          <span className="text-slate-300 font-medium">
            {isDanger
              ? `${alert.intruders_count || 1} Intruder(s) in Restricted Zone`
              : `${alert.total_persons} Persons Gathering Detected`}
          </span>
        </div>
        <span className="font-mono-code text-[10px] text-slate-500">{alert.timestamp}</span>
      </div>

      {alert.snapshot_path && (
        <span className="font-mono-code text-[10px] text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded">
          Evidence Frame
        </span>
      )}
    </div>
  );
};
