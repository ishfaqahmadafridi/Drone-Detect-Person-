
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";
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
          className={`w-4 h-4 ${count > 0 ? TACTICAL_VIEW_STYLES.SidebarTelemetryWidget_Battery_className : TACTICAL_VIEW_STYLES.PerimeterNetworkStatus_span_className_3}`}
        />
      }
      value={count}
      subValue="Breaches"
      progressPercent={count * 33.3}
      progressBarColor={TACTICAL_VIEW_STYLES.SidebarTelemetryWidget_div_className_5}
      isAlertActive={count > 0}
      alertBorderColor={TACTICAL_VIEW_STYLES.IntrudersMetricCard_MetricTile_alertBorderColor}
    />
  );
};
