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
      className="w-full py-2.5 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white border border-emerald-400/80 font-display text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 cursor-pointer"
    >
      <span>📱 CONNECT GOOGLE PIXEL 6A (10.10.20.117)</span>
    </button>
  );
};

export default MobilePixelQuickConnect;
