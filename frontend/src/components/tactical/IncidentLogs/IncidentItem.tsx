"use client";
import React from "react";
import { EVIDENCE_UI } from "@/constants/tactical";
import { IncidentItemProps } from "@/types";
import { isThreatDanger } from "@/utils/threatUtils";

export const IncidentItem: React.FC<IncidentItemProps> = ({ alert }) => {
  const isDanger = isThreatDanger(alert.threat_level);
  return (
    <li className={EVIDENCE_UI.rowClass}>
      <div className="flex min-w-0 items-center gap-2">
        <span className={isDanger ? EVIDENCE_UI.levelClass.danger : EVIDENCE_UI.levelClass.normal}>
          {isDanger ? "Intrusion" : "Detection"}
        </span>
        <span className={EVIDENCE_UI.rowTitleClass}>
          {isDanger
            ? `${alert.intruders_count || 1} in restricted zone`
            : `${alert.total_persons} detected`}
        </span>
      </div>
      <span className={EVIDENCE_UI.rowMetaClass}>
        {alert.timestamp}{alert.snapshot_path ? " · Evidence frame saved" : ""}
      </span>
    </li>
  );
};
