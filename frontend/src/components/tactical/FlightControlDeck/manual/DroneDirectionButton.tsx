import React from "react";
import type { DroneDirectionButtonProps } from "@/types";
import { DRONE_MOVEMENT } from "@/constants/tactical";

export const DroneDirectionButton: React.FC<DroneDirectionButtonProps> = ({
  option, disabled, active, onPress, onRelease,
}) => {
  const Icon = option.icon;
  return (
  <button
    type="button"
    disabled={disabled}
    aria-label={`Hold to move ${option.label.toLowerCase()}`}
    aria-keyshortcuts={option.key.replace("Key", "")}
    title={`${option.label} (${option.keyLabel})`}
    aria-pressed={active}
    className={`${DRONE_MOVEMENT.directionButtonClass} ${DRONE_MOVEMENT.directionStateClass[active ? "active" : "idle"]}`}
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
    <Icon aria-hidden="true" className={DRONE_MOVEMENT.directionIconClass} />
  </button>
  );
};
