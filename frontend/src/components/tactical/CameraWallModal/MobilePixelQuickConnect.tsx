"use client";

import React from "react";
import { MobilePixelQuickConnectProps } from "@/types";

export const MobilePixelQuickConnect: React.FC<MobilePixelQuickConnectProps> = ({
  onConnectRtsp,
}) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (onConnectRtsp) {
          onConnectRtsp("http://10.10.20.117:8080");
        }
      }}
      className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 hover:from-emerald-500/40 hover:to-cyan-500/40 border border-emerald-400 text-emerald-200 font-display text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
    >
      <span>📱 CONNECT GOOGLE PIXEL 6A (10.10.20.117)</span>
    </button>
  );
};
