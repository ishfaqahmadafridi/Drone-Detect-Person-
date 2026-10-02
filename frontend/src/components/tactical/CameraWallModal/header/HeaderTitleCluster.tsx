"use client";

import React from "react";
import { HeaderTitleClusterProps } from "@/types";
import { Eye } from "lucide-react";

export const HeaderTitleCluster: React.FC<HeaderTitleClusterProps> = ({
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
        <Eye className="w-5 h-5" />
      </div>
      <div>
        <h2 className="font-display font-bold text-base tracking-wider text-white uppercase">
          TACTICAL MULTI-SENSOR CAMERA WALL
        </h2>
        <p className="font-mono-code text-xs text-slate-400">
          Connect multiple cameras or drone feeds to monitor simultaneous live coverage
        </p>
      </div>
    </div>
  );
};

export default HeaderTitleCluster;
