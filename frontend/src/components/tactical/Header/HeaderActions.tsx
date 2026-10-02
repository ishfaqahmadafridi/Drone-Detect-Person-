"use client";

import React from "react";
import { HeaderActionsProps } from "@/types";
import { useAudioAlert } from "@/hooks";
import { Activity, Volume2, VolumeX } from "lucide-react";

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  onRefresh,
}) => {
  const { isMuted, toggleMute } = useAudioAlert();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onRefresh}
        title="Refresh Telemetry Feed"
        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-medium cursor-pointer transition-all duration-150 active:scale-[0.98]"
      >
        <Activity className="w-3.5 h-3.5 text-blue-400" />
        <span>Telemetry</span>
      </button>

      <button
        onClick={toggleMute}
        title={isMuted ? "Audio siren muted - click to enable" : "Audio siren active - click to mute"}
        className="p-1.5 rounded-md border border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-600 text-slate-400 hover:text-slate-100 cursor-pointer transition-all duration-150 active:scale-95"
      >
        {isMuted ? <VolumeX className="w-3.5 h-3.5 text-amber-400" /> : <Volume2 className="w-3.5 h-3.5 text-slate-300" />}
      </button>
    </div>
  );
};

export default HeaderActions;
