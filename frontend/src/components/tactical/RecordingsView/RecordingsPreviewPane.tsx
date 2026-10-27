"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


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
    <div className={TACTICAL_VIEW_STYLES.RecordingsPreviewPane_div_className}>
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
