import { useEffect, useRef } from "react";
import { droneDirectionForKey } from "@/utils/droneMovement";
import type { DroneDirection } from "@/types";

const EDITABLE = "input, textarea, select, [contenteditable='true']";

/**
 * Hold-to-move keyboard control. Keys are ignored while typing in a form field or with
 * modifiers (so browser shortcuts still work). Window blur is handled by useDroneMovement,
 * which releases every held direction.
 */
export function useDroneKeyboard(
  enabled: boolean,
  onPress: (direction: DroneDirection) => void,
  onRelease: (direction: DroneDirection) => void,
) {
  const handlers = useRef({ onPress, onRelease });
  useEffect(() => { handlers.current = { onPress, onRelease }; }, [onPress, onRelease]);

  useEffect(() => {
    if (!enabled) return;
    const keyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target instanceof Element && event.target.closest(EDITABLE)) return;
      const direction = droneDirectionForKey(event.code);
      if (!direction) return;
      event.preventDefault(); // Arrow keys would otherwise scroll the page mid-flight.
      if (!event.repeat) handlers.current.onPress(direction);
    };
    const keyUp = (event: KeyboardEvent) => {
      const direction = droneDirectionForKey(event.code);
      if (direction) handlers.current.onRelease(direction);
    };
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, [enabled]);
}
