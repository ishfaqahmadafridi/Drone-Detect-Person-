"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRecordingsQuery } from "@/services/queries/useRecordingsQuery";
import { recordingsApi, normalizeRecording } from "@/services/api/recordingsApi";
import { apiErrorMessage } from "@/utils/apiError";
import type { SnapshotFilter, SnapshotItem } from "@/types";

export function useRecordings() {
  const { data, isLoading, isFetching, error, refetch } = useRecordingsQuery();
  const recordings = useMemo(() => data?.snapshots ?? [], [data]);
  const [filterMode, setFilterMode] = useState<SnapshotFilter>("all");
  const [selected, setSelected] = useState<SnapshotItem | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [pending, setPending] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    recordingsApi.getRecordingStatus().then(res => setIsRecording(res.is_recording)).catch(() => undefined);
  }, []);

  const filtered = useMemo(
    () => recordings.filter(item => filterMode === "all" || (item.view_mode ?? "aerial") === filterMode),
    [recordings, filterMode],
  );

  const toggleRecording = useCallback(async () => {
    if (pending) return;
    setPending(true);
    setActionError("");
    try {
      if (isRecording) {
        const res = await recordingsApi.stopRecording();
        setIsRecording(false);
        await refetch();
        if (res.record) setSelected(normalizeRecording(res.record));
      } else {
        await recordingsApi.startRecording();
        setIsRecording(true);
      }
    } catch (err) {
      setActionError(apiErrorMessage(err));
    } finally {
      setPending(false);
    }
  }, [isRecording, pending, refetch]);

  return {
    recordings: filtered,
    total: data?.total ?? recordings.length,
    isLoading,
    isFetching,
    loadError: error ? apiErrorMessage(error) : "",
    refetch,
    filterMode,
    setFilterMode,
    selected,
    open: setSelected,
    close: () => setSelected(null),
    isRecording,
    pending,
    actionError,
    toggleRecording,
  };
}
