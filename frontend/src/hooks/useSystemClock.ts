"use client";

import { useSyncExternalStore } from "react";
import { formatUtcTime } from "@/utils";

let listeners: Array<() => void> = [];
let intervalId: ReturnType<typeof setInterval> | null = null;

function subscribe(callback: () => void) {
  listeners.push(callback);
  if (listeners.length === 1 && typeof window !== "undefined") {
    intervalId = setInterval(() => {
      listeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    listeners = listeners.filter((l) => l !== callback);
    if (listeners.length === 0 && intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
}

export const useSystemClock = (placeholder = "--:--:--") => {
  const utcTime = useSyncExternalStore(
    subscribe,
    () => formatUtcTime(),
    () => placeholder
  );

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return {
    utcTime,
    timeStr: utcTime,
    isMounted,
  };
};

export default useSystemClock;
