import { useCallback, useSyncExternalStore, type RefObject } from "react";

const subscribe = (notify: () => void) => {
  document.addEventListener("fullscreenchange", notify);
  return () => document.removeEventListener("fullscreenchange", notify);
};
const serverSnapshot = () => false;

export function useFullscreen(elementRef: RefObject<HTMLElement | null>) {
  const isFullscreen = useSyncExternalStore(subscribe,
    () => document.fullscreenElement === elementRef.current && elementRef.current !== null, serverSnapshot);
  const fullscreenSupported = useSyncExternalStore(subscribe,
    () => document.fullscreenEnabled === true && typeof elementRef.current?.requestFullscreen === "function", serverSnapshot);

  const toggleFullscreen = useCallback(async () => {
    const element = elementRef.current;
    if (!element) throw new Error("The video viewport is unavailable.");
    if (!document.fullscreenEnabled || typeof element.requestFullscreen !== "function") {
      throw new Error("Fullscreen is not supported in this browser.");
    }
    if (document.fullscreenElement === element) await document.exitFullscreen();
    else {
      if (document.fullscreenElement) await document.exitFullscreen();
      await element.requestFullscreen();
    }
  }, [elementRef]);

  return { isFullscreen, fullscreenSupported, toggleFullscreen };
}
