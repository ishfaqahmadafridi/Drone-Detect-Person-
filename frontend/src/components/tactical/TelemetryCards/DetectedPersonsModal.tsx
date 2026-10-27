"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import { useEscapeKey } from "@/hooks/useEscapeKey";
import React from "react";
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
  useEscapeKey(isOpen, onClose);

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
      className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_div_className}
      onClick={onClose}
    >
      <div
        className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_div_className_2}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Modal Tactical Header */}
        <div className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_div_className_3}>
          <div className="flex items-center gap-3">
            <div className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_div_className_4}>
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_h3_className}>
                  LIVE DETECTED PERSONS & TARGETS
                </h3>
                <span className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_span_className}>
                  <Radio className={TACTICAL_VIEW_STYLES.SidebarHeader_Radio_className} />
                  {isGround ? "PERIMETER CCTV" : "AERIAL UAV"}
                </span>
              </div>
              <p className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_p_className}>
                Real-time computer vision tracker telemetry & target identification
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_button_className}
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Tactical Metrics Ribbon */}
        <div className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_div_className_5}>
          <div className="flex flex-col">
            <span className={TACTICAL_VIEW_STYLES.PreviewTelemetryAudit_span_className_4}>TOTAL DETECTIONS</span>
            <span className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_span_className_2}>
              {detections.length} Persons
            </span>
          </div>
          <div className="flex flex-col">
            <span className={TACTICAL_VIEW_STYLES.PreviewTelemetryAudit_span_className_4}>PERIMETER INTRUDERS</span>
            <span
              className={`font-bold text-base ${
                intrudersCount > 0 ? TACTICAL_VIEW_STYLES.SidebarTelemetryWidget_Battery_className : TACTICAL_VIEW_STYLES.BatteryHealthGauge_strong_className
              }`}
            >
              {intrudersCount} Breaches
            </span>
          </div>
          <div className="flex flex-col">
            <span className={TACTICAL_VIEW_STYLES.PreviewTelemetryAudit_span_className_4}>TRACKING PROTOCOL</span>
            <span className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_span_className_3}>
              {tracking_mode === "manual" ? "MANUAL LOCK" : "AUTONOMOUS"}
            </span>
          </div>
        </div>

        {/* 3. Targets List / Radar Zero-State */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3 min-h-[220px]">
          {detections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-3 my-auto">
              <div className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_div_className_6}>
                <Radar className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_Radar_className} />
                <span className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_span_className_4} />
              </div>
              <div className="flex flex-col gap-1 max-w-sm">
                <span className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_span_className_5}>
                  SECTOR SECURE — NO ACTIVE PERSONS
                </span>
                <span className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_span_className_6}>
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
                        ? TACTICAL_VIEW_STYLES.DetectedPersonsModal_div_className_7
                        : isSelected
                        ? TACTICAL_VIEW_STYLES.DetectedPersonsModal_div_className_8
                        : TACTICAL_VIEW_STYLES.DetectedPersonsModal_div_className_9
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_span_className_7}>
                          ID #{target.id ?? index + 1}
                        </span>
                        {target.is_intruder ? (
                          <span className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_span_className_8}>
                            <ShieldAlert className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_ShieldAlert_className} /> INTRUDER
                          </span>
                        ) : (
                          <span className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_span_className_9}>
                            <ShieldCheck className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_Compass_className} /> SECURE
                          </span>
                        )}
                      </div>

                      <span className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_span_className_10}>
                        {confPercent}% CONF
                      </span>
                    </div>

                    {/* Coordinates & Bounding Box Info */}
                    <div className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_div_className_10}>
                      <div>
                        POS: <span className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_span_className_11}>{Math.round(x1)}, {Math.round(y1)}</span>
                      </div>
                      <div className="text-right">
                        SIZE: <span className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_span_className_11}>{width}×{height}px</span>
                      </div>
                      {target.speed_px_s !== undefined && (
                        <div className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_div_className_11}>
                          VELOCITY:{" "}
                          <span className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_span_className_12}>
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
                            ? TACTICAL_VIEW_STYLES.DetectedPersonsModal_button_className_2
                            : TACTICAL_VIEW_STYLES.DetectedPersonsModal_button_className_3
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
        <div className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_div_className_12}>
          <div className="flex items-center gap-2">
            <Eye className={TACTICAL_VIEW_STYLES.PerimeterNetworkStatus_Network_className} />
            <span>PRESS [ESC] OR CLICK OUTSIDE TO RETURN</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={TACTICAL_VIEW_STYLES.DetectedPersonsModal_button_className_4}
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetectedPersonsModal;
