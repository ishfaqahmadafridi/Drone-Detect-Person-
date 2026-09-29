"use client";

import React from "react";
import { RecordingsPreviewPaneProps } from "@/types";
import {
  EmptyPreviewState,
  PreviewTopToolbar,
  PreviewViewport,
  PreviewTelemetryAudit,
} from "./preview";

export const RecordingsPreviewPane: React.FC<RecordingsPreviewPaneProps> = ({
  selectedSnapshot,
  onOpenModal,
  onClosePreview,
}) => {
  if (!selectedSnapshot) {
    return <EmptyPreviewState />;
  }

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-800/80 bg-slate-950/60 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* ── 1. Top Tactical Toolbar ── */}
      <PreviewTopToolbar
        selectedSnapshot={selectedSnapshot}
        onOpenModal={onOpenModal}
        onClosePreview={onClosePreview}
      />

      {/* ── 2. Primary Media Player / Viewport ── */}
      <PreviewViewport
        selectedSnapshot={selectedSnapshot}
        onOpenModal={onOpenModal}
      />

      {/* ── 3. Bottom Incident Telemetry & Audit Meta ── */}
      <PreviewTelemetryAudit selectedSnapshot={selectedSnapshot} />
    </div>
  );
};

export default RecordingsPreviewPane;
export * from "./preview";
