import React from "react";
import type { DroneFlightActionsProps } from "@/types";
import { DRONE_MOVEMENT } from "@/constants/tactical";

/** One primary action per state: connect, then take off or land; recovery when state is unknown. */
export const DroneFlightActions: React.FC<DroneFlightActionsProps> = ({ status, pending, ownsControl, onConnect, onAction }) => {
  const state = status?.flight_state;
  if (state === "unknown") {
    return (
      <div className="flex flex-col gap-2">
        <p className={DRONE_MOVEMENT.mutedClass}>
          Verify the drone is on the ground with propellers stopped before recovering.
        </p>
        <button type="button" className={DRONE_MOVEMENT.primaryButtonClass} disabled={pending}
          onClick={() => onConnect(true)}>
          Confirm drone is on the ground and reconnect
        </button>
      </div>
    );
  }
  if (!ownsControl) {
    return (
      <button type="button" className={DRONE_MOVEMENT.primaryButtonClass} disabled={pending || !status}
        onClick={() => onConnect()}>
        Connect controls
      </button>
    );
  }
  const airborne = state === "airborne";
  return (
    <div className={DRONE_MOVEMENT.actionGridClass}>
      <button type="button" className={DRONE_MOVEMENT.primaryButtonClass} disabled={pending}
        onClick={() => onAction(airborne ? "land" : "takeoff")}>
        {airborne ? "Land" : "Take off"}
      </button>
      <button type="button" className={DRONE_MOVEMENT.buttonClass} disabled={pending || !airborne}
        onClick={() => onAction("hover")}>
        Stop / hover
      </button>
      <button type="button" className={DRONE_MOVEMENT.buttonClass} disabled={pending || airborne}
        onClick={() => onAction("disconnect")}>
        Disconnect
      </button>
    </div>
  );
};
