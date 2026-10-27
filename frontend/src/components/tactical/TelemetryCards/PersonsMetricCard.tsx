
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";
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
      icon={<Users className={TACTICAL_VIEW_STYLES.FlightDeckHeader_Navigation_className} />}
      value={count}
      subValue={viewMode === "ground" ? "Perimeter Tracks" : "Aerial Tracks"}
      onClick={onClick}
      actionHint="> Click to open"
      showProgressLine={false}
      isAlertActive={count > 0}
      alertBorderColor={
        viewMode === "ground"
          ? TACTICAL_VIEW_STYLES.PersonsMetricCard_MetricTile_alertBorderColor
          : TACTICAL_VIEW_STYLES.PersonsMetricCard_MetricTile_alertBorderColor_2
      }
    />
  );
};

export default PersonsMetricCard;

