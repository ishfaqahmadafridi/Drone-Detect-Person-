"use client";

import React from "react";
import { Clock, Camera, HardDrive } from "lucide-react";
import { RecordDetailPanelProps } from "@/types";
import { useEvidenceMetadata } from "@/hooks";

export const RecordDetailPanel: React.FC<RecordDetailPanelProps> = ({ snap }) => {
  const { datePart, timePart, perspectiveLabel, perspectiveBadgeClass: perspectiveColor } =
    useEvidenceMetadata(snap);

  return (
    <div className="px-3 py-3 bg-slate-950/60 border-t border-slate-800/60 space-y-3">
      {/* Full-size preview */}
      {snap.url && (
        <div className="rounded-lg overflow-hidden border border-slate-700/60 bg-slate-900">
          <img
            src={snap.url}
            alt={snap.filename}
            className="w-full max-h-48 object-contain"
          />
        </div>
      )}

      {/* Metadata grid */}
      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono-code">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Clock className="w-3 h-3 text-cyan-400" />
          <span className="text-slate-500">DATE</span>
          <span className="text-slate-200 ml-auto">{datePart}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Clock className="w-3 h-3 text-cyan-400" />
          <span className="text-slate-500">TIME</span>
          <span className="text-slate-200 ml-auto">{timePart}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Camera className="w-3 h-3 text-emerald-400" />
          <span className="text-slate-500">SENSOR</span>
          <span className={`ml-auto font-bold ${perspectiveColor.split(" ")[1] ?? "text-cyan-300"}`}>
            {perspectiveLabel}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <HardDrive className="w-3 h-3 text-slate-400" />
          <span className="text-slate-500">SIZE</span>
          <span className="text-slate-200 ml-auto">{snap.size_kb} KB</span>
        </div>
      </div>

      {/* Download / open link */}
      {snap.url && (
        <a
          href={snap.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-1.5 rounded bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono-code font-bold tracking-wider transition-colors"
        >
          OPEN FULL FRAME ↗
        </a>
      )}
    </div>
  );
};

export default RecordDetailPanel;
