import React from "react";
import { Users } from "lucide-react";
import { MetricTile } from "./MetricTile";
import { PersonsMetricCardProps } from "@/types";

export const PersonsMetricCard: React.FC<PersonsMetricCardProps> = ({
  count,
  viewMode = "aerial",
  onClick,
}) => {
  return (
    <MetricTile
      title="TOTAL PERSONS"
      icon={<Users className="w-4 h-4 text-cyan-400" />}
      value={count}
      subValue={viewMode === "ground" ? "Perimeter Tracks" : "Aerial Tracks"}
      onClick={onClick}
      actionHint="> Click to open"
      showProgressLine={false}
      isAlertActive={count > 0}
      alertBorderColor={
        viewMode === "ground"
          ? "border-emerald-500/50 bg-emerald-950/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
          : "border-cyan-500/50 bg-cyan-950/20 shadow-[0_0_12px_rgba(0,242,254,0.15)]"
      }
    />
  );
};

export default PersonsMetricCard;

