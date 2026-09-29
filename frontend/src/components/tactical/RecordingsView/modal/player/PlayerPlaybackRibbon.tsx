"use client";

import React from "react";
import { Film } from "lucide-react";
import { PlayerPlaybackRibbonProps } from "@/types";

export const PlayerPlaybackRibbon: React.FC<PlayerPlaybackRibbonProps> = ({
  label = "RECORDED FOOTAGE • PLAYBACK MODE",
}) => {
  return (
    <div className="absolute top-3 left-4 z-20 flex items-center gap-2 pointer-events-none">
      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-950/80 border border-purple-500/50 text-purple-200 text-[10px] font-mono-code font-bold uppercase tracking-widest backdrop-blur-md shadow-lg">
        <Film className="w-3 h-3 text-purple-400 animate-pulse" />
        {label}
      </span>
    </div>
  );
};

export default PlayerPlaybackRibbon;
