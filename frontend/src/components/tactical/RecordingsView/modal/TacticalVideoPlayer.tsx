"use client";

import React, { useState } from "react";
import { TacticalVideoPlayerProps } from "@/types";
import { useTacticalVideoPlayer } from "@/hooks";
import { PlayerPlaybackRibbon, PlayerViewport, PlayerControlsBar } from "./player";

export const TacticalVideoPlayer: React.FC<TacticalVideoPlayerProps> = ({ url }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const player = useTacticalVideoPlayer(url);

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full h-full bg-black select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Tactical Playback Ribbon */}
      <PlayerPlaybackRibbon />

      {/* 2. Video Viewport */}
      <PlayerViewport
        videoRef={player.videoRef}
        url={url}
        isLooping={player.isLooping}
        hasError={player.hasError}
        onPlay={() => player.setIsPlaying(true)}
        onPause={() => player.setIsPlaying(false)}
        onTimeUpdate={player.handleTimeUpdate}
        onLoadedMetadata={player.handleLoadedMetadata}
        onError={player.handleError}
        onTogglePlay={player.togglePlay}
      />

      {/* 3. Tactical Player Controls Console */}
      <PlayerControlsBar
        isDisabled={player.hasError}
        scrubberProps={{
          currentTime: player.currentTime,
          duration: player.duration,
          progressPercent: player.progressPercent,
          onSeek: player.handleSeek,
          formattedCurrent: player.formattedCurrent,
          formattedDuration: player.formattedDuration,
        }}
        transportProps={{
          isPlaying: player.isPlaying,
          onTogglePlay: player.togglePlay,
          onStop: player.handleStop,
          onSkip: player.handleSkip,
        }}
        actionProps={{
          playbackRate: player.playbackRate,
          isLooping: player.isLooping,
          isMuted: player.isMuted,
          onCycleSpeed: player.cycleSpeed,
          onToggleLoop: () => player.setIsLooping(!player.isLooping),
          onToggleMute: player.toggleMute,
          onToggleFullscreen: player.toggleFullscreen,
        }}
      />
    </div>
  );
};

export default TacticalVideoPlayer;
export * from "./player";
