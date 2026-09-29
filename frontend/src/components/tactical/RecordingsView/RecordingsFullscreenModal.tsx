"use client";

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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl h-[88vh] min-h-[540px] flex flex-col rounded-2xl bg-slate-950 border border-slate-700/80 shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden cursor-default"
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
