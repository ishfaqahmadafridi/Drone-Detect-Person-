"use client";

import React from "react";
import { PerimeterReconnectButtonProps } from "@/types";
import { RefreshCw } from "lucide-react";

export const PerimeterReconnectButton: React.FC<PerimeterReconnectButtonProps> = ({
  onReconnect,
}) => {
  return (
    <button
      onClick={onReconnect}
      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono-code font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_10px_rgba(16,185,129,0.1)] active:scale-[0.98]"
      title="Reconnect or reset CCTV feed connection"
    >
      <RefreshCw className="w-3.5 h-3.5" />
      <span>RECONNECT RTSP</span>
    </button>
  );
};

export default PerimeterReconnectButton;
