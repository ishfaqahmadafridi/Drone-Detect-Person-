"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { Film, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { EvidenceRecordRowProps } from "@/types";
import { useEvidenceMetadata } from "@/hooks";
import { RecordDetailPanel } from "./RecordDetailPanel";

export const EvidenceRecordRow: React.FC<EvidenceRecordRowProps> = ({
  snap,
  isExpanded,
  onToggle,
}) => {
  const { datePart, timePart, perspectiveLabel, perspectiveBadgeClass: perspectiveColor } =
    useEvidenceMetadata(snap);

  return (
    <div className={TACTICAL_VIEW_STYLES.EvidenceRecordRow_div_className}>
      {/* Row Header — clickable summary */}
      <button
        onClick={onToggle}
        className={TACTICAL_VIEW_STYLES.EvidenceRecordRow_button_className}
      >
        {/* Thumbnail placeholder */}
        <div className={TACTICAL_VIEW_STYLES.EvidenceRecordRow_div_className_2}>
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
            <Film className={TACTICAL_VIEW_STYLES.EvidenceRecordRow_Film_className} />
          )}
        </div>

        {/* Timestamp & Metadata */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Clock className={TACTICAL_VIEW_STYLES.EvidenceRecordRow_Clock_className} />
            <span className={TACTICAL_VIEW_STYLES.EvidenceRecordRow_span_className}>
              {timePart}
            </span>
            <span className={TACTICAL_VIEW_STYLES.IncidentItem_span_className_2}>
              {datePart}
            </span>
          </div>

          <p className={TACTICAL_VIEW_STYLES.EvidenceRecordRow_p_className}>
            {snap.filename}
          </p>
        </div>

        {/* Perspective badge */}
        <span className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-mono-code font-bold border ${perspectiveColor}`}>
          {perspectiveLabel}
        </span>

        {/* Expand toggle */}
        {isExpanded ? (
          <ChevronUp className={TACTICAL_VIEW_STYLES.EvidenceRecordRow_ChevronUp_className} />
        ) : (
          <ChevronDown className={TACTICAL_VIEW_STYLES.EvidenceRecordRow_ChevronUp_className} />
        )}
      </button>

      {/* Expanded Details Panel */}
      {isExpanded && <RecordDetailPanel snap={snap} />}
    </div>
  );
};

export default EvidenceRecordRow;
