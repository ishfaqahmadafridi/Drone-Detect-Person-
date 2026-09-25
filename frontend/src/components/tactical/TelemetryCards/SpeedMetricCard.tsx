import React from "react";
import { Zap } from "lucide-react";
import { MetricTile } from "./MetricTile";
import { SpeedMetricCardProps } from "@/types";

export const SpeedMetricCard: React.FC<SpeedMetricCardProps> = ({ fps }) => {
  return (
    <MetricTile
      title="SYSTEM SPEED"
      icon={<Zap className="w-4 h-4 text-cyan-400" />}
      value={fps ? fps.toFixed(1) : "0.0"}
      subValue="FPS"
      progressPercent={(fps / 30) * 100}
      progressBarColor="bg-cyan-400"
    />
  );
};
