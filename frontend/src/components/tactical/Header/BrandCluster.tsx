"use client";

import React from "react";
import { BrandClusterProps } from "@/types";
import { Shield } from "lucide-react";

export const BrandCluster: React.FC<BrandClusterProps> = ({ isConnected }) => {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className="w-7 h-7 rounded-md bg-slate-800/80 border border-slate-700/80 flex items-center justify-center shrink-0">
        <Shield className="w-4 h-4 text-slate-200" />
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-sm tracking-wider text-slate-100 uppercase">
          AERO-GUARD
        </span>
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            isConnected ? "bg-emerald-500" : "bg-amber-500"
          }`}
          title={isConnected ? "Telemetry Connected" : "Connecting..."}
        />
      </div>
    </div>
  );
};

export default BrandCluster;
