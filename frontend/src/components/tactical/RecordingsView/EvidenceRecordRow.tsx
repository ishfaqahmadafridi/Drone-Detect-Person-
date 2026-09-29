"use client";

import React from "react";
import { Film, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { EvidenceRecordRowProps } from "@/types";
import { parseEvidenceTimestamp, getPerspectiveLabel, getPerspectiveBadgeClass } from "@/utils";
import { RecordDetailPanel } from "./RecordDetailPanel";

export const EvidenceRecordRow: React.FC<EvidenceRecordRowProps> = ({
  snap,
  isExpanded,
  onToggle,
}) => {
  const { datePart, timePart } = parseEvidenceTimestamp(snap.created_at);
  const perspectiveLabel = getPerspectiveLabel(snap.view_mode);
  const perspectiveColor = getPerspectiveBadgeClass(snap.view_mode);

  return (
    <div className="border border-slate-800/60 rounded-lg overflow-hidden transition-all">
      {/* Row Header — clickable summary */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-3 py-2.5 bg-slate-900/60 hover:bg-slate-800/60 transition-colors text-left"
      >
        {/* Thumbnail placeholder */}
        <div className="w-10 h-10 shrink-0 rounded bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
          {snap.url ? (
            <img
              src={snap.url}
              alt={snap.filename}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <Film className="w-4 h-4 text-slate-600" />
          )}
        </div>

        {/* Timestamp & Metadata */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="font-mono-code text-xs font-bold text-cyan-300 tracking-wider">
              {timePart}
            </span>
            <span className="font-mono-code text-[10px] text-slate-500">
              {datePart}
            </span>
          </div>

          <p className="text-[10px] text-slate-400 truncate font-mono-code leading-tight">
            {snap.filename}
          </p>
        </div>

        {/* Perspective badge */}
        <span className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-mono-code font-bold border ${perspectiveColor}`}>
          {perspectiveLabel}
        </span>

        {/* Expand toggle */}
        {isExpanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        )}
      </button>

      {/* Expanded Details Panel */}
      {isExpanded && <RecordDetailPanel snap={snap} />}
    </div>
  );
};

export default EvidenceRecordRow;
