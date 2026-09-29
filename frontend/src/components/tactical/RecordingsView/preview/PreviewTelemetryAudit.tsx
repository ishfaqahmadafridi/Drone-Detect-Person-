"use client";

import React from "react";
import { Camera, Clock, ShieldAlert, HardDrive } from "lucide-react";
import { PreviewTelemetryAuditProps } from "@/types";
import {
  parseEvidenceTimestamp,
  getPerspectiveLabel,
  parseThreatType,
} from "@/utils";

export const PreviewTelemetryAudit: React.FC<PreviewTelemetryAuditProps> = ({
  selectedSnapshot,
}) => {
  const { datePart, timePart } = parseEvidenceTimestamp(selectedSnapshot.created_at);
  const perspectiveLabel = getPerspectiveLabel(selectedSnapshot.view_mode);
  const threatType = parseThreatType(selectedSnapshot.filename);

  return (
    <div className="p-4 bg-slate-900/70 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono-code">
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] text-slate-500 flex items-center gap-1">
          <Camera className="w-3 h-3 text-emerald-400" /> SENSOR LINK
        </span>
        <span className="text-slate-200 font-bold tracking-wider">
          {perspectiveLabel === "AERIAL" ? "UAV DRONE (TOP-DOWN)" : "GROUND PERIMETER CCTV"}
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] text-slate-500 flex items-center gap-1">
          <Clock className="w-3 h-3 text-cyan-400" /> CAPTURE TIME
        </span>
        <span className="text-cyan-300 font-bold">
          {timePart} <span className="text-slate-400 text-[10px]">({datePart})</span>
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] text-slate-500 flex items-center gap-1">
          <ShieldAlert className="w-3 h-3 text-rose-400" /> EVENT TRIGGER
        </span>
        <span className="text-rose-300 font-bold truncate">
          {threatType}
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] text-slate-500 flex items-center gap-1">
          <HardDrive className="w-3 h-3 text-slate-400" /> FILE SIZE
        </span>
        <span className="text-slate-300 font-bold">
          {selectedSnapshot.size_kb} KB
        </span>
      </div>
    </div>
  );
};

export default PreviewTelemetryAudit;
