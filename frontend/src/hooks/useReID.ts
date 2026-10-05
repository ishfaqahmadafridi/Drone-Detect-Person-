import { useEffect, useRef, useState } from "react";
import type { ReIDStatus } from "@/types";
import { REID_API } from "@/constants/network";
import { reidApi } from "@/services/api/reidApi";
import { apiErrorMessage } from "@/utils/apiError";
import { useAppSelector } from "@/store";

export function useReID() {
  const groundCameraId = useAppSelector(state => state.telemetry.primary_camera_ids.ground);
  const [status, setStatus] = useState<ReIDStatus | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const mounted = useRef(false);
  const revision = useRef(0);

  useEffect(() => {
    mounted.current = true;
    let disposed = false;
    let timer: ReturnType<typeof setTimeout>;
    const controller = new AbortController();
    const poll = async () => {
      const requestRevision = revision.current;
      try {
        const result = await reidApi.status(controller.signal);
        if (!disposed && requestRevision === revision.current) {
          setStatus(result);
          setError("");
        }
      } catch (failure) {
        if (!disposed && requestRevision === revision.current) {
          setStatus(null); // Never display old candidates as current after a disconnect.
          setError(apiErrorMessage(failure));
        }
      }
      if (!disposed) timer = setTimeout(poll, REID_API.pollIntervalMs);
    };
    void poll();
    return () => { disposed = true; mounted.current = false; controller.abort(); clearTimeout(timer); };
  }, []);

  const reconnect = async () => {
    if (pending) return;
    const requestRevision = ++revision.current;
    setPending(true);
    try {
      const result = await reidApi.status();
      if (mounted.current && requestRevision === revision.current) { setStatus(result); setError(""); }
    } catch (failure) {
      if (mounted.current && requestRevision === revision.current) setError(apiErrorMessage(failure));
    } finally {
      if (mounted.current) setPending(false);
    }
  };

  const retry = async () => {
    if (pending) return;
    revision.current += 1;
    setPending(true);
    try {
      const result = await reidApi.retry();
      if (mounted.current) { setStatus(result); setError(""); }
    } catch (failure) {
      if (mounted.current) setError(apiErrorMessage(failure));
    } finally {
      if (mounted.current) setPending(false);
    }
  };
  return { status, error, pending, retry, reconnect, groundCameraId };
}
