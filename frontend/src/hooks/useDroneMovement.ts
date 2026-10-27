import { useCallback, useEffect, useRef, useState } from "react";
import { droneControlApi } from "@/services/api/droneControlApi";
import { DRONE_MOVEMENT } from "@/constants/tactical";
import { createDroneControlSessionId, droneMovementAxes } from "@/utils/droneMovement";
import { apiErrorMessage } from "@/utils/apiError";
import type { DroneControlStatus, DroneDirection, DroneManualAction } from "@/types";

export function useDroneMovement() {
  const [status, setStatus] = useState<DroneControlStatus | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [held, setHeld] = useState<DroneDirection[]>([]);
  const [ownsControl, setOwnsControl] = useState(false);
  const session = useRef("");
  const sequence = useRef(0);
  const directions = useRef(new Set<DroneDirection>());
  const enabled = useRef(false);
  const mounted = useRef(true);
  const inFlight = useRef<Promise<void> | null>(null);
  const dirty = useRef(false);
  const busy = useRef(false);
  const focused = useRef(true);
  const revision = useRef(0);

  const publish = useCallback(() => {
    dirty.current = true;
    if (inFlight.current || !enabled.current) return;
    const task = async () => {
      while (dirty.current && enabled.current) {
        dirty.current = false;
        try {
          const result = await droneControlApi.input(session.current, ++sequence.current,
            droneMovementAxes(directions.current, DRONE_MOVEMENT.defaultPower));
          if (mounted.current) setStatus(result);
        } catch (err) {
          enabled.current = false;
          directions.current.clear();
          if (mounted.current) {
            setHeld([]);
            setOwnsControl(false);
            setError(apiErrorMessage(err));
          }
        }
      }
    };
    inFlight.current = task().finally(() => { inFlight.current = null; });
  }, []);

  const releaseAll = useCallback(() => {
    directions.current.clear();
    if (mounted.current) setHeld([]);
    publish();
  }, [publish]);

  useEffect(() => {
    mounted.current = true;
    let disposed = false;
    const requestRevision = revision.current;
    void droneControlApi.status().then(result => {
      if (!disposed && requestRevision === revision.current) setStatus(result);
    }).catch(err => {
      if (!disposed && requestRevision === revision.current) setError(apiErrorMessage(err));
    });
    const blur = () => { focused.current = false; releaseAll(); enabled.current = false; };
    const focus = () => { focused.current = true; };
    const visibility = () => { if (document.hidden) blur(); };
    window.addEventListener("blur", blur);
    window.addEventListener("focus", focus);
    document.addEventListener("visibilitychange", visibility);
    const timer = setInterval(() => publish(), DRONE_MOVEMENT.heartbeatMs);
    return () => {
      disposed = true;
      releaseAll();
      enabled.current = false;
      mounted.current = false;
      clearInterval(timer);
      window.removeEventListener("blur", blur);
      window.removeEventListener("focus", focus);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [publish, releaseAll]);

  const connect = async () => {
    if (busy.current) return;
    revision.current += 1;
    busy.current = true;
    setPending(true);
    setError("");
    try {
      if (!session.current) session.current = createDroneControlSessionId();
      const result = await droneControlApi.connect(session.current);
      if (!mounted.current) return;
      setStatus(result);
      setOwnsControl(true);
      enabled.current = !document.hidden && focused.current;
      publish();
    } catch (err) { if (mounted.current) setError(apiErrorMessage(err)); }
    finally { busy.current = false; if (mounted.current) setPending(false); }
  };

  const action = async (value: DroneManualAction | "disconnect") => {
    if (busy.current) return;
    revision.current += 1;
    busy.current = true;
    setPending(true);
    setError("");
    releaseAll();
    enabled.current = false;
    await inFlight.current;
    try {
      const result = value === "disconnect"
        ? await droneControlApi.disconnect(session.current)
        : await droneControlApi.action(session.current, value);
      if (!mounted.current) return;
      setStatus(result);
      setOwnsControl(result.connected);
      enabled.current = result.connected && !document.hidden && focused.current;
      publish();
    } catch (err) {
      if (mounted.current) { setError(apiErrorMessage(err)); setOwnsControl(false); }
    } finally { busy.current = false; if (mounted.current) setPending(false); }
  };

  const press = (direction: DroneDirection) => {
    if (!ownsControl || status?.flight_state !== "airborne" || busy.current) return;
    enabled.current = true;
    directions.current.add(direction);
    setHeld([...directions.current]);
    publish();
  };
  const release = (direction: DroneDirection) => {
    directions.current.delete(direction);
    setHeld([...directions.current]);
    publish();
  };
  return { status, pending, error, held, ownsControl, connect, action, press, release, releaseAll };
}
