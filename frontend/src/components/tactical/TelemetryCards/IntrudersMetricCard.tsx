import React from "react";
import { AlertOctagon } from "lucide-react";
import { MetricTile } from "./MetricTile";
import { IntrudersMetricCardProps } from "@/types";

export const IntrudersMetricCard: React.FC<IntrudersMetricCardProps> = ({ count }) => {
  return (
    <MetricTile
      title="ZONE INTRUDERS"
      icon={
        <AlertOctagon
          className={`w-4 h-4 ${count > 0 ? "text-red-400 animate-pulse" : "text-slate-500"}`}
        />
      }
      value={count}
      subValue="Breaches"
      progressPercent={count * 33.3}
      progressBarColor="bg-red-500"
      isAlertActive={count > 0}
      alertBorderColor="border-red-500/60 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
    />
  );
};
