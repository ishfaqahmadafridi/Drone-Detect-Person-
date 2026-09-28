"use client";

import React from "react";
import { GroundConnectButtonProps } from "@/types";
import { Camera } from "lucide-react";

export const GroundConnectButton: React.FC<GroundConnectButtonProps> = ({
  onConnectWebcam,
  isCommandPending,
}) => {
  return (
    <button
      onClick={onConnectWebcam}
      disabled={isCommandPending}
      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 font-display text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]"
    >
      <Camera className="w-4 h-4 text-cyan-400" />
      <span>CONNECT GROUND CAMERA / WEBCAM</span>
    </button>
  );
};

export default GroundConnectButton;
