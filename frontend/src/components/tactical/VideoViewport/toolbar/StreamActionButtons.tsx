"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


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
          className={TACTICAL_VIEW_STYLES.StreamActionButtons_button_className}
          title="Capture High-Resolution Forensic Snapshot"
        >
          <Camera className={TACTICAL_VIEW_STYLES.RecentIncidentsTable_ArrowRight_className} />
          <span>Snapshot</span>
        </button>
      )}

      {/* 2. Evidence Records Link */}
      {onOpenEvidence && (
        <button
          onClick={onOpenEvidence}
          className={TACTICAL_VIEW_STYLES.StreamActionButtons_button_className}
          title="View Evidence Captures"
        >
          <FolderArchive className={TACTICAL_VIEW_STYLES.RecentIncidentsTable_ArrowRight_className} />
          <span>Evidence</span>
        </button>
      )}

      {/* 3. Fullscreen Display Trigger */}
      {onToggleFullscreen && (
        <button
          onClick={onToggleFullscreen}
          className={TACTICAL_VIEW_STYLES.StreamActionButtons_button_className_2}
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
