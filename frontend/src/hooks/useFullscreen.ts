import { useState, useCallback, RefObject } from "react";

export const useFullscreen = (elementRef: RefObject<HTMLElement | null>) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!elementRef.current) return;

    if (!document.fullscreenElement) {
      elementRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.warn("Fullscreen request error:", err));
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch((err) => console.warn("Exit fullscreen error:", err));
    }
  }, [elementRef]);

  return { isFullscreen, toggleFullscreen };
};
