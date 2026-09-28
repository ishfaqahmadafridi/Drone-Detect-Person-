"use client";

import React from "react";
import { SidebarFooterProps } from "@/types";
import { Volume2, VolumeX, Zap } from "lucide-react";

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  isMuted,
  onToggleMute,
  isCollapsed,
}) => {
  return (
    <div className="p-2.5 border-t border-slate-800/80 flex flex-col gap-2 bg-slate-950/80">
      {/* Siren Alert Toggle */}
      <button
        onClick={onToggleMute}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border font-display text-xs font-semibold uppercase tracking-wider transition-all ${
          !isMuted
            ? "bg-red-500/20 text-red-300 border-red-500/50 hover:bg-red-500/30"
            : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800"
        } ${isCollapsed ? "justify-center px-0" : ""}`}
        title={!isMuted ? "Audio Siren Active (Click to Mute)" : "Audio Siren Muted (Click to Unmute)"}
        aria-label={!isMuted ? "Mute audio siren" : "Unmute audio siren"}
      >
        {!isMuted ? (
          <Volume2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 shrink-0" />
        )}
        {!isCollapsed && <span>{!isMuted ? "SIREN ENGAGED" : "AUDIO MUTED"}</span>}
      </button>

      {/* AI Engine & System Pill */}
      {!isCollapsed && (
        <div className="flex items-center justify-between text-[10px] font-mono-code text-slate-400 px-1 pt-1">
          <span className="flex items-center gap-1 truncate">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            YOLOv8 + ByteTrack
          </span>
          <span className="text-emerald-400 font-bold">ONLINE</span>
        </div>
      )}
    </div>
  );
};

export default SidebarFooter;
