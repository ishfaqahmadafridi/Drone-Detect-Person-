"use client";
import React from "react";
import { X, Download } from "lucide-react";
import { EVIDENCE_UI, VIDEO_TOOLS } from "@/constants/tactical";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useEvidenceMetadata } from "@/hooks";
import { formatFileSize, formatDuration, isVideoEvidence } from "@/utils/evidenceFormat";
import type { EvidenceViewerModalProps } from "@/types";
import { EvidenceMedia } from "./EvidenceMedia";

/** One viewer for snapshots (Incident Logs) and recordings (Recordings). */
export const EvidenceViewerModal: React.FC<EvidenceViewerModalProps> = ({ item, onClose }) => {
  useEscapeKey(Boolean(item), onClose);
  const { datePart, timePart } = useEvidenceMetadata(item);
  if (!item) return null;
  const view = item.view_mode === "aerial" ? "aerial" : "ground";
  const isVideo = isVideoEvidence(item);
  const facts = [
    isVideo && item.duration_seconds ? formatDuration(item.duration_seconds) : null,
    formatFileSize(item.size_kb),
  ].filter(Boolean).join(" · ");

  return (
    <div className={EVIDENCE_UI.modalBackdropClass} onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="evidence-viewer-title" className={EVIDENCE_UI.modalClass} onClick={event => event.stopPropagation()}>
        <header className={EVIDENCE_UI.modalHeaderClass}>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h2 id="evidence-viewer-title" className={EVIDENCE_UI.titleClass}>{timePart} · {datePart}</h2>
            <span className={EVIDENCE_UI.modalBadgeClass[view]}>{EVIDENCE_UI.viewLabels[view]}</span>
            <span className={EVIDENCE_UI.modalBadgeClass.neutral}>{isVideo ? "Recording" : "Snapshot"}</span>
          </div>
          <button type="button" onClick={onClose} className={EVIDENCE_UI.modalCloseClass} aria-label="Close">
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </header>

        <div className={EVIDENCE_UI.modalStageClass}>
          <EvidenceMedia key={item.url} item={item} isVideo={isVideo} />
        </div>

        <footer className={EVIDENCE_UI.modalFooterClass}>
          <div className="min-w-0">
            <p className={EVIDENCE_UI.tileFileClass} title={item.filename}>{item.filename}</p>
            {facts && <p className={EVIDENCE_UI.rowMetaClass}>{facts}</p>}
          </div>
          <a href={item.url} download={item.filename} className={VIDEO_TOOLS.primaryButtonClass}>
            <Download aria-hidden="true" className="h-4 w-4" />Download
          </a>
        </footer>
      </div>
    </div>
  );
};

export default EvidenceViewerModal;
