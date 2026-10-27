"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { Film } from "lucide-react";
import { PlayerPlaybackRibbonProps } from "@/types";

export const PlayerPlaybackRibbon: React.FC<PlayerPlaybackRibbonProps> = ({
  label = "RECORDED FOOTAGE • PLAYBACK MODE",
}) => {
  return (
    <div className="absolute top-3 left-4 z-20 flex items-center gap-2 pointer-events-none">
      <span className={TACTICAL_VIEW_STYLES.PlayerPlaybackRibbon_span_className}>
        <Film className={TACTICAL_VIEW_STYLES.PlayerPlaybackRibbon_Film_className} />
        {label}
      </span>
    </div>
  );
};

export default PlayerPlaybackRibbon;
