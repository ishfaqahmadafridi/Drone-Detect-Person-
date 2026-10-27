"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { BatteryHealthGaugeProps } from "@/types";
import { Battery, BatteryCharging } from "lucide-react";
import { getBatteryColor } from "@/utils";

export const BatteryHealthGauge: React.FC<BatteryHealthGaugeProps> = ({
  battery,
  voltage,
  health,
  flightTime,
}) => {
  return (
    <div className={TACTICAL_VIEW_STYLES.BatteryHealthGauge_div_className}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg border flex items-center justify-center ${getBatteryColor(battery)}`}>
          {battery > 20 ? <BatteryCharging className="w-5 h-5" /> : <Battery className="w-5 h-5" />}
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className={TACTICAL_VIEW_STYLES.BatteryHealthGauge_span_className}>{battery}%</span>
            <span className={TACTICAL_VIEW_STYLES.HeaderTitleCluster_p_className}>({voltage}V 6S)</span>
          </div>
          <div className={TACTICAL_VIEW_STYLES.BatteryHealthGauge_div_className_2}>
            <span>
              Health: <strong className={TACTICAL_VIEW_STYLES.BatteryHealthGauge_strong_className}>{health}%</strong>
            </span>
            <span>•</span>
            <span>
              Flight Rem: <strong className={TACTICAL_VIEW_STYLES.BatteryHealthGauge_strong_className_2}>{flightTime}m</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Segmented Charge Bar */}
      <div className="w-24 flex flex-col gap-1">
        <div className={TACTICAL_VIEW_STYLES.BatteryHealthGauge_div_className_3}>
          <div
            className={`h-full transition-all duration-500 ${
              battery > 50 ? TACTICAL_VIEW_STYLES.CardHeader_span_className_2 : battery > 20 ? TACTICAL_VIEW_STYLES.CardHeader_span_className_3 : TACTICAL_VIEW_STYLES.BatteryHealthGauge_div_className_4
            }`}
            style={{ width: `${battery}%` }}
          />
        </div>
        <span className={TACTICAL_VIEW_STYLES.BatteryHealthGauge_span_className_2}>3.73V / CELL</span>
      </div>
    </div>
  );
};

export default BatteryHealthGauge;
