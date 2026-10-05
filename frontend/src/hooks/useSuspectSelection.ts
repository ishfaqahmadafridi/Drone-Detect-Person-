import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setTelemetryData } from "@/store/slices/telemetrySlice";
import { setSuspectPortraits } from "@/store/slices/uiSlice";
import { trackingApi } from "@/services/api/trackingApi";
import { useEscapeKey } from "./useEscapeKey";
import { apiErrorMessage } from "@/utils/apiError";
import type { FrozenSelection, SuspectSelectionProps } from "@/types";
import { cropSuspectSnapshots } from "@/utils/suspectSnapshots";

export function useSuspectSelection({ channel, sourceType, selectedTargetIds }: SuspectSelectionProps = {}) {
  const dispatch = useAppDispatch();
  const legacy = useAppSelector(state => state.telemetry);
  const view_mode = channel ?? legacy.view_mode;
  const source_type = sourceType ?? legacy.source_type;
  const selected_target_ids = selectedTargetIds ?? legacy.selected_target_ids;
  const [snapshot, setSnapshot] = useState<FrozenSelection | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const portraits = useAppSelector(state => state.ui.suspectPortraits);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const activeToken = useRef<string | null>(null);
  const busy = useRef(false);

  useEffect(() => () => {
    if (activeToken.current) {
      void trackingApi.resume(activeToken.current, channel).catch(() => undefined);
      activeToken.current = null;
    }
  }, [view_mode, source_type, channel]);

  useEffect(() => {
    if (!snapshot) return;
    const timeout = setTimeout(() => {
      activeToken.current = null;
      setSnapshot(null);
      setError("Selection timed out and playback resumed. Freeze a new frame to continue.");
    }, snapshot.expires_in * 1000);
    return () => clearTimeout(timeout);
  }, [snapshot]);

  const freeze = async () => {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setError("");
    try {
      const frame = await trackingApi.freeze(channel);
      activeToken.current = frame.token;
      setSnapshot(frame);
      setSelectedIds(frame.selected_ids.filter(id => frame.detections.some(d => d.id === id)));
    } catch (error) { setError(apiErrorMessage(error)); }
    finally { setPending(false); busy.current = false; }
  };

  const finish = async (apply: boolean) => {
    if (!snapshot || busy.current) return;
    busy.current = true;
    setPending(true);
    setError("");
    try {
      if (apply) {
        const crops = await cropSuspectSnapshots(snapshot, selectedIds);
        const result = await trackingApi.commit(snapshot.token, selectedIds, channel);
        dispatch(setSuspectPortraits(crops.filter(person => result.selected_ids.includes(person.id))));
        if (!channel) dispatch(setTelemetryData({ tracking_mode: result.mode, selected_target_ids: result.selected_ids }));
      } else {
        await trackingApi.resume(snapshot.token, channel);
      }
      activeToken.current = null;
      setSnapshot(null);
    } catch (error) { setError(apiErrorMessage(error)); }
    finally { setPending(false); busy.current = false; }
  };

  useEscapeKey(!!snapshot && !pending, () => { void finish(false); });

  const clear = async () => {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setError("");
    try {
      await trackingApi.setMode("auto", undefined, channel);
      dispatch(setSuspectPortraits([]));
      if (!channel) dispatch(setTelemetryData({ tracking_mode: "auto", selected_target_ids: [] }));
    } catch (error) { setError(apiErrorMessage(error)); }
    finally { setPending(false); busy.current = false; }
  };

  const autoSelectSuspect = async (targetId?: number) => {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setError("");
    try {
      const frame = await trackingApi.freeze(channel);
      let chosenId = targetId;
      if (chosenId === undefined || chosenId === null) {
        if (frame.detections.length > 0) {
          // Sort by confidence or use highest confidence detection
          const sorted = [...frame.detections].sort((a, b) => (b.conf ?? 0) - (a.conf ?? 0));
          chosenId = sorted[0].id;
        }
      }
      if (chosenId !== undefined && chosenId !== null && frame.detections.some(d => d.id === chosenId)) {
        const crops = await cropSuspectSnapshots(frame, [chosenId]);
        const result = await trackingApi.commit(frame.token, [chosenId], channel);
        dispatch(setSuspectPortraits(crops.filter(person => result.selected_ids.includes(person.id))));
        if (!channel) dispatch(setTelemetryData({ tracking_mode: result.mode, selected_target_ids: result.selected_ids }));
      } else {
        await trackingApi.resume(frame.token, channel);
        setError("No detected person found on the current frame to capture.");
      }
      activeToken.current = null;
      setSnapshot(null);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setPending(false);
      busy.current = false;
    }
  };

  const toggle = (id: number) => setSelectedIds(ids => ids.includes(id) ? ids.filter(item => item !== id) : [...ids, id]);
  return {
    isGround: view_mode === "ground",
    snapshot,
    portraits,
    selectedIds,
    selectedCount: Math.max(selected_target_ids?.length ?? 0, portraits.length),
    liveDetections: legacy.detections ?? [],
    pending,
    error,
    freeze,
    autoSelectSuspect,
    finish,
    clear,
    toggle,
  };
}
