import React from "react";
import type { DroneDirectionButtonProps } from "@/types";
import { DRONE_MOVEMENT } from "@/constants/tactical";

export const DroneDirectionButton: React.FC<DroneDirectionButtonProps> = ({
  option, disabled, active, onPress, onRelease,
}) => (
  <button
    type="button"
    disabled={disabled}
    aria-label={`Hold to move ${option.label.toLowerCase()}`}
    aria-pressed={active}
    className={`${DRONE_MOVEMENT.buttonClass} ${active ? DRONE_MOVEMENT.activeClass : ""}`}
    onPointerDown={event => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      onPress(option.direction);
    }}
    onPointerUp={() => onRelease(option.direction)}
    onPointerCancel={() => onRelease(option.direction)}
    onLostPointerCapture={() => onRelease(option.direction)}
    onBlur={() => onRelease(option.direction)}
    onKeyDown={event => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        if (!event.repeat) onPress(option.direction);
      }
    }}
    onKeyUp={event => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        onRelease(option.direction);
      }
    }}
  >
    {option.label}
  </button>
);
