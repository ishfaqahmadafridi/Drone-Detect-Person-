"use client";

import { Camera } from "lucide-react";
import { ModalImageStageProps } from "@/types";
import { TacticalVideoPlayer } from "./TacticalVideoPlayer";

export const ModalImageStage: React.FC<ModalImageStageProps> = ({ url, filename }) => {
  const isVideo = url?.toLowerCase().endsWith(".mp4") || filename.toLowerCase().endsWith(".mp4");

  if (!url) {
    return (
      <div className="relative flex-1 bg-black flex items-center justify-center p-8 min-h-[350px]">
        <p className="text-slate-500 font-mono-code text-sm">Media file unavailable on storage server.</p>
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className="relative flex-1 bg-black flex flex-col items-center justify-center min-h-[420px] overflow-hidden">
        <TacticalVideoPlayer url={url} filename={filename} />
      </div>
    );
  }

  return (
    <div className="relative flex-1 bg-black flex flex-col items-center justify-center overflow-auto p-4 min-h-[380px]">
      {/* ── Still Frame Snapshot Indicator Ribbon ── */}
      <div className="absolute top-3 left-4 z-20 flex items-center gap-2 pointer-events-none">
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700/80 text-cyan-300 text-[10px] font-mono-code font-bold uppercase tracking-widest backdrop-blur-md shadow-lg">
          <Camera className="w-3 h-3 text-cyan-400" />
          OPTICAL SNAPSHOT • 1-FRAME AUDIT CAPTURE
        </span>
      </div>

      <img
        src={url}
        alt={filename}
        className="max-h-[66vh] w-auto max-w-full object-contain rounded border border-slate-900 shadow-2xl"
      />
    </div>
  );
};

export default ModalImageStage;
export * from "./TacticalVideoPlayer";
