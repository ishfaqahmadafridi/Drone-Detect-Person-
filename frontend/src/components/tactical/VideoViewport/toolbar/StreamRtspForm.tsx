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
    <form onSubmit={onRtspSubmit} className="flex items-center gap-2 select-none">
      <input
        type="text"
        placeholder={placeholder}
        value={rtspInput}
        onChange={(e) => onRtspInputChange(e.target.value)}
        className="bg-slate-900 border border-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-mono-code w-72 focus:border-blue-500 outline-none"
      />
      <button
        type="submit"
        disabled={isConnectingRtsp}
        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
      >
        {isConnectingRtsp ? "Connecting..." : buttonLabel}
      </button>
    </form>
  );
};

export default StreamRtspForm;
