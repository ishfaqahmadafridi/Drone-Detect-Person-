"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { X, Download } from "lucide-react";
import { SnapshotModalProps } from "@/types";

export const SnapshotModal: React.FC<SnapshotModalProps> = ({ snapshot, onClose }) => {
  if (!snapshot) return null;

  return (
    <div className={TACTICAL_VIEW_STYLES.SnapshotModal_div_className}>
      <div className={TACTICAL_VIEW_STYLES.SnapshotModal_div_className_2}>
        <div className={TACTICAL_VIEW_STYLES.SnapshotModal_div_className_3}>
          <div className="flex items-center gap-2.5">
            <h4 className={TACTICAL_VIEW_STYLES.SnapshotModal_h4_className}>Incident Frame Analysis</h4>
            {snapshot.view_mode && (
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase border ${
                  snapshot.view_mode === "ground"
                    ? TACTICAL_VIEW_STYLES.SnapshotModal_span_className
                    : TACTICAL_VIEW_STYLES.SnapshotModal_span_className_2
                }`}
              >
                {snapshot.view_mode} Perspective
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className={TACTICAL_VIEW_STYLES.SnapshotModal_button_className}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={TACTICAL_VIEW_STYLES.SnapshotModal_div_className_4}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={snapshot.url}
            alt={snapshot.filename}
            className="max-h-[60vh] object-contain rounded"
          />
        </div>

        <div className={TACTICAL_VIEW_STYLES.SnapshotModal_div_className_5}>
          <div className={TACTICAL_VIEW_STYLES.SnapshotModal_div_className_6}>
            <span className={TACTICAL_VIEW_STYLES.SnapshotModal_span_className_3}>{snapshot.filename}</span>
            <span>Captured: {snapshot.created_at} | Size: {snapshot.size_kb} KB</span>
          </div>
          <a
            href={snapshot.url}
            download={snapshot.filename}
            className={TACTICAL_VIEW_STYLES.SnapshotModal_a_className}
          >
            <Download className="w-3.5 h-3.5" /> Download Snapshot
          </a>
        </div>
      </div>
    </div>
  );
};
