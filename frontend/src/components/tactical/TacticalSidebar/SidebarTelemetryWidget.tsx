"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { SidebarTelemetryWidgetProps } from "@/types";
import { Battery, Zap, Camera, ShieldCheck } from "lucide-react";

export const SidebarTelemetryWidget: React.FC<SidebarTelemetryWidgetProps> = ({
  batteryPct,
  isBatteryLow,
  altitude,
  speed,
  viewMode = "aerial",
}) => {
  if (viewMode === "ground") {
    return (
      <div className={TACTICAL_VIEW_STYLES.SidebarTelemetryWidget_div_className}>
        <div className="flex items-center justify-between text-[11px] font-mono-code">
          <span className={TACTICAL_VIEW_STYLES.SidebarTelemetryWidget_span_className}>
            <Zap className={TACTICAL_VIEW_STYLES.DroneBatteryPill_Battery_className} />
            PoE POWER:
          </span>
          <span className={TACTICAL_VIEW_STYLES.PerimeterNetworkStatus_span_className}>
            48V <ShieldCheck className={TACTICAL_VIEW_STYLES.FlightPhysicsGrid_Compass_className} />
          </span>
        </div>

        {/* Continuous PoE stable power bar */}
        <div className={TACTICAL_VIEW_STYLES.SidebarTelemetryWidget_div_className_2}>
          <div
            className={TACTICAL_VIEW_STYLES.SidebarTelemetryWidget_div_className_3}
            style={{ width: "100%" }}
          />
        </div>

        <div className={TACTICAL_VIEW_STYLES.SidebarTelemetryWidget_div_className_4}>
          <div className="flex items-center gap-1">
            <Camera className={TACTICAL_VIEW_STYLES.SidebarTelemetryWidget_Camera_className} />
            <span>MOUNT:</span> <span className={TACTICAL_VIEW_STYLES.PreviewTelemetryAudit_span_className_3}>2.8m</span>
          </div>
          <div className="text-right">
            RES: <span className={TACTICAL_VIEW_STYLES.SidebarTelemetryWidget_span_className_2}>1080p</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={TACTICAL_VIEW_STYLES.SidebarTelemetryWidget_div_className}>
      <div className="flex items-center justify-between text-[11px] font-mono-code">
        <span className={TACTICAL_VIEW_STYLES.SidebarTelemetryWidget_span_className}>
          <Battery
            className={`w-3.5 h-3.5 ${isBatteryLow ? TACTICAL_VIEW_STYLES.SidebarTelemetryWidget_Battery_className : TACTICAL_VIEW_STYLES.BatteryHealthGauge_strong_className}`}
          />
          6S BATTERY:
        </span>
        <span className={`font-bold ${isBatteryLow ? TACTICAL_VIEW_STYLES.OpticalSensorStatus_Video_className : TACTICAL_VIEW_STYLES.BatteryHealthGauge_strong_className}`}>
          {batteryPct}%
        </span>
      </div>

      {/* Battery level progress meter */}
      <div className={TACTICAL_VIEW_STYLES.SidebarTelemetryWidget_div_className_2}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isBatteryLow ? TACTICAL_VIEW_STYLES.SidebarTelemetryWidget_div_className_5 : TACTICAL_VIEW_STYLES.SidebarTelemetryWidget_div_className_6
          }`}
          style={{ width: `${Math.min(100, Math.max(0, batteryPct))}%` }}
        />
      </div>

      <div className={TACTICAL_VIEW_STYLES.SidebarTelemetryWidget_div_className_4}>
        <div>
          ALT: <span className={TACTICAL_VIEW_STYLES.PreviewTelemetryAudit_span_className_3}>{altitude.toFixed(1)}m</span>
        </div>
        <div className="text-right">
          SPD: <span className={TACTICAL_VIEW_STYLES.PreviewTelemetryAudit_span_className_3}>{speed.toFixed(1)}m/s</span>
        </div>
      </div>
    </div>
  );
};

export default SidebarTelemetryWidget;
