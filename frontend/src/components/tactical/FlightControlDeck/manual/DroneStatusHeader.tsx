import React from "react";
import type { DroneStatusHeaderProps } from "@/types";
import { DRONE_MOVEMENT } from "@/constants/tactical";

export const DroneStatusHeader: React.FC<DroneStatusHeaderProps> = ({ status, message }) => (
  <header className="flex flex-col gap-2">
    <div className={DRONE_MOVEMENT.headerClass}>
      <h3 className={DRONE_MOVEMENT.titleClass}>{DRONE_MOVEMENT.title}</h3>
      {status && (
        <div className={DRONE_MOVEMENT.badgeRowClass}>
          <span className={`${DRONE_MOVEMENT.badgeClass} ${DRONE_MOVEMENT.modeBadgeClass[status.mode]}`}>
            {status.mode === "tello" ? "Tello" : "Simulation"}
          </span>
          <span aria-label="Flight state" className={`${DRONE_MOVEMENT.badgeClass} ${DRONE_MOVEMENT.flightBadgeClass[status.flight_state]}`}>
            {DRONE_MOVEMENT.flightLabel[status.flight_state]}
          </span>
        </div>
      )}
    </div>
    <p role="status" aria-label="Tello connection status" aria-live="polite" className={DRONE_MOVEMENT.messageClass}>
      {message}
    </p>
  </header>
);
