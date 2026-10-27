"use client";
import { TACTICAL_VIEW_STYLES } from "@/constants/tactical";


import React from "react";
import { FlightTelemetryBarProps } from "@/types";

export const FlightTelemetryBar: React.FC<FlightTelemetryBarProps> = ({
  altitude,
  batteryPercent,
  flightState,
}) => {
  return (
    <div className={TACTICAL_VIEW_STYLES.FlightTelemetryBar_div_className}>
      <span className={TACTICAL_VIEW_STYLES.GroundWizardStepIndicator_span_className_3}>
        ALTITUDE: <strong className={TACTICAL_VIEW_STYLES.BatteryHealthGauge_strong_className_2}>{altitude.toFixed(1)}m</strong>
      </span>
      <span className={TACTICAL_VIEW_STYLES.GroundWizardStepIndicator_span_className_3}>
        BATTERY:{" "}
        <strong className={batteryPercent > 25 ? TACTICAL_VIEW_STYLES.BatteryHealthGauge_strong_className : TACTICAL_VIEW_STYLES.OpticalSensorStatus_Video_className}>
          {batteryPercent}%
        </strong>
      </span>
      <span className={TACTICAL_VIEW_STYLES.GroundWizardStepIndicator_span_className_3}>
        MODE: <strong className={TACTICAL_VIEW_STYLES.OpticalSensorStatus_strong_className}>{flightState}</strong>
      </span>
    </div>
  );
};

export default FlightTelemetryBar;
