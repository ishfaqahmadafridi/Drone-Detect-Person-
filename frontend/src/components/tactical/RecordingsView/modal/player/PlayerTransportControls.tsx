"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { Play, Pause, Square, RotateCcw, RotateCw } from "lucide-react";
import { PlayerTransportControlsProps } from "@/types";

export const PlayerTransportControls: React.FC<PlayerTransportControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onStop,
  onSkip,
}) => {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* Play / Pause Toggle */}
      <button
        onClick={onTogglePlay}
        className={TACTICAL_VIEW_STYLES.PlayerTransportControls_button_className}
        title={isPlaying ? "Pause (Space)" : "Play (Space)"}
      >
        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
      </button>

      {/* Stop & Reset */}
      <button
        onClick={onStop}
        className={TACTICAL_VIEW_STYLES.PlayerTransportControls_button_className_2}
        title="Stop & Return to Start"
      >
        <Square className="w-3.5 h-3.5 fill-current" />
      </button>

      {/* Step Back -5s */}
      <button
        onClick={() => onSkip(-5)}
        className={TACTICAL_VIEW_STYLES.PlayerTransportControls_button_className_3}
        title="Rewind 5 seconds (Left Arrow)"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>-5s</span>
      </button>

      {/* Step Forward +5s */}
      <button
        onClick={() => onSkip(5)}
        className={TACTICAL_VIEW_STYLES.PlayerTransportControls_button_className_3}
        title="Forward 5 seconds (Right Arrow)"
      >
        <span>+5s</span>
        <RotateCw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default PlayerTransportControls;
