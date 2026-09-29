"use client";

import React from "react";
import { Camera, ShieldAlert, HardDrive } from "lucide-react";
import { ModalFooterProps } from "@/types";
import { getPerspectiveLabel, parseThreatType } from "@/utils";

export const ModalFooter: React.FC<ModalFooterProps> = ({ snapshot, onClose }) => {
  const perspectiveLabel = getPerspectiveLabel(snapshot.view_mode);
  const threatType = parseThreatType(snapshot.filename);

  return (
    <div className="px-5 py-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs font-mono-code text-slate-400 flex-wrap gap-3">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-emerald-400" />
          SENSOR: <strong className="text-slate-200">{perspectiveLabel}</strong>
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          EVENT: <strong className="text-rose-300">{threatType}</strong>
        </span>
        <span className="flex items-center gap-1.5">
          <HardDrive className="w-3.5 h-3.5 text-slate-400" />
          SIZE: <strong className="text-slate-200">{snapshot.size_kb} KB</strong>
        </span>
      </div>

      <button
        onClick={onClose}
        className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono-code font-bold transition-colors ml-auto"
      >
        CLOSE (ESC)
      </button>
    </div>
  );
};

export default ModalFooter;
