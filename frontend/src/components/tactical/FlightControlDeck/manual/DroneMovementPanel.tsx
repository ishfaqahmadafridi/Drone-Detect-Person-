"use client";

import { DRONE_DIRECTIONS, DRONE_MOVEMENT } from "@/constants/tactical";
import { useDroneMovement } from "@/hooks/useDroneMovement";
import { DroneDirectionButton } from "./DroneDirectionButton";

export function DroneMovementPanel() {
  const control = useDroneMovement();
  const { status, pending, ownsControl } = control;
  return (
    <section className={DRONE_MOVEMENT.panelClass} aria-label="Tello movement controls">
      <h3>Tello manual control — {status?.mode ?? "loading"}</h3>
      <p className={DRONE_MOVEMENT.mutedClass}>
        {status?.mode === "simulation" ? "Simulation: no commands are sent to an aircraft." : "Tello SDK control"}
        {" · "}{status?.flight_state ?? "unknown"}
      </p>
      <button type="button" className={DRONE_MOVEMENT.buttonClass} disabled={pending}
        onClick={() => void control.connect()}>
        {ownsControl ? "Resume control" : "Connect controls"}
      </button>
      <p className={DRONE_MOVEMENT.mutedClass}>Hold a direction to move; release to stop. Power: {DRONE_MOVEMENT.defaultPower}%.</p>
      <div className={DRONE_MOVEMENT.gridClass}>
        {DRONE_DIRECTIONS.map(option => (
          <DroneDirectionButton key={option.direction} option={option}
            disabled={pending || !ownsControl || status?.flight_state !== "airborne"}
            active={control.held.includes(option.direction)} onPress={control.press} onRelease={control.release} />
        ))}
      </div>
      <div className={DRONE_MOVEMENT.gridClass}>
        <button type="button" className={DRONE_MOVEMENT.buttonClass}
          disabled={pending || !ownsControl || status?.flight_state !== "landed"}
          onClick={() => void control.action("takeoff")}>Take off</button>
        <button type="button" className={DRONE_MOVEMENT.buttonClass} disabled={pending || !ownsControl}
          onClick={() => void control.action("land")}>Land</button>
        <button type="button" className={DRONE_MOVEMENT.buttonClass} disabled={pending || !ownsControl}
          onClick={() => void control.action("hover")}>Stop / hover</button>
        <button type="button" className={DRONE_MOVEMENT.buttonClass}
          disabled={pending || !ownsControl || status?.flight_state !== "landed"}
          onClick={() => void control.action("disconnect")}>Disconnect</button>
      </div>
      {control.error && <p role="alert" className={DRONE_MOVEMENT.errorClass}>{control.error}</p>}
    </section>
  );
}
