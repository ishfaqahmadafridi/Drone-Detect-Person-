"use client";

import React from "react";
import { MobileHardwareWebcamButtonProps } from "@/types";

export const MobileHardwareWebcamButton: React.FC<MobileHardwareWebcamButtonProps> = ({
  onSelectWebcam,
}) => {
  return (
    <button
      onClick={onSelectWebcam}
      className="w-full py-1.5 px-3 rounded bg-slate-900 border border-slate-700 text-slate-300 font-display text-[11px] font-bold uppercase hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
    >
      <span>CONNECT WEBCAM / IPHONE DIRECT</span>
    </button>
  );
};
