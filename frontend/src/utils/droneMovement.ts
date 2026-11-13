import { DRONE_DIRECTIONS, DRONE_MOVEMENT } from "@/constants/tactical";
import type { DroneControlAxes, DroneControlStatus, DroneDirection, DroneTelemetryTile } from "@/types";

export function droneConnectionMessage(status: DroneControlStatus | null, pending: boolean, error: string): string {
  if (pending) return "Processing control request — waiting for the backend.";
  if (!status) return error ? "Controller unavailable — check the backend connection." : "Checking controller status…";
  if (status.mode === "simulation") {
    return status.connected
      ? "Simulation connected — no real drone is connected."
      : "Simulation mode — no real drone is connected.";
  }
  if (status.flight_state === "unknown") return "Recovery required — aircraft state is unknown. Movement is disabled.";
  if (!status.connected) return "Drone disconnected — join TELLO Wi-Fi, then select Connect controls.";
  if (error) return "Controller needs attention — check the error below before sending commands.";
  return "SDK connected — Tello acknowledged the connection.";
}

/**
 * Telemetry tiles for a connected Tello; empty in simulation, which has no aircraft to measure.
 * A stale broadcast is flagged because it is the earliest sign of a lost Wi-Fi link.
 */
export function droneTelemetryTiles(status: DroneControlStatus | null): DroneTelemetryTile[] {
  if (status?.mode !== "tello" || !status.connected) return [];
  const telemetry = status.telemetry;
  const battery = telemetry?.battery_percent ?? null;
  const reading = (value: number | null | undefined, unit: string) => (value ?? null) === null ? "—" : `${value}${unit}`;
  return [
    { label: "Battery", value: reading(battery, "%"), warn: battery !== null && battery < DRONE_MOVEMENT.lowBatteryPercent },
    { label: "Height", value: reading(telemetry?.height_cm, " cm"), warn: false },
    { label: "Temp", value: reading(telemetry?.temperature_high_c, " °C"), warn: false },
    {
      label: "Link",
      value: !telemetry ? "Waiting" : telemetry.fresh ? "Live" : `Stale ${telemetry.age_s.toFixed(1)} s`,
      warn: !telemetry?.fresh,
    },
  ];
}

export function droneDirectionForKey(code: string): DroneDirection | undefined {
  return DRONE_DIRECTIONS.find(option => option.key === code)?.direction;
}

/** getRandomValues also works when a phone opens the dashboard over local HTTP. */
export function createDroneControlSessionId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function droneMovementAxes(held: ReadonlySet<DroneDirection>, power: number): DroneControlAxes {
  const axes: DroneControlAxes = { left_right: 0, forward_back: 0, up_down: 0, yaw: 0 };
  const magnitude = Math.min(DRONE_MOVEMENT.maxPower, Math.max(0, Math.round(power)));
  for (const option of DRONE_DIRECTIONS) {
    if (held.has(option.direction)) axes[option.axis] += option.sign * magnitude;
  }
  return axes;
}
