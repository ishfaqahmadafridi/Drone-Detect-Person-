"use client";

import React from "react";
import { ViewportSplitGridProps } from "@/types";
import { TacticalCameraFeedPreview } from "../CameraWallModal/card/TacticalCameraFeedPreview";
import { ArrowUpRight, CheckCircle2, X } from "lucide-react";
import { useViewportSplitGrid } from "@/hooks";

export const ViewportSplitGrid: React.FC<ViewportSplitGridProps> = ({
  layoutMode,
  activeCameraId,
  fps,
  onSelectCamera,
}) => {
  const {
    channelsToDisplay,
    gridClass,
    handlePromoteCamera,
    handleDisconnectCamera,
  } = useViewportSplitGrid({ layoutMode, onSelectCamera });

  return (
    <div className={`w-full p-2 gap-2 bg-[#02050e] ${gridClass}`}>
      {channelsToDisplay.map((cam) => {
        const isCamActive = activeCameraId === cam.id;

        return (
          <div
            key={cam.id}
            className={`relative rounded-xl overflow-hidden border flex flex-col justify-between transition-all duration-200 ${
              isCamActive
                ? "border-blue-500/80 bg-blue-950/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                : "border-slate-800 bg-[#06080E]/80 hover:border-slate-700"
            }`}
          >
            {/* 1. Pane Header */}
            <div className="p-2 px-3 bg-[#06080E]/95 border-b border-slate-800 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    isCamActive
                      ? "bg-blue-400 animate-ping"
                      : "bg-emerald-400 animate-pulse"
                  }`}
                />
                <span className="font-display font-bold text-xs text-white uppercase tracking-wider truncate">
                  {cam.channelNum}: {cam.name}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {isCamActive ? (
                  <span className="font-mono-code text-[10px] text-blue-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PRIMARY ({fps} FPS)
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handlePromoteCamera(cam)}
                    className="font-mono-code text-[10px] text-slate-300 hover:text-white bg-slate-800 hover:bg-blue-600/80 px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>PROMOTE</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                )}

                {channelsToDisplay.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDisconnectCamera(cam.id)}
                    title="Disconnect camera from simultaneous multi-view"
                    className="text-slate-400 hover:text-rose-400 p-0.5 rounded hover:bg-rose-950/40 transition-colors cursor-pointer ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 2. Visual Surveillance Feed Preview Window */}
            <div className="relative flex-1 min-h-[140px] overflow-hidden flex items-center justify-center p-1 bg-black">
              <TacticalCameraFeedPreview
                channel={cam}
                isActive={isCamActive}
                className="w-full h-full rounded-md"
                onSelect={() => handlePromoteCamera(cam)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ViewportSplitGrid;
