"use client";
import { useSuspectSelection } from "@/hooks/useSuspectSelection";
import { VIDEO_TESTING } from "@/constants/tactical";
import { SuspectSnapshots } from "./SuspectSnapshots";
import { Sparkles, Crosshair, X, RefreshCw } from "lucide-react";
import type { SuspectSelectionProps } from "@/types";

export function SuspectSelection(props: SuspectSelectionProps) {
  const {
    isGround,
    snapshot,
    portraits,
    selectedIds,
    selectedCount,
    liveDetections,
    pending,
    error,
    freeze,
    autoSelectSuspect,
    finish,
    clear,
    toggle,
  } = useSuspectSelection(props);

  if (!isGround) return null;

  return (
    <div className={VIDEO_TESTING.panelClass}>
      {/* Primary Action Button Cluster */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-mono-code text-xs font-bold shadow-md transition-all disabled:opacity-50"
          onClick={() => void autoSelectSuspect()}
          disabled={pending || !!snapshot}
          title="Auto Mode: Captures the primary detected suspect and automatically sets them as reference for Aerial Re-ID"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Auto-Capture & Send to Aerial</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-mono-code text-xs font-semibold transition-all disabled:opacity-50"
          onClick={freeze}
          disabled={pending || !!snapshot}
          title="Manual Mode: Freeze video stream to visually click and select any specific suspect"
        >
          <Crosshair className="w-3.5 h-3.5 text-amber-400" />
          <span>Manual Freeze & Select</span>
        </button>

        {selectedCount > 0 && (
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-rose-950/60 hover:bg-rose-900 border border-rose-700/60 text-rose-300 font-mono-code text-xs transition-all"
            onClick={clear}
            disabled={pending || !!snapshot}
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Suspects</span>
          </button>
        )}

        {pending && (
          <span className="flex items-center gap-1 text-xs text-cyan-400 font-mono-code">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>Processing suspect...</span>
          </span>
        )}
      </div>

      {/* Quick Direct-Target Buttons for detected people */}
      {liveDetections.length > 0 && !snapshot && (
        <div className="flex flex-wrap items-center gap-1.5 mt-1 pt-1 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-mono-code">Quick Select:</span>
          {liveDetections.slice(0, 6).map(person => (
            <button
              key={person.id}
              type="button"
              onClick={() => void autoSelectSuspect(person.id)}
              disabled={pending}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 hover:bg-amber-950/60 border border-slate-700 hover:border-amber-500/50 text-slate-300 hover:text-amber-300 text-[10px] font-mono-code transition-all"
              title={`Instantly capture and send Person #${person.id} to Aerial Re-ID`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Person #{person.id} ({Math.round((person.conf ?? 0.8) * 100)}%)</span>
            </button>
          ))}
        </div>
      )}

      {error && !snapshot && <p role="alert" className="w-full text-xs text-rose-400">{error}</p>}
      
      {/* Suspect Snapshots Gallery */}
      <SuspectSnapshots portraits={portraits} />

      {/* Manual Freeze Selection Modal */}
      {snapshot && (
        <div className={VIDEO_TESTING.dialogBackdropClass}>
          <section role="dialog" aria-modal="true" aria-labelledby="suspect-selection-title" className={VIDEO_TESTING.dialogClass}>
            <h2 id="suspect-selection-title" className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-amber-400" />
              <span>Select Suspects on Frozen Frame</span>
            </h2>
            <p className="text-sm text-slate-300">Click on any detected bounding box or ID button. Playback will resume once committed.</p>
            <p className="text-xs font-mono-code text-cyan-400">{snapshot.detections.length} detected | {selectedIds.length} selected</p>
            
            <div className="relative w-full rounded-lg overflow-hidden border border-slate-700 shadow-xl" style={{ aspectRatio: `${snapshot.width} / ${snapshot.height}` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={snapshot.image} alt="Frozen ground-camera frame for suspect selection" className="absolute inset-0 w-full h-full object-contain bg-black" />
              {snapshot.detections.map(person => (
                <button
                  key={person.id}
                  type="button"
                  aria-label={`Select suspect ${person.id}`}
                  aria-pressed={selectedIds.includes(person.id)}
                  disabled={pending}
                  onClick={() => toggle(person.id)}
                  className={selectedIds.includes(person.id) ? VIDEO_TESTING.selectedBoxClass : VIDEO_TESTING.boxClass}
                  style={{
                    left: `${(person.bbox[0] / snapshot.width) * 100}%`,
                    top: `${(person.bbox[1] / snapshot.height) * 100}%`,
                    width: `${((person.bbox[2] - person.bbox[0]) / snapshot.width) * 100}%`,
                    height: `${((person.bbox[3] - person.bbox[1]) / snapshot.height) * 100}%`,
                  }}
                >
                  <span className={VIDEO_TESTING.boxLabelClass}>#{person.id} | {Math.round(person.conf * 100)}%</span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {snapshot.detections.map(person => (
                <button
                  key={person.id}
                  type="button"
                  className={selectedIds.includes(person.id) ? "px-2.5 py-1 rounded bg-amber-400 text-slate-950 font-bold text-xs" : VIDEO_TESTING.buttonClass}
                  aria-pressed={selectedIds.includes(person.id)}
                  onClick={() => toggle(person.id)}
                  disabled={pending}
                >
                  {selectedIds.includes(person.id) ? "✓ Selected" : "Select"} #{person.id}
                </button>
              ))}
            </div>

            {!snapshot.detections.length && <p className="text-amber-400 text-xs">No people detected in this frame. Resume and try another frame or adjust detection confidence.</p>}
            {error && <p role="alert" className="text-rose-400 text-xs">{error}</p>}

            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
              <button
                autoFocus
                type="button"
                className="px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-mono-code shadow-md transition-all disabled:opacity-50"
                disabled={pending || selectedIds.length === 0}
                onClick={() => finish(true)}
              >
                Track Selected ({selectedIds.length}) & Send to Aerial
              </button>
              <button
                type="button"
                className={VIDEO_TESTING.buttonClass}
                disabled={pending}
                onClick={() => finish(false)}
              >
                Cancel & Resume
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
