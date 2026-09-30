import React from "react";
import { Users } from "lucide-react";
import { MetricTile } from "./MetricTile";
import { PersonsMetricCardProps } from "@/types";

export const PersonsMetricCard: React.FC<PersonsMetricCardProps> = ({
  count,
  viewMode = "aerial",
}) => {
  return (
    <MetricTile
      title="TOTAL PERSONS"
      icon={<Users className="w-4 h-4 text-cyan-400" />}
      value={count}
      subValue={viewMode === "ground" ? "Perimeter Tracks" : "Aerial Tracks"}
      progressPercent={count * 20}
      progressBarColor={viewMode === "ground" ? "bg-emerald-400" : "bg-cyan-400"}
    />
  );
};
