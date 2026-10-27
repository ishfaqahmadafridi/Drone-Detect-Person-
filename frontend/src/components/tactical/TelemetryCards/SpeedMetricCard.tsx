
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";
import React from "react";
import { Zap } from "lucide-react";
import { MetricTile } from "./MetricTile";
import { SpeedMetricCardProps } from "@/types";

export const SpeedMetricCard: React.FC<SpeedMetricCardProps> = ({ fps }) => {
  return (
    <MetricTile
      title="SYSTEM SPEED"
      icon={<Zap className={TACTICAL_VIEW_STYLES.FlightDeckHeader_Navigation_className} />}
      value={fps ? fps.toFixed(1) : "0.0"}
      subValue="FPS"
      progressPercent={(fps / 30) * 100}
      progressBarColor={TACTICAL_VIEW_STYLES.SpeedMetricCard_MetricTile_progressBarColor}
    />
  );
};
