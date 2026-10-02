"use client";

import React from "react";
import { CameraCardHeaderProps } from "@/types";
import { CheckCircle2, Radio } from "lucide-react";

export const CardHeader: React.FC<CameraCardHeaderProps> = ({
  channel,
  isActive,
  isConnected,
}) => {
  const isOnline = channel.status === "ONLINE";

  return (
    <div className="p-3 bg-[#06080E]/90 border-b border-slate-700/60 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            isConnected
              ? "bg-emerald-400 animate-ping"
              : isOnline
              ? "bg-emerald-400"
              : "bg-amber-400"
          }`}
        />
        <span className="font-display font-bold text-xs text-white uppercase tracking-wider">
          {channel.channelNum}: {channel.name}
        </span>
      </div>

      {isActive ? (
        <span className="font-mono-code text-[10px] text-blue-400 font-bold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> PRIMARY VIEWPORT
        </span>
      ) : isConnected ? (
        <span className="font-mono-code text-[10px] text-emerald-400 font-bold flex items-center gap-1">
          <Radio className="w-3.5 h-3.5 animate-pulse" /> CONNECTED & LIVE
        </span>
      ) : (
        <span className="font-mono-code text-[10px] text-slate-400 font-medium uppercase">
          {channel.status}
        </span>
      )}
    </div>
  );
};

export default CardHeader;
