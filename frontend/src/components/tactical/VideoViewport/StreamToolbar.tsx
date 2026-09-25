"use client";

import React from "react";
import { STREAM_SOURCE_OPTIONS } from "@/constants/tactical";
import { StreamSourceType, StreamToolbarProps } from "@/types";
import { Upload } from "lucide-react";

export const StreamToolbar: React.FC<StreamToolbarProps> = ({
  sourceType,
  showUploadField,
  showRtspField,
  isUploading,
  isConnectingRtsp,
  rtspInput,
  fileInputRef,
  onSourceSelect,
  onFileUpload,
  onRtspInputChange,
  onRtspSubmit,
}) => {
  return (
    <div className="p-3 px-4 bg-slate-950/60 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="font-mono-code text-xs text-slate-400">STREAM SOURCE:</span>
        <div className="flex rounded-md overflow-hidden border border-slate-800">
          {STREAM_SOURCE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSourceSelect(opt.value as StreamSourceType)}
              className={`px-3 py-1 text-xs font-display font-semibold uppercase transition-colors border-r border-slate-800 last:border-r-0 ${
                sourceType === opt.value
                  ? "bg-cyan-500/20 text-cyan-400"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {showUploadField && (
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={onFileUpload}
            className="text-xs text-slate-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-cyan-500/20 file:text-cyan-400 cursor-pointer"
          />
          {isUploading && (
            <span className="flex items-center gap-1 text-xs text-cyan-400 animate-pulse">
              <Upload className="w-3.5 h-3.5 animate-bounce" /> Uploading...
            </span>
          )}
        </div>
      )}

      {showRtspField && (
        <form onSubmit={onRtspSubmit} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="rtsp://192.168.1.50:554/live"
            value={rtspInput}
            onChange={(e) => onRtspInputChange(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white px-2 py-1 rounded text-xs font-mono-code w-56 focus:border-cyan-400 outline-none"
          />
          <button
            type="submit"
            disabled={isConnectingRtsp}
            className="bg-cyan-400 text-black px-2.5 py-1 rounded text-xs font-bold font-display hover:bg-cyan-300 transition-colors"
          >
            {isConnectingRtsp ? "Connecting..." : "Connect"}
          </button>
        </form>
      )}
    </div>
  );
};
