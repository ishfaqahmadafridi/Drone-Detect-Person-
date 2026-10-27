"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { RecordingsFullscreenModalProps } from "@/types";
import { useEscapeKey } from "@/hooks";
import { ModalHeader, ModalImageStage, ModalFooter } from "./modal";

export const RecordingsFullscreenModal: React.FC<RecordingsFullscreenModalProps> = ({
  snapshot,
  isOpen,
  onClose,
}) => {
  // Listen for Escape key dismissal via custom hook
  useEscapeKey(isOpen, onClose);

  if (!isOpen || !snapshot) return null;

  return (
    <div
      onClick={onClose}
      className={TACTICAL_VIEW_STYLES.RecordingsFullscreenModal_div_className}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={TACTICAL_VIEW_STYLES.RecordingsFullscreenModal_div_className_2}
      >
        {/* 1. Modal Top Bar */}
        <ModalHeader snapshot={snapshot} onClose={onClose} />

        {/* 2. Full High-Resolution Image Stage */}
        <ModalImageStage url={snapshot.url} filename={snapshot.filename} />

        {/* 3. Modal Bottom Telemetry & Actions */}
        <ModalFooter snapshot={snapshot} onClose={onClose} />
      </div>
    </div>
  );
};

export default RecordingsFullscreenModal;
export * from "./modal";
