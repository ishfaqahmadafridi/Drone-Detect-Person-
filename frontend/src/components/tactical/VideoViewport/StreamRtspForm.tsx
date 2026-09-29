"use client";

import React from "react";
import { StreamRtspFormProps } from "@/types";

export const StreamRtspForm: React.FC<StreamRtspFormProps> = ({
  show,
  isConnectingRtsp,
  rtspInput,
  onRtspInputChange,
  onRtspSubmit,
  placeholder = "rtsp://192.168.1.50:554/live",
  buttonLabel = "Connect",
}) => {
  if (!show) return null;

  return (
    <form onSubmit={onRtspSubmit} className="flex items-center gap-2">
      <input
        type="text"
        placeholder={placeholder}
        value={rtspInput}
        onChange={(e) => onRtspInputChange(e.target.value)}
        className="bg-slate-900 border border-slate-700 text-white px-2 py-1 rounded text-xs font-mono-code w-64 focus:border-cyan-400 outline-none"
      />
      <button
        type="submit"
        disabled={isConnectingRtsp}
        className="bg-cyan-400 text-black px-2.5 py-1 rounded text-xs font-bold font-display hover:bg-cyan-300 transition-colors"
      >
        {isConnectingRtsp ? "Connecting..." : buttonLabel}
      </button>
    </form>
  );
};
