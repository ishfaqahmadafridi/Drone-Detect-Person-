import React from "react";
import type { DroneEmergencyButtonProps } from "@/types";
import { DRONE_MOVEMENT } from "@/constants/tactical";

/** Confirmation guards against an accidental mid-air motor cut. */
export const DroneEmergencyButton: React.FC<DroneEmergencyButtonProps> = ({ pending, onConfirm }) => (
  <button type="button" className={DRONE_MOVEMENT.emergencyClass} disabled={pending}
    onClick={onConfirm}>
    {DRONE_MOVEMENT.emergencyLabel}
  </button>
);
