"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { Clock, Download, ExternalLink, X } from "lucide-react";
import { ModalHeaderProps } from "@/types";
import { useEvidenceMetadata } from "@/hooks";

export const ModalHeader: React.FC<ModalHeaderProps> = ({ snapshot, onClose }) => {
  const {
    datePart,
    timePart,
    perspectiveLabel,
    perspectiveBadgeClass,
    threatType,
    threatBadgeClass,
  } = useEvidenceMetadata(snapshot);

  return (
    <div className={TACTICAL_VIEW_STYLES.ModalHeader_div_className}>
      <div className="flex items-center gap-2.5 flex-wrap">
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase tracking-wider border ${perspectiveBadgeClass}`}
        >
          {perspectiveLabel}
        </span>
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-semibold tracking-wider border ${threatBadgeClass}`}
        >
          {threatType}
        </span>
        <div className={TACTICAL_VIEW_STYLES.ModalHeader_div_className_2}>
          <Clock className={TACTICAL_VIEW_STYLES.PerimeterNetworkStatus_Network_className} />
          <span>{timePart}</span>
          <span className={TACTICAL_VIEW_STYLES.ModalHeader_span_className}>{datePart}</span>
        </div>
        <span className={TACTICAL_VIEW_STYLES.ModalHeader_span_className_2}>
          · {snapshot.filename}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {snapshot.url && (
          <>
            <a
              href={snapshot.url}
              download={snapshot.filename}
              className={TACTICAL_VIEW_STYLES.ModalHeader_a_className}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">DOWNLOAD</span>
            </a>
            <a
              href={snapshot.url}
              target="_blank"
              rel="noopener noreferrer"
              className={TACTICAL_VIEW_STYLES.ModalHeader_a_className_2}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">RAW FILE</span>
            </a>
          </>
        )}

        <button
          onClick={onClose}
          className={TACTICAL_VIEW_STYLES.ModalHeader_button_className}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ModalHeader;
