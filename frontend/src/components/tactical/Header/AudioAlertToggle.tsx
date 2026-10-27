"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { AudioAlertToggleProps } from "@/types";
import { Volume2, VolumeX } from "lucide-react";

export const AudioAlertToggle: React.FC<AudioAlertToggleProps> = ({ isMuted, onToggleMute }) => {
  return (
    <button
      onClick={onToggleMute}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-display text-xs font-semibold uppercase tracking-wider transition-all border ${
        !isMuted
          ? TACTICAL_VIEW_STYLES.AudioAlertToggle_button_className
          : TACTICAL_VIEW_STYLES.AudioAlertToggle_button_className_2
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
