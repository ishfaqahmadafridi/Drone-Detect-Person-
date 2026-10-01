"use client";

import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import { setSelectedTargetIds } from "@/store/slices/telemetrySlice";
import { DetectedPersonsModalProps, Detection } from "@/types";
import {
  Users,
  X,
  ShieldAlert,
  ShieldCheck,
  Crosshair,
  Radar,
  Radio,
  Eye,
} from "lucide-react";

export const DetectedPersonsModal: React.FC<DetectedPersonsModalProps> = ({
  isOpen,
  onClose,
  viewMode = "aerial",
}) => {
  const dispatch = useAppDispatch();
  const {
    detections: rawDetections,
    selected_target_ids: rawSelectedIds,
    tracking_mode,
  } = useAppSelector((state) => state.telemetry);

  const detections = rawDetections || [];
  const selectedTargetIds = rawSelectedIds || [];

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const intrudersCount = detections.filter((d) => d.is_intruder).length;
  const isGround = viewMode === "ground";

  const handleToggleTarget = (id: number) => {
    if (tracking_mode !== "manual") return;
    const isCurrentlySelected = selectedTargetIds.includes(id);
    const updated = isCurrentlySelected
      ? selectedTargetIds.filter((tid) => tid !== id)
      : [...selectedTargetIds, id];
    dispatch(setSelectedTargetIds(updated));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="glass-panel w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-cyan-500/30 bg-slate-900/95 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Modal Tactical Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-sm tracking-wider uppercase text-white">
                  LIVE DETECTED PERSONS & TARGETS
                </h3>
                <span className="flex items-center gap-1 text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                  <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                  {isGround ? "PERIMETER CCTV" : "AERIAL UAV"}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono-code mt-0.5">
                Real-time computer vision tracker telemetry & target identification
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Tactical Metrics Ribbon */}
        <div className="grid grid-cols-3 gap-2 px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 text-xs font-mono-code">
          <div className="flex flex-col">
            <span className="text-slate-400 text-[10px]">TOTAL DETECTIONS</span>
            <span className="text-cyan-400 font-bold text-base">
              {detections.length} Persons
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-[10px]">PERIMETER INTRUDERS</span>
            <span
              className={`font-bold text-base ${
                intrudersCount > 0 ? "text-red-400 animate-pulse" : "text-emerald-400"
              }`}
            >
              {intrudersCount} Breaches
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-[10px]">TRACKING PROTOCOL</span>
            <span className="text-white font-bold text-base uppercase">
              {tracking_mode === "manual" ? "MANUAL LOCK" : "AUTONOMOUS"}
            </span>
          </div>
        </div>

        {/* 3. Targets List / Radar Zero-State */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3 min-h-[220px]">
          {detections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-3 my-auto">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-400">
                <Radar className="w-8 h-8 animate-spin text-cyan-400/80 [animation-duration:6s]" />
                <span className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping [animation-duration:3s]" />
              </div>
              <div className="flex flex-col gap-1 max-w-sm">
                <span className="font-display text-sm font-semibold tracking-wide text-white uppercase">
                  SECTOR SECURE — NO ACTIVE PERSONS
                </span>
                <span className="text-xs font-mono-code text-slate-400">
                  Computer vision detector is actively polling video feed. New persons will
                  appear with track IDs & coordinates automatically.
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {detections.map((target: Detection, index: number) => {
                const isSelected = selectedTargetIds.includes(target.id);
                const confPercent = Math.round(target.conf * 100);
                const [x1, y1, x2, y2] = target.bbox || [0, 0, 0, 0];
                const width = Math.round(x2 - x1);
                const height = Math.round(y2 - y1);

                return (
                  <div
                    key={target.id || index}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2.5 transition-all ${
                      target.is_intruder
                        ? "border-red-500/50 bg-red-950/20 shadow-[0_0_12px_rgba(239,68,68,0.15)]"
                        : isSelected
                        ? "border-cyan-400 bg-cyan-950/30 shadow-[0_0_15px_rgba(0,242,254,0.2)]"
                        : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-code text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                          ID #{target.id ?? index + 1}
                        </span>
                        {target.is_intruder ? (
                          <span className="flex items-center gap-1 text-[10px] font-mono-code font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/40">
                            <ShieldAlert className="w-3 h-3 text-red-400" /> INTRUDER
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-mono-code text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" /> SECURE
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] font-mono-code font-bold text-cyan-300">
                        {confPercent}% CONF
                      </span>
                    </div>

                    {/* Coordinates & Bounding Box Info */}
                    <div className="grid grid-cols-2 gap-1 text-[10px] font-mono-code text-slate-400 bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                      <div>
                        POS: <span className="text-white font-bold">{Math.round(x1)}, {Math.round(y1)}</span>
                      </div>
                      <div className="text-right">
                        SIZE: <span className="text-white font-bold">{width}×{height}px</span>
                      </div>
                      {target.speed_px_s !== undefined && (
                        <div className="col-span-2 pt-1 border-t border-slate-800 text-[10px]">
                          VELOCITY:{" "}
                          <span className="text-cyan-400 font-bold">
                            {target.speed_px_s.toFixed(1)} px/s
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Target Lock Action in Manual Mode */}
                    {tracking_mode === "manual" && (
                      <button
                        type="button"
                        onClick={() => handleToggleTarget(target.id)}
                        className={`w-full py-1 px-2 rounded-lg font-mono-code text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          isSelected
                            ? "bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,242,254,0.4)]"
                            : "bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30"
                        }`}
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                        {isSelected ? "TARGET LOCKED" : "LOCK TARGET"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Modal Tactical Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-900/60 text-xs font-mono-code text-slate-400">
          <div className="flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>PRESS [ESC] OR CLICK OUTSIDE TO RETURN</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors border border-slate-700"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetectedPersonsModal;
