"use client";

import { DRONE_MOVEMENT, DRONE_PADS } from "@/constants/tactical";
import { useDroneMovement } from "@/hooks/useDroneMovement";
import { droneConnectionMessage, droneTelemetryTiles } from "@/utils/droneMovement";
import { DroneStatusHeader } from "./DroneStatusHeader";
import { DroneTelemetryStrip } from "./DroneTelemetryStrip";
import { DroneEmergencyButton } from "./DroneEmergencyButton";
import { DroneFlightActions } from "./DroneFlightActions";
import { DroneCameraControl } from "./DroneCameraControl";
import { DronePad } from "./DronePad";

export function DroneMovementPanel() {
  const control = useDroneMovement();
  const { status, pending, ownsControl } = control;
  const connected = ownsControl && !!status?.connected;
  const tiles = droneTelemetryTiles(status);
  const movementDisabled = pending || control.videoPending || !ownsControl || status?.flight_state !== "airborne";

  return (
    <section className={DRONE_MOVEMENT.panelClass} aria-label="Tello movement controls">
      <DroneStatusHeader status={status} message={droneConnectionMessage(status, pending, control.error)} />
      {tiles.length > 0 && <DroneTelemetryStrip tiles={tiles} />}
      {connected && <DroneEmergencyButton pending={control.emergencyPending} onConfirm={control.confirmEmergencyStop} />}
      <DroneFlightActions status={status} pending={pending || control.videoPending} ownsControl={ownsControl}
        onConnect={confirmed => void control.connect(confirmed)} onAction={action => void control.action(action)} />
      <div className={DRONE_MOVEMENT.padsClass}>
        {DRONE_PADS.map(pad => (
          <DronePad key={pad.label} pad={pad} disabled={movementDisabled} held={control.held}
            onPress={control.press} onRelease={control.release} />
        ))}
      </div>
      <p className={DRONE_MOVEMENT.mutedClass}>{DRONE_MOVEMENT.hint} Power {DRONE_MOVEMENT.defaultPower}%.</p>
      {status?.mode === "tello" && (
        <DroneCameraControl video={control.video} videoError={control.videoError} videoPending={control.videoPending}
          disabled={pending || !ownsControl || status.flight_state !== "landed"} onStart={() => void control.startCamera()} />
      )}
      {control.error && <p role="alert" className={DRONE_MOVEMENT.errorClass}>{control.error}</p>}
    </section>
  );
}
