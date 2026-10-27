"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { Sparkles, Crosshair, X, RefreshCw } from "lucide-react";
import type { SuspectActionToolbarProps } from "@/types";

export const SuspectActionToolbar: React.FC<SuspectActionToolbarProps> = ({
  pending,
  isFrozen,
  selectedCount,
  onAutoCapture,
  onManualFreeze,
  onClear,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        className={TACTICAL_VIEW_STYLES.SuspectActionToolbar_button_className}
        onClick={onAutoCapture}
        disabled={pending || isFrozen}
        title="Auto Mode: Captures the primary detected suspect and automatically sets them as reference for Aerial Re-ID"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Auto-Capture & Send to Aerial</span>
      </button>

      <button
        type="button"
        className={TACTICAL_VIEW_STYLES.SuspectActionToolbar_button_className_2}
        onClick={onManualFreeze}
        disabled={pending || isFrozen}
        title="Manual Mode: Freeze video stream to visually click and select any specific suspect"
      >
        <Crosshair className={TACTICAL_VIEW_STYLES.HeaderActions_VolumeX_className} />
        <span>Manual Freeze & Select</span>
      </button>

      {selectedCount > 0 && (
        <button
          type="button"
          className={TACTICAL_VIEW_STYLES.SuspectActionToolbar_button_className_3}
          onClick={onClear}
          disabled={pending || isFrozen}
        >
          <X className="w-3.5 h-3.5" />
          <span>Clear Suspects</span>
        </button>
      )}

      {pending && (
        <span className={TACTICAL_VIEW_STYLES.SuspectActionToolbar_span_className}>
          <RefreshCw className="w-3 h-3 animate-spin" />
          <span>Processing suspect...</span>
        </span>
      )}
    </div>
  );
};
