import { DRONE_DIRECTIONS, DRONE_MOVEMENT } from "@/constants/tactical";
import type { DroneControlAxes, DroneDirection } from "@/types";

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
