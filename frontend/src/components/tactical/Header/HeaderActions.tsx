"use client";

import React from "react";
import { HeaderActionsProps } from "@/types";
import { useAudioAlert, useSystemClock } from "@/hooks";
import { Volume2, VolumeX, RotateCw } from "lucide-react";

export const HeaderActions: React.FC<HeaderActionsProps> = ({ onRefresh }) => {
  const { isMuted, toggleMute } = useAudioAlert();
  const { utcTime } = useSystemClock();

  return (
    <div className="flex items-center gap-3">
      <div className="text-right font-mono-code mr-1">
        <div className="text-[10px] text-slate-400">LOCAL TIME</div>
        <div className="text-sm font-bold text-cyan-400">{utcTime || "--:--:--"}</div>
      </div>

      <button
        onClick={toggleMute}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-display text-xs font-semibold uppercase tracking-wider transition-all border ${
          !isMuted
            ? "bg-red-500/20 text-red-300 border-red-500/50 hover:bg-red-500/30"
            : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
        }`}
        title="Toggle Audio Siren Alert"
        aria-label={!isMuted ? "Mute audio siren" : "Unmute audio siren"}
      >
        {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        <span>{!isMuted ? "SIREN ON" : "MUTED"}</span>
      </button>

      <button
        onClick={onRefresh}
        className="p-2 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60 hover:border-cyan-400/50 hover:text-cyan-400 transition-colors"
        title="Refresh Telemetry & Alerts"
        aria-label="Refresh telemetry and alerts"
      >
        <RotateCw className="w-4 h-4" />
      </button>
    </div>
  );
};
