import { useState, useEffect } from "react";
import { formatUtcTime } from "@/utils";

export const useSystemClock = () => {
  const [utcTime, setUtcTime] = useState<string>(() => formatUtcTime());

  useEffect(() => {
    const updateClock = () => {
      setUtcTime(formatUtcTime());
    };

    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return { utcTime, timeStr: utcTime };
};

export default useSystemClock;
