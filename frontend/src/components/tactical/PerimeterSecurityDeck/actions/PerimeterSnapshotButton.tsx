"use client";

import React, { useState } from "react";
import { PerimeterSnapshotButtonProps } from "@/types";
import { Camera, Check } from "lucide-react";

export const PerimeterSnapshotButton: React.FC<PerimeterSnapshotButtonProps> = ({
  onSnapshot,
}) => {
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  const handleCapture = () => {
    setIsCapturing(true);
    if (onSnapshot) {
      onSnapshot();
    }
    setTimeout(() => setIsCapturing(false), 800);
  };

  return (
    <button
      onClick={handleCapture}
      disabled={isCapturing}
      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono-code font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)] active:scale-[0.98]"
      title="Capture instant forensic audit snapshot"
    >
      {isCapturing ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-300">CAPTURED</span>
        </>
      ) : (
        <>
          <Camera className="w-3.5 h-3.5" />
          <span>CAPTURE EVIDENCE</span>
        </>
      )}
    </button>
  );
};

export default PerimeterSnapshotButton;
