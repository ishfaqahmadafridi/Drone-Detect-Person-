"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import { useEscapeKey } from "@/hooks/useEscapeKey";
import React from "react";
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
  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div className={TACTICAL_VIEW_STYLES.CameraWallModalDialog_div_className}>
      <div
        className={TACTICAL_VIEW_STYLES.GroundSensorModal_div_className}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ground-sensor-dialog-title"
      >
        {/* Tactical Modal Header */}
        <div className={TACTICAL_VIEW_STYLES.GroundSensorModal_div_className_2}>
          <div className="flex items-center gap-2.5">
            <div className={TACTICAL_VIEW_STYLES.GroundSensorModal_div_className_3}>
              <Camera className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span
                id="ground-sensor-dialog-title"
                className={TACTICAL_VIEW_STYLES.GroundSensorModal_span_className}
              >
                CONNECT GROUND SENSOR UPLINK
              </span>
              <span className={TACTICAL_VIEW_STYLES.GroundSensorModal_span_className_2}>
                Wall CCTV (Wired PoE / Wireless Wi-Fi) • Mobile Patrol Smartphone
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className={TACTICAL_VIEW_STYLES.GroundSensorModal_button_className}
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
        <div className={TACTICAL_VIEW_STYLES.GroundSensorModal_div_className_4}>
          <span className={TACTICAL_VIEW_STYLES.GroundSensorModal_span_className_3}>
            <ShieldCheck className="w-3.5 h-3.5" /> SECURE RTSP / HTTP PROBE ENGINE
          </span>
          <span>ESC TO DISMISS</span>
        </div>
      </div>
    </div>
  );
};

export default GroundSensorModal;
