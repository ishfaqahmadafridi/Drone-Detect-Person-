"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { Film, RefreshCw, Circle, Square } from "lucide-react";
import { RecordingsHeaderProps } from "@/types";

export const RecordingsHeader: React.FC<RecordingsHeaderProps> = ({
  totalCount,
  filteredCount,
  isLoading,
  onRefresh,
  isRecording,
  onToggleRecording,
  isActionLoading,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2.5">
        <div className={TACTICAL_VIEW_STYLES.RecordingsHeader_div_className}>
          <Film className={TACTICAL_VIEW_STYLES.RecordingsHeader_Film_className} />
        </div>
        <div>
          <h2 className={TACTICAL_VIEW_STYLES.RecordingsHeader_h2_className}>
            Evidence Records & Clips
          </h2>
          <p className={TACTICAL_VIEW_STYLES.PerimeterDeckHeader_p_className}>
            {filteredCount} record{filteredCount !== 1 ? "s" : ""}
            {totalCount !== filteredCount ? ` (filtered from ${totalCount})` : ""} · SQLite persistent archive
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onToggleRecording && (
          <button
            onClick={onToggleRecording}
            disabled={isActionLoading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-mono-code font-bold transition-all disabled:opacity-50 ${
              isRecording
                ? TACTICAL_VIEW_STYLES.RecordingsHeader_button_className
                : TACTICAL_VIEW_STYLES.RecordingsHeader_button_className_2
            }`}
          >
            {isRecording ? (
              <>
                <Square className={TACTICAL_VIEW_STYLES.RecordingsHeader_Square_className} />
                STOP REC
              </>
            ) : (
              <>
                <Circle className={TACTICAL_VIEW_STYLES.RecordingsHeader_Square_className} />
                REC VIDEO
              </>
            )}
          </button>
        )}

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className={TACTICAL_VIEW_STYLES.RecordingsHeader_button_className_3}
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
          REFRESH
        </button>
      </div>
    </div>
  );
};

export default RecordingsHeader;
