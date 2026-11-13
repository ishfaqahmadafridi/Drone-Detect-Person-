import React from "react";
import type { DronePadProps } from "@/types";
import { DRONE_DIRECTIONS, DRONE_MOVEMENT } from "@/constants/tactical";
import { DroneDirectionButton } from "./DroneDirectionButton";

export const DronePad: React.FC<DronePadProps> = ({ pad, disabled, held, onPress, onRelease }) => (
  <div role="group" aria-label={pad.label} className={DRONE_MOVEMENT.padClass}>
    <span className={DRONE_MOVEMENT.sectionLabelClass}>{pad.label}</span>
    <div className={DRONE_MOVEMENT.padGridClass}>
      {pad.cells.map((direction, index) => {
        const option = DRONE_DIRECTIONS.find(item => item.direction === direction);
        return option ? (
          <DroneDirectionButton key={option.direction} option={option} disabled={disabled}
            active={held.includes(option.direction)} onPress={onPress} onRelease={onRelease} />
        ) : <span key={`empty-${index}`} aria-hidden="true" />;
      })}
    </div>
  </div>
);
