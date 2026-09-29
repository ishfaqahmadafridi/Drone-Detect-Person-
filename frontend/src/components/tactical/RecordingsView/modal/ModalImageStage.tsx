"use client";

import React from "react";
import { ModalImageStageProps } from "@/types";

export const ModalImageStage: React.FC<ModalImageStageProps> = ({ url, filename }) => {
  const isVideo = url?.toLowerCase().endsWith(".mp4") || filename.toLowerCase().endsWith(".mp4");

  return (
    <div className="relative flex-1 bg-black flex items-center justify-center overflow-auto p-2 min-h-[350px]">
      {url ? (
        isVideo ? (
          <video
            src={url}
            controls
            autoPlay
            loop
            playsInline
            className="max-h-[68vh] w-auto max-w-full object-contain rounded border border-slate-900 shadow-2xl"
          />
        ) : (
          <img
            src={url}
            alt={filename}
            className="max-h-[68vh] w-auto max-w-full object-contain rounded border border-slate-900 shadow-2xl"
          />
        )
      ) : (
        <p className="text-slate-500 font-mono-code text-sm">Media unavailable</p>
      )}
    </div>
  );
};

export default ModalImageStage;
