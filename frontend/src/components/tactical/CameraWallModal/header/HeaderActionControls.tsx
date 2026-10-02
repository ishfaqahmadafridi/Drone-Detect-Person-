"use client";

import React from "react";
import { HeaderActionControlsProps } from "@/types";
import { SplitSquareVertical, LayoutGrid, X } from "lucide-react";

export const HeaderActionControls: React.FC<HeaderActionControlsProps> = ({
  onConnectAll,
  onLaunchSplit,
  onClose,
}) => {
  return (
    <>
      {onConnectAll && (
        <button
          type="button"
          onClick={onConnectAll}
          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono-code text-xs font-bold tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
          title="Connect all 5 cameras simultaneously in live stream"
        >
          <span>+ CONNECT ALL (5-UP)</span>
        </button>
      )}

      {onLaunchSplit && (
        <>
          <button
            type="button"
            onClick={() => onLaunchSplit("dual")}
            className="px-3 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 border border-blue-500/40 text-blue-300 font-mono-code text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="View Drone Aerial & Ground CCTV live at the same time"
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>DUAL (2-UP)</span>
          </button>

          <button
            type="button"
            onClick={() => onLaunchSplit("quad")}
            className="px-3 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 border border-blue-500/40 text-blue-300 font-mono-code text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="View 4 Cameras live at the same time in 2x2 matrix"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>QUAD (4-UP)</span>
          </button>
        </>
      )}

      <button
        onClick={onClose}
        className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 hover:text-white text-slate-300 cursor-pointer transition-all duration-150 active:scale-95"
        title="Close Camera Wall"
        aria-label="Close Camera Wall Modal"
      >
        <X className="w-5 h-5" />
      </button>
    </>
  );
};

export default HeaderActionControls;
