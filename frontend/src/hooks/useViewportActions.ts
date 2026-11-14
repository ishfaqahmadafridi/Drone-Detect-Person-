import { useEffect, useRef, useState } from "react";
import type { ViewportAction, ViewportActionName } from "@/types";
import { VIEWPORT_CONTROLS } from "@/constants/tactical";
import { apiErrorMessage } from "@/utils/apiError";

export function useViewportActions() {
  const [pending, setPending] = useState<ViewportActionName | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const busy = useRef(false);
  const mounted = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; if (timer.current) clearTimeout(timer.current); };
  }, []);

  const run = async (name: ViewportActionName, action?: ViewportAction) => {
    if (!action || busy.current) return;
    busy.current = true;
    if (timer.current) clearTimeout(timer.current);
    setPending(name);
    setError("");
    setMessage("");
    try {
      await action();
      if (mounted.current && name === "snapshot") {
        setMessage(VIEWPORT_CONTROLS.snapshot.success);
        timer.current = setTimeout(() => setMessage(""), VIEWPORT_CONTROLS.feedbackDurationMs);
      }
    } catch (failure) {
      if (mounted.current) setError(apiErrorMessage(failure));
    } finally {
      busy.current = false;
      if (mounted.current) setPending(null);
    }
  };
  return { pending, message, error, run };
}
