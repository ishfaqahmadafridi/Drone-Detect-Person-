"use client";

import React from "react";
import { AudioAlertToggleProps } from "@/types";
import { Volume2, VolumeX } from "lucide-react";

export const AudioAlertToggle: React.FC<AudioAlertToggleProps> = ({ isMuted, onToggleMute }) => {
  return (
    <button
      onClick={onToggleMute}
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
  );
};

export default AudioAlertToggle;
