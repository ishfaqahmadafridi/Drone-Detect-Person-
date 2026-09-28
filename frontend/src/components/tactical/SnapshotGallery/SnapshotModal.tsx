"use client";

import React from "react";
import { X, Download } from "lucide-react";
import { SnapshotModalProps } from "@/types";

export const SnapshotModal: React.FC<SnapshotModalProps> = ({ snapshot, onClose }) => {
  if (!snapshot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative glass-panel-elevated max-w-4xl w-full rounded-xl overflow-hidden border border-cyan-500/30">
        <div className="flex items-center justify-between p-3.5 px-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <h4 className="font-display font-bold text-sm text-white">Incident Frame Analysis</h4>
            {snapshot.view_mode && (
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase border ${
                  snapshot.view_mode === "ground"
                    ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                }`}
              >
                {snapshot.view_mode} Perspective
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-2 bg-black flex items-center justify-center max-h-[65vh] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={snapshot.url}
            alt={snapshot.filename}
            className="max-h-[60vh] object-contain rounded"
          />
        </div>

        <div className="p-3 px-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <div className="flex flex-col font-mono-code text-xs text-slate-400">
            <span className="text-white font-medium">{snapshot.filename}</span>
            <span>Captured: {snapshot.created_at} | Size: {snapshot.size_kb} KB</span>
          </div>
          <a
            href={snapshot.url}
            download={snapshot.filename}
            className="flex items-center gap-1.5 bg-cyan-400 text-black px-3 py-1.5 rounded text-xs font-bold font-display hover:bg-cyan-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Download Snapshot
          </a>
        </div>
      </div>
    </div>
  );
};
