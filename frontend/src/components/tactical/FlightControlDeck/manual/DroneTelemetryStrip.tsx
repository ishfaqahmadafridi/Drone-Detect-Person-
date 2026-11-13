import React from "react";
import type { DroneTelemetryStripProps } from "@/types";
import { DRONE_MOVEMENT } from "@/constants/tactical";

export const DroneTelemetryStrip: React.FC<DroneTelemetryStripProps> = ({ tiles }) => (
  <dl role="status" aria-label="Tello telemetry" className={DRONE_MOVEMENT.telemetryGridClass}>
    {tiles.map(tile => (
      <div key={tile.label} className={DRONE_MOVEMENT.telemetryTileClass}>
        <dt className={DRONE_MOVEMENT.telemetryLabelClass}>{tile.label}</dt>
        <dd className={DRONE_MOVEMENT.telemetryValueClass[tile.warn ? "warn" : "normal"]}>{tile.value}</dd>
      </div>
    ))}
  </dl>
);
