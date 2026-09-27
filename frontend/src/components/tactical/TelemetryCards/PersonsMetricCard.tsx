import React from "react";
import { Users } from "lucide-react";
import { MetricTile } from "./MetricTile";
import { PersonsMetricCardProps } from "@/types";

export const PersonsMetricCard: React.FC<PersonsMetricCardProps> = ({ count }) => {
  return (
    <MetricTile
      title="TOTAL PERSONS"
      icon={<Users className="w-4 h-4 text-cyan-400" />}
      value={count}
      subValue="Aerial Tracks"
      progressPercent={count * 20}
      progressBarColor="bg-cyan-400"
    />
  );
};
