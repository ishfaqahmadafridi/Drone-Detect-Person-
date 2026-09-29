"use client";

import React from "react";
import { Clock, Download, Maximize2 } from "lucide-react";
import { PreviewTopToolbarProps } from "@/types";
import {
  parseEvidenceTimestamp,
  getPerspectiveLabel,
  getPerspectiveBadgeClass,
  parseThreatType,
  getThreatBadgeClass,
} from "@/utils";

export const PreviewTopToolbar: React.FC<PreviewTopToolbarProps> = ({
  selectedSnapshot,
  onOpenModal,
}) => {
  const { datePart, timePart } = parseEvidenceTimestamp(selectedSnapshot.created_at);
  const perspectiveLabel = getPerspectiveLabel(selectedSnapshot.view_mode);
  const perspectiveBadgeClass = getPerspectiveBadgeClass(selectedSnapshot.view_mode);
  const threatType = parseThreatType(selectedSnapshot.filename);
  const threatBadgeClass = getThreatBadgeClass(threatType);

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-slate-900/80 border-b border-slate-800/80 flex-wrap">
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase tracking-wider border ${perspectiveBadgeClass}`}
        >
          {perspectiveLabel} FEED
        </span>
        <span
          className={`px-2 py-0.5 rounded text-[9px] font-mono-code font-semibold tracking-wider border ${threatBadgeClass}`}
        >
          {threatType}
        </span>
        <div className="flex items-center gap-1.5 ml-2 text-cyan-300 font-mono-code text-xs font-bold">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{timePart}</span>
          <span className="text-slate-500 text-[10px]">{datePart}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {selectedSnapshot.url && (
          <a
            href={selectedSnapshot.url}
            download={selectedSnapshot.filename}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] font-mono-code transition-colors"
            title="Download snapshot image"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">DOWNLOAD</span>
          </a>
        )}

        <button
          onClick={onOpenModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono-code font-bold transition-all shadow-[0_0_10px_rgba(6,182,212,0.15)]"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>OPEN FULL FRAME</span>
        </button>
      </div>
    </div>
  );
};

export default PreviewTopToolbar;
