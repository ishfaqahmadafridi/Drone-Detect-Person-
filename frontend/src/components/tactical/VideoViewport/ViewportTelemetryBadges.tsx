"use client";

import React from "react";
import { ViewportTelemetryBadgesProps } from "@/types";
import { useInferenceModel } from "@/hooks/useInferenceModel";

export const ViewportTelemetryBadges: React.FC<ViewportTelemetryBadgesProps> = ({
  fps,
  latencyMs = 18,
  resolution = "1280x720",
  engine,
}) => {
  const activeEngine = useInferenceModel();
  return (
    <>
      <div className="absolute top-4 left-10 bg-slate-950/80 backdrop-blur-sm border border-slate-800 px-2.5 py-1 rounded font-mono-code text-[10px] text-slate-300 flex gap-3 pointer-events-none">
        <span>
          LATENCY: <strong className="text-cyan-400">{latencyMs}ms</strong>
        </span>
        <span>
          INFERENCE: <strong className="text-cyan-400">{fps ? fps.toFixed(1) : "0.0"} FPS</strong>
        </span>
      </div>

      <div className="absolute top-4 right-10 bg-slate-950/80 backdrop-blur-sm border border-slate-800 px-2.5 py-1 rounded font-mono-code text-[10px] text-slate-300 flex gap-3 pointer-events-none">
        <span>
          RES: <strong className="text-cyan-400">{resolution}</strong>
        </span>
        <span>
          ENGINE: <strong className="text-cyan-400">{engine ?? activeEngine}</strong>
        </span>
      </div>
    </>
  );
};
