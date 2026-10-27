"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { Clock, Download, Maximize2, X } from "lucide-react";
import { PreviewTopToolbarProps } from "@/types";
import { useEvidenceMetadata } from "@/hooks";

export const PreviewTopToolbar: React.FC<PreviewTopToolbarProps> = ({
  selectedSnapshot,
  onOpenModal,
  onClosePreview,
}) => {
  const {
    datePart,
    timePart,
    perspectiveLabel,
    perspectiveBadgeClass,
    threatType,
    threatBadgeClass,
  } = useEvidenceMetadata(selectedSnapshot);

  return (
    <div className={TACTICAL_VIEW_STYLES.PreviewTopToolbar_div_className}>
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
        <div className={TACTICAL_VIEW_STYLES.PreviewTopToolbar_div_className_2}>
          <Clock className={TACTICAL_VIEW_STYLES.PerimeterNetworkStatus_Network_className} />
          <span>{timePart}</span>
          <span className={TACTICAL_VIEW_STYLES.PreviewTopToolbar_span_className}>{datePart}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {selectedSnapshot.url && (
          <a
            href={selectedSnapshot.url}
            download={selectedSnapshot.filename}
            className={TACTICAL_VIEW_STYLES.PreviewTopToolbar_a_className}
            title="Download snapshot image"
          >
            <Download className={TACTICAL_VIEW_STYLES.RecentIncidentsTable_ArrowRight_className} />
            <span className="hidden sm:inline">DOWNLOAD</span>
          </a>
        )}

        <button
          onClick={onOpenModal}
          className={TACTICAL_VIEW_STYLES.PreviewTopToolbar_button_className}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>OPEN FULL FRAME</span>
        </button>

        {onClosePreview && (
          <button
            onClick={onClosePreview}
            className={TACTICAL_VIEW_STYLES.PreviewTopToolbar_button_className_2}
            title="Close Preview Pane"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PreviewTopToolbar;
