"use client";

import React from "react";
import { ModalImageStageProps } from "@/types";

export const ModalImageStage: React.FC<ModalImageStageProps> = ({ url, filename }) => {
  return (
    <div className="relative flex-1 bg-black flex items-center justify-center overflow-auto p-2 min-h-[350px]">
      {url ? (
        <img
          src={url}
          alt={filename}
          className="max-h-[68vh] w-auto max-w-full object-contain rounded border border-slate-900 shadow-2xl"
        />
      ) : (
        <p className="text-slate-500 font-mono-code text-sm">Image unavailable</p>
      )}
    </div>
  );
};

export default ModalImageStage;
