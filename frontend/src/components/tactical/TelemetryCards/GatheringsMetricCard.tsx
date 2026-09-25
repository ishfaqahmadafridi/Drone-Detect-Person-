import React from "react";
import { UserPlus } from "lucide-react";
import { MetricTile } from "./MetricTile";
import { GatheringsMetricCardProps } from "@/types";

export const GatheringsMetricCard: React.FC<GatheringsMetricCardProps> = ({ count, threshold }) => {
  return (
    <MetricTile
      title={`GATHERINGS (>= ${threshold})`}
      icon={<UserPlus className={`w-4 h-4 ${count > 0 ? "text-amber-400" : "text-slate-500"}`} />}
      value={count}
      subValue="Clusters"
      progressPercent={count * 33.3}
      progressBarColor="bg-amber-400"
      isAlertActive={count > 0}
      alertBorderColor="border-amber-500/60 bg-amber-950/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
    />
  );
};
