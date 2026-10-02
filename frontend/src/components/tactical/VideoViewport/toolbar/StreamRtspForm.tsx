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
        className="bg-[#06080E] border border-slate-700/80 text-white px-3 py-1.5 rounded-lg text-xs font-mono-code w-72 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 outline-none transition-all placeholder:text-slate-500"
      />
      <button
        type="submit"
        disabled={isConnectingRtsp}
        className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-sm"
      >
        {isConnectingRtsp ? "Connecting..." : buttonLabel}
      </button>
    </form>
  );
};

export default StreamRtspForm;
