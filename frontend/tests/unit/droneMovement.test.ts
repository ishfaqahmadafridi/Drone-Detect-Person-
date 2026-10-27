import { describe, expect, it } from "vitest";
import { droneMovementAxes, createDroneControlSessionId } from "@/utils/droneMovement";
import type { DroneDirection, DroneControlAxes } from "@/types";

describe("Tello direction mapping", () => {
  it.each<[DroneDirection, keyof DroneControlAxes, number]>([
    ["left", "left_right", -25], ["right", "left_right", 25],
    ["forward", "forward_back", 25], ["backward", "forward_back", -25],
    ["up", "up_down", 25], ["down", "up_down", -25],
    ["rotateLeft", "yaw", -25], ["rotateRight", "yaw", 25],
  ])("maps %s to the correct SDK channel", (direction, axis, value) => {
    const axes = droneMovementAxes(new Set([direction]), 25);
    expect(axes[axis]).toBe(value);
    expect(Object.values(axes).filter(Boolean)).toHaveLength(1);
  });

  it("combines axes and cancels opposing input", () => {
    expect(droneMovementAxes(new Set(["left", "right", "up", "forward"]), 25))
      .toEqual({ left_right: 0, forward_back: 25, up_down: 25, yaw: 0 });
  });

  it("returns neutral after release and clamps power", () => {
    expect(Object.values(droneMovementAxes(new Set(), 25))).toEqual([0, 0, 0, 0]);
    expect(droneMovementAxes(new Set(["up"]), 200).up_down).toBe(100);
    expect(droneMovementAxes(new Set(["up"]), -5).up_down).toBe(0);
  });

  it("creates a valid session UUID", () => {
    expect(createDroneControlSessionId()).toMatch(/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/);
  });
});
