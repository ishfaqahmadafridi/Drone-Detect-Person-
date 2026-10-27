"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { IncidentItemProps } from "@/types";
import { isThreatDanger, getThreatBadgeStyle } from "@/utils/threatUtils";

export const IncidentItem: React.FC<IncidentItemProps> = ({ alert }) => {
  const isDanger = isThreatDanger(alert.threat_level);
  const badgeStyle = getThreatBadgeStyle(alert.threat_level);

  return (
    <div
      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
        isDanger
          ? TACTICAL_VIEW_STYLES.IncidentItem_div_className
          : TACTICAL_VIEW_STYLES.IncidentItem_div_className_2
      }`}
    >
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className={`font-mono-code font-bold text-[10px] px-1.5 py-0.2 rounded ${badgeStyle}`}>
            {alert.threat_level}
          </span>
          <span className={TACTICAL_VIEW_STYLES.IncidentItem_span_className}>
            {isDanger
              ? `${alert.intruders_count || 1} Intruder(s) in Restricted Zone`
              : `${alert.total_persons} Persons Detected`}
          </span>
        </div>
        <span className={TACTICAL_VIEW_STYLES.IncidentItem_span_className_2}>{alert.timestamp}</span>
      </div>

      {alert.snapshot_path && (
        <span className={TACTICAL_VIEW_STYLES.IncidentItem_span_className_3}>
          Evidence Frame
        </span>
      )}
    </div>
  );
};
