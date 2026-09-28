import React from "react";
import { Camera } from "lucide-react";

export const EmptyGalleryState: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-7 gap-2 border border-dashed border-slate-800/80 rounded-lg bg-slate-950/40">
      <Camera className="w-5 h-5 text-cyan-400/60" />
      <span className="text-xs text-slate-300 font-mono-code font-semibold tracking-wide">
        NO EVIDENTIARY SNAPSHOTS YET
      </span>
      <span className="text-[10px] text-slate-500 font-mono-code">
        Automated high-resolution frames will appear upon perimeter breach or manual capture.
      </span>
    </div>
  );
};
