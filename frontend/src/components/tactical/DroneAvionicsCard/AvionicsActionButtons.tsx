"use client";

import React from "react";
import { AvionicsActionButtonsProps } from "@/types";

export const AvionicsActionButtons: React.FC<AvionicsActionButtonsProps> = ({
  onOpenFlightDeck,
  onConnectAirLink,
}) => {
  if (!onOpenFlightDeck && !onConnectAirLink) return null;

  return (
    <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
      {onOpenFlightDeck && (
        <button
          onClick={onOpenFlightDeck}
          className="flex-1 py-1.5 px-2 rounded bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 font-display text-[10px] font-bold uppercase tracking-wider transition-colors"
        >
          LAUNCH / RE-FLY
        </button>
      )}
      {onConnectAirLink && (
        <button
          onClick={onConnectAirLink}
          className="flex-1 py-1.5 px-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-display text-[10px] font-bold uppercase tracking-wider transition-colors"
        >
          DRONE AIR LINK
        </button>
      )}
    </div>
  );
};

export default AvionicsActionButtons;
