"use client";

import React from "react";
import { StreamActionButtonsProps } from "@/types";
import { Camera, FolderArchive, Maximize2 } from "lucide-react";

export const StreamActionButtons: React.FC<StreamActionButtonsProps> = ({
  onSnapshotTrigger,
  onOpenEvidence,
  onToggleFullscreen,
}) => {
  return (
    <>
      {/* 1. Forensic Snapshot Capture Trigger */}
      {onSnapshotTrigger && (
        <button
          onClick={onSnapshotTrigger}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium cursor-pointer transition-all duration-150 active:scale-[0.98] select-none"
          title="Capture High-Resolution Forensic Snapshot"
        >
          <Camera className="w-3.5 h-3.5 text-slate-400" />
          <span>Snapshot</span>
        </button>
      )}

      {/* 2. Evidence Records Link */}
      {onOpenEvidence && (
        <button
          onClick={onOpenEvidence}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium cursor-pointer transition-all duration-150 active:scale-[0.98] select-none"
          title="View Evidence Captures"
        >
          <FolderArchive className="w-3.5 h-3.5 text-slate-400" />
          <span>Evidence</span>
        </button>
      )}

      {/* 3. Fullscreen Display Trigger */}
      {onToggleFullscreen && (
        <button
          onClick={onToggleFullscreen}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-medium cursor-pointer transition-all duration-150 active:scale-[0.98] shadow-sm ml-auto select-none"
          title="Toggle Fullscreen Optical Feed"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Open full screen</span>
        </button>
      )}
    </>
  );
};

export default StreamActionButtons;
