"use client";

import { useState, useEffect } from "react";
import { formatUtcTime } from "@/utils";

export const useSystemClock = (placeholder = "--:--:--") => {
  const [utcTime, setUtcTime] = useState<string>(placeholder);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    setUtcTime(formatUtcTime());

    const timer = setInterval(() => {
      setUtcTime(formatUtcTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const displayTime = isMounted ? utcTime : placeholder;

  return {
    utcTime: displayTime,
    timeStr: displayTime,
    isMounted,
  };
};

export default useSystemClock;
