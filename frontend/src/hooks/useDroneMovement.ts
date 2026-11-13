import { useCallback, useEffect, useRef, useState } from "react";
import { droneControlApi } from "@/services/api/droneControlApi";
import { DRONE_MOVEMENT } from "@/constants/tactical";
import { createDroneControlSessionId, droneMovementAxes } from "@/utils/droneMovement";
import { apiErrorMessage } from "@/utils/apiError";
import { useDroneKeyboard } from "./useDroneKeyboard";
import type { DroneControlStatus, DroneDirection, DroneManualAction, DroneVideoStatus } from "@/types";

export function useDroneMovement() {
  const [status, setStatus] = useState<DroneControlStatus | null>(null);
  const [video, setVideo] = useState<DroneVideoStatus | null>(null);
  const [videoError, setVideoError] = useState("");
  const [videoPending, setVideoPending] = useState(false);
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
  const owns = useRef(false);
  const cameraBusy = useRef(false);
  const emergencyBusy = useRef(false);
  const [emergencyPending, setEmergencyPending] = useState(false);

  const updateOwnership = useCallback((value: boolean) => {
    owns.current = value;
    setOwnsControl(value);
  }, []);

  const publish = useCallback(() => {
    dirty.current = true;
    if (inFlight.current || !enabled.current) return;
    const task = async () => {
      while (dirty.current && enabled.current) {
        dirty.current = false;
        // A reply that started before an emergency/connect/action describes stale state; drop it.
        const requestRevision = revision.current;
        try {
          const result = await droneControlApi.input(session.current, ++sequence.current,
            droneMovementAxes(directions.current, DRONE_MOVEMENT.defaultPower));
          if (mounted.current && requestRevision === revision.current) setStatus(result);
        } catch (err) {
          if (requestRevision !== revision.current) continue;
          enabled.current = false;
          directions.current.clear();
          if (mounted.current) {
            setHeld([]);
            updateOwnership(false);
            setError(apiErrorMessage(err));
          }
        }
      }
    };
    inFlight.current = task().finally(() => { inFlight.current = null; });
  }, [updateOwnership]);

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
    // Resume the neutral heartbeat so a hovering drone is not auto-landed by Tello's 15 s no-command timeout.
    const focus = () => { focused.current = true; if (owns.current && !document.hidden && !busy.current && !cameraBusy.current && !emergencyBusy.current) { enabled.current = true; publish(); } };
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

  const startCamera = async () => {
    if (cameraBusy.current || emergencyBusy.current) return;
    cameraBusy.current = true;
    setVideoPending(true);
    setVideoError("");
    const resumeHeartbeat = enabled.current;
    enabled.current = false;
    await inFlight.current;
    try {
      if (!mounted.current || emergencyBusy.current) return;
      const result = await droneControlApi.startVideo(session.current);
      if (mounted.current) setVideo(result);
    } catch (err) {
      if (mounted.current) setVideoError(apiErrorMessage(err));
    } finally {
      cameraBusy.current = false;
      if (mounted.current) {
        setVideoPending(false);
        if (resumeHeartbeat && owns.current && focused.current && !document.hidden && !emergencyBusy.current) {
          enabled.current = true;
          publish();
        }
      }
    }
  };

  useEffect(() => {
    if (!video?.requested) return;
    let disposed = false;
    let fetching = false;
    const timer = setInterval(() => {
      if (fetching) return;
      fetching = true;
      void droneControlApi.videoStatus().then(result => {
        if (!disposed) { setVideo(result); setVideoError(""); }
      }).catch(err => {
        if (!disposed) setVideoError(apiErrorMessage(err));
      }).finally(() => { fetching = false; });
    }, DRONE_MOVEMENT.videoStatusIntervalMs);
    return () => { disposed = true; clearInterval(timer); };
  }, [video?.requested]);

  const connect = async (confirmedLanded = false) => {
    if (busy.current || cameraBusy.current || emergencyBusy.current) return;
    const requestRevision = ++revision.current;
    busy.current = true;
    setPending(true);
    setError("");
    try {
      if (!session.current) session.current = createDroneControlSessionId();
      const result = await droneControlApi.connect(session.current, confirmedLanded);
      if (!mounted.current || requestRevision !== revision.current) return;
      setStatus(result);
      updateOwnership(true);
      if (result.mode === "tello" && result.flight_state === "landed") await startCamera();
      if (!mounted.current || requestRevision !== revision.current) return;
      enabled.current = !document.hidden && focused.current;
      publish();
    } catch (err) {
      if (mounted.current && requestRevision === revision.current) setError(apiErrorMessage(err));
    }
    finally { busy.current = false; if (mounted.current) setPending(false); }
  };

  const action = async (value: DroneManualAction | "disconnect") => {
    if (busy.current || cameraBusy.current || emergencyBusy.current) return;
    const requestRevision = ++revision.current;
    busy.current = true;
    setPending(true);
    setError("");
    releaseAll();
    enabled.current = false;
    await inFlight.current;
    try {
      if (!mounted.current || requestRevision !== revision.current) return;
      const result = value === "disconnect"
        ? await droneControlApi.disconnect(session.current)
        : await droneControlApi.action(session.current, value);
      if (!mounted.current || requestRevision !== revision.current) return;
      setStatus(result);
      updateOwnership(result.connected);
      enabled.current = result.connected && !document.hidden && focused.current;
      publish();
    } catch (err) {
      if (mounted.current && requestRevision === revision.current) {
        setError(apiErrorMessage(err));
        updateOwnership(false);
        try {
          const latest = await droneControlApi.status();
          if (!mounted.current || requestRevision !== revision.current) return;
          setStatus(latest);
          if (!latest.connected) return;
          // A global connected flag does not establish ownership of this session.
          const verified = await droneControlApi.input(session.current, ++sequence.current,
            droneMovementAxes(new Set<DroneDirection>(), DRONE_MOVEMENT.defaultPower));
          if (mounted.current && requestRevision === revision.current) {
            setStatus(verified);
            updateOwnership(verified.connected);
            enabled.current = verified.connected && !document.hidden && focused.current;
            publish();
          }
        } catch { /* Keep the original action error when status is unavailable. */ }
      }
    } finally { busy.current = false; if (mounted.current) setPending(false); }
  };

  /** Deliberately ignores `busy`: it must work while a takeoff/land is still awaiting its ack. */
  const emergencyStop = async () => {
    if (!session.current || emergencyBusy.current) return;
    emergencyBusy.current = true;
    revision.current += 1;
    setEmergencyPending(true);
    enabled.current = false; // Before releaseAll, so it cannot start a racing heartbeat.
    releaseAll();
    try {
      const result = await droneControlApi.emergency(session.current);
      // Heartbeats issued while this was in flight (e.g. a focus event after the confirm dialog)
      // may have been answered before the backend processed the stop; invalidate them.
      revision.current += 1;
      if (mounted.current) { setStatus(result); setError(result.error); }
    } catch (err) {
      if (mounted.current) setError(apiErrorMessage(err));
    } finally {
      emergencyBusy.current = false;
      if (mounted.current) setEmergencyPending(false);
    }
  };

  const confirmEmergencyStop = () => {
    if (window.confirm(DRONE_MOVEMENT.emergencyConfirm)) void emergencyStop();
  };

  const press = (direction: DroneDirection) => {
    if (!ownsControl || status?.flight_state !== "airborne" || busy.current || cameraBusy.current || emergencyBusy.current) return;
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
  useDroneKeyboard(ownsControl && status?.flight_state === "airborne", press, release);

  return {
    video, videoError, videoPending, startCamera, status, pending, error, held, ownsControl,
    connect, action, press, release, releaseAll, emergencyStop, emergencyPending, confirmEmergencyStop,
  };
}
