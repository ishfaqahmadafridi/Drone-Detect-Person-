"use client";

import { useEffect } from "react";

/**
 * Custom hook to listen for Escape key presses and trigger a callback.
 * Automatically cleans up the global event listener on unmount or disable.
 */
export function useEscapeKey(enabled: boolean, onEscape: () => void): void {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onEscape();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onEscape]);
}

export default useEscapeKey;
