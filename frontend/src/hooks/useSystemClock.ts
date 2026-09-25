import { useState, useEffect } from "react";

export const useSystemClock = () => {
  const [utcTime, setUtcTime] = useState<string>("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setUtcTime(now.toTimeString().split(" ")[0]);
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);

    return () => clearInterval(timer);
  }, []);

  return { utcTime };
};
