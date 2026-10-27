import { useEffect, useRef, useState } from "react";
import { UI_FEEDBACK } from "@/constants/tactical";

export function useSnapshotFeedback(onSnapshot?: () => void) {
  const [isCapturing, setIsCapturing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const handleCapture = () => {
    setIsCapturing(true);
    onSnapshot?.();
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setIsCapturing(false), UI_FEEDBACK.snapshotMs);
  };
  return { isCapturing, handleCapture };
}
