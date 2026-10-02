"use client";

import React from "react";
import { CameraWallHeaderProps } from "@/types";
import { Eye, X } from "lucide-react";

export const CameraWallHeader: React.FC<CameraWallHeaderProps> = ({ onClose }) => {
  return (
    <div className="p-4 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
          <Eye className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-display font-bold text-base tracking-wider text-white uppercase">
            TACTICAL MULTI-SENSOR CAMERA WALL
          </h2>
          <p className="font-mono-code text-xs text-slate-400">
            Click any sensor feed to promote it to the primary tactical viewport
          </p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 hover:text-white text-slate-300 cursor-pointer transition-all duration-150 active:scale-95"
        title="Close Camera Wall"
        aria-label="Close Camera Wall Modal"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CameraWallHeader;
