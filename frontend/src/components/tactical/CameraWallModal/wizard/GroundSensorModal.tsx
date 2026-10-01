"use client";

import React, { useEffect } from "react";
import { GroundSensorModalProps } from "@/types";
import { Camera, X, ShieldCheck } from "lucide-react";
import { GroundSensorWizard } from "./GroundSensorWizard";

/**
 * Tactical Dialog Modal for Adding and Configuring Ground Surveillance Sensors.
 * Supports Wall CCTV (Wired PoE / Wireless Wi-Fi) and Smartphone IP Cameras.
 */
export const GroundSensorModal: React.FC<GroundSensorModalProps> = ({
  isOpen,
  onClose,
  onConnect,
}) => {
  // Close on Escape key press
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative glass-panel-elevated max-w-xl w-full rounded-2xl overflow-hidden border border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.25)] flex flex-col bg-[#040814]/95 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ground-sensor-dialog-title"
      >
        {/* Tactical Modal Header */}
        <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span
                id="ground-sensor-dialog-title"
                className="font-display font-black text-sm text-white uppercase tracking-wider flex items-center gap-1.5"
              >
                CONNECT GROUND SENSOR UPLINK
              </span>
              <span className="font-mono-code text-[10px] text-slate-400">
                Wall CCTV (Wired PoE / Wireless Wi-Fi) • Mobile Patrol Smartphone
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Guided Multi-step Wizard */}
        <div className="p-5 overflow-y-auto max-h-[80vh]">
          <GroundSensorWizard
            onComplete={(url) => {
              onConnect(url);
              onClose();
            }}
            onCancel={onClose}
          />
        </div>

        {/* Modal Footer Security Ribbon */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono-code text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> SECURE RTSP / HTTP PROBE ENGINE
          </span>
          <span>ESC TO DISMISS</span>
        </div>
      </div>
    </div>
  );
};

export default GroundSensorModal;
