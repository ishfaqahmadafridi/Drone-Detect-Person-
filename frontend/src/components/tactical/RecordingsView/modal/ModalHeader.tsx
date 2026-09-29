"use client";

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
    <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800">
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
        <div className="flex items-center gap-1.5 text-xs font-mono-code font-bold text-cyan-300 ml-2">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{timePart}</span>
          <span className="text-slate-500 text-[11px] font-normal">{datePart}</span>
        </div>
        <span className="text-slate-500 font-mono-code text-[11px] hidden sm:inline">
          · {snapshot.filename}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {snapshot.url && (
          <>
            <a
              href={snapshot.url}
              download={snapshot.filename}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[11px] font-mono-code transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">DOWNLOAD</span>
            </a>
            <a
              href={snapshot.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono-code font-bold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">RAW FILE</span>
            </a>
          </>
        )}

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ModalHeader;
