import React from "react";
import { Film, Play } from "lucide-react";
import { CONNECTIONS_UI, EVIDENCE_UI, VIDEO_TOOLS } from "@/constants/tactical";
import { useEvidenceMetadata } from "@/hooks";
import { formatDuration, formatFileSize } from "@/utils/evidenceFormat";
import type { RecordingRowProps } from "@/types";

export const RecordingRow: React.FC<RecordingRowProps> = ({ item, onPlay }) => {
  const { datePart, timePart } = useEvidenceMetadata(item);
  const view = item.view_mode === "aerial" ? "aerial" : "ground";
  const meta = [EVIDENCE_UI.viewLabels[view], formatDuration(item.duration_seconds), formatFileSize(item.size_kb)].filter(Boolean).join(" · ");

  return (
    <li className={CONNECTIONS_UI.rowClass}>
      <div className={CONNECTIONS_UI.rowMainClass}>
        <span className={CONNECTIONS_UI.rowIconClass}><Film aria-hidden="true" className="h-4 w-4" /></span>
        <div className="min-w-0">
          <p className={CONNECTIONS_UI.rowNameClass}>{timePart} · {datePart}</p>
          <p className={CONNECTIONS_UI.rowMetaClass} title={item.filename}>{meta}</p>
        </div>
      </div>
      <button type="button" onClick={() => onPlay(item)} className={VIDEO_TOOLS.secondaryButtonClass} aria-label={`Play recording from ${timePart} ${datePart}`}>
        <Play aria-hidden="true" className="h-4 w-4" />Play
      </button>
    </li>
  );
};

export default RecordingRow;
