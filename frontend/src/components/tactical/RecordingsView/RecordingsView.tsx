"use client";

import React from "react";
import { Circle, Film, RefreshCw, Square } from "lucide-react";
import { EVIDENCE_UI, VIDEO_TOOLS } from "@/constants/tactical";
import { useRecordings } from "@/hooks";
import type { RecordingsViewProps } from "@/types";
import { EvidenceSectionHeader } from "../IncidentLogs/EvidenceSectionHeader";
import { EvidenceViewerModal } from "../EvidenceViewer";
import { RecordingRow } from "./RecordingRow";

export const RecordingsView: React.FC<RecordingsViewProps> = ({ className = "" }) => {
  const {
    recordings, total, isLoading, isFetching, loadError, refetch, filterMode, setFilterMode,
    selected, open, close, isRecording, pending, actionError, toggleRecording,
  } = useRecordings();

  return (
    <section aria-label="Recordings" className={`${EVIDENCE_UI.cardClass} ${className}`}>
      <EvidenceSectionHeader
        icon={Film}
        title="Recordings"
        count={total}
        description={isRecording ? "Recording the live video now. Press Stop to save it." : "Saved videos of the live feed, newest first."}
      >
        <div role="group" aria-label="Filter by perspective" className={VIDEO_TOOLS.segmentedClass}>
          {EVIDENCE_UI.filters.map(filter => (
            <button
              key={filter.value}
              type="button"
              aria-pressed={filterMode === filter.value}
              onClick={() => setFilterMode(filter.value)}
              className={filterMode === filter.value ? VIDEO_TOOLS.segmentClass.active : VIDEO_TOOLS.segmentClass.idle}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => refetch()} disabled={isFetching} className={VIDEO_TOOLS.secondaryButtonClass}>
          <RefreshCw aria-hidden="true" className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />Refresh
        </button>
        <button
          type="button"
          onClick={() => void toggleRecording()}
          disabled={pending}
          aria-pressed={isRecording}
          className={isRecording ? EVIDENCE_UI.stopRecordingClass : VIDEO_TOOLS.primaryButtonClass}
        >
          {isRecording
            ? <><Square aria-hidden="true" className="h-4 w-4 fill-current" />Stop recording</>
            : <><Circle aria-hidden="true" className="h-4 w-4 fill-current" />Start recording</>}
        </button>
      </EvidenceSectionHeader>

      {(actionError || loadError) && <p role="alert" className={VIDEO_TOOLS.errorClass}>{actionError || loadError}</p>}

      {recordings.length === 0 ? (
        <div className={EVIDENCE_UI.emptyClass}>
          <span className={EVIDENCE_UI.emptyIconClass}><Film aria-hidden="true" className="h-5 w-5" /></span>
          <p className={EVIDENCE_UI.emptyTitleClass}>{isLoading ? "Loading recordings…" : "No recordings yet"}</p>
          {!isLoading && <p className={EVIDENCE_UI.emptyTextClass}>Press Start recording to save the live video. Snapshots are on the Incident Logs page.</p>}
        </div>
      ) : (
        <ul className={EVIDENCE_UI.listClass}>
          {recordings.map(item => <RecordingRow key={item.id ?? item.filename} item={item} onPlay={open} />)}
        </ul>
      )}

      <EvidenceViewerModal item={selected} onClose={close} />
    </section>
  );
};

export default RecordingsView;
export * from "./RecordingRow";
