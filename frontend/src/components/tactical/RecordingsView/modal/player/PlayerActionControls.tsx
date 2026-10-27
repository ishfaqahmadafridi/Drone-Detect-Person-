"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { Volume2, VolumeX, Repeat, Maximize2 } from "lucide-react";
import { PlayerActionControlsProps } from "@/types";

export const PlayerActionControls: React.FC<PlayerActionControlsProps> = ({
  playbackRate,
  isLooping,
  isMuted,
  onCycleSpeed,
  onToggleLoop,
  onToggleMute,
  onToggleFullscreen,
}) => {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* Speed Multiplier */}
      <button
        onClick={onCycleSpeed}
        className={TACTICAL_VIEW_STYLES.PlayerActionControls_button_className}
        title="Playback Speed"
      >
        {playbackRate}x SPEED
      </button>

      {/* Loop Toggle */}
      <button
        onClick={onToggleLoop}
        className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-all ${
          isLooping
            ? TACTICAL_VIEW_STYLES.PlayerActionControls_button_className_2
            : TACTICAL_VIEW_STYLES.PlayerActionControls_button_className_3
        }`}
        title={isLooping ? "Loop Enabled" : "Loop Disabled"}
      >
        <Repeat className="w-3.5 h-3.5" />
      </button>

      {/* Audio Mute */}
      <button
        onClick={onToggleMute}
        className={TACTICAL_VIEW_STYLES.PlayerActionControls_button_className_4}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      </button>

      {/* Fullscreen */}
      <button
        onClick={onToggleFullscreen}
        className={TACTICAL_VIEW_STYLES.PlayerActionControls_button_className_5}
        title="Fullscreen"
      >
        <Maximize2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default PlayerActionControls;
