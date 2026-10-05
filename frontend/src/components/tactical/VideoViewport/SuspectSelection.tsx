"use client";
import { useSuspectSelection } from "@/hooks/useSuspectSelection";
import { VIDEO_TESTING } from "@/constants/tactical";
import { SuspectSnapshots } from "./SuspectSnapshots";

import type { SuspectSelectionProps } from "@/types";

export function SuspectSelection(props: SuspectSelectionProps) {
  const { isGround, snapshot, portraits, selectedIds, selectedCount, pending, error, freeze, finish, clear, toggle } = useSuspectSelection(props);
  if (!isGround) return null;
  return (
    <div className={VIDEO_TESTING.panelClass}>
      <button type="button" className={VIDEO_TESTING.buttonClass} onClick={freeze} disabled={pending || !!snapshot}>Freeze & select suspects</button>
      <span className="text-xs">Ground camera | {selectedCount} selected | works with the active camera or uploaded video</span>
      {selectedCount > 0 && <button type="button" className={VIDEO_TESTING.buttonClass} onClick={clear} disabled={pending || !!snapshot}>Clear suspects</button>}
      {error && !snapshot && <p role="alert" className="w-full">{error}</p>}
      <SuspectSnapshots portraits={portraits} />
      {snapshot && (
        <div className={VIDEO_TESTING.dialogBackdropClass}>
          <section role="dialog" aria-modal="true" aria-labelledby="suspect-selection-title" className={VIDEO_TESTING.dialogClass}>
            <h2 id="suspect-selection-title" className="text-lg font-semibold">Select suspects on the frozen frame</h2>
            <p className="text-sm">Click detected people or their ID buttons. This ground feed pauses for all viewers and resumes automatically after {snapshot.expires_in} seconds.</p>
            <p className="text-sm">{snapshot.detections.length} detected | {selectedIds.length} selected</p>
            <div className="relative w-full" style={{ aspectRatio: `${snapshot.width} / ${snapshot.height}` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={snapshot.image} alt="Frozen ground-camera frame for suspect selection" className="absolute inset-0 w-full h-full" />
              {snapshot.detections.map(person => (
                <button key={person.id} type="button" aria-label={`Select suspect ${person.id}`} aria-pressed={selectedIds.includes(person.id)} disabled={pending} onClick={() => toggle(person.id)}
                  className={selectedIds.includes(person.id) ? VIDEO_TESTING.selectedBoxClass : VIDEO_TESTING.boxClass}
                  style={{ left: `${person.bbox[0] / snapshot.width * 100}%`, top: `${person.bbox[1] / snapshot.height * 100}%`, width: `${(person.bbox[2] - person.bbox[0]) / snapshot.width * 100}%`, height: `${(person.bbox[3] - person.bbox[1]) / snapshot.height * 100}%` }}>
                  <span className={VIDEO_TESTING.boxLabelClass}>#{person.id} | {Math.round(person.conf * 100)}%</span>
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {snapshot.detections.map(person => <button key={person.id} type="button" className={VIDEO_TESTING.buttonClass} aria-pressed={selectedIds.includes(person.id)} onClick={() => toggle(person.id)} disabled={pending}>{selectedIds.includes(person.id) ? "Selected" : "Select"} #{person.id}</button>)}
            </div>
            {!snapshot.detections.length && <p>No people detected in this frame. Resume and try another frame or adjust detection confidence.</p>}
            {error && <p role="alert">{error}</p>}
            <div className="flex flex-wrap gap-2">
              <button autoFocus type="button" className={VIDEO_TESTING.buttonClass} disabled={pending} onClick={() => finish(true)}>Track selected & resume</button>
              <button type="button" className={VIDEO_TESTING.buttonClass} disabled={pending} onClick={() => finish(false)}>Cancel & resume</button>
            </div>
            <p className="text-xs">Selection follows tracker IDs. Long occlusions or reconnects may require selecting the person again.</p>
          </section>
        </div>
      )}
    </div>
  );
}
